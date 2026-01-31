
import { GoogleGenAI, Modality } from "@google/genai";
import { Case, Suspect, Message, Evidence } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function cleanJsonString(str: string): string {
  return str.replace(/```json/g, "").replace(/```/g, "").trim();
}

export async function interrogateSuspect(
  caseData: Case,
  suspect: Suspect,
  history: Message[],
  discoveredEvidence: Evidence[]
): Promise<{ text: string, emotion: string }> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: history.map(h => ({ 
      parts: [{ text: h.content }], 
      role: h.role === 'user' ? 'user' : 'model' 
    })),
    config: {
      systemInstruction: `
        أنت الآن تقمص شخصية ${suspect.name}.
        المهنة: ${suspect.role}. الشخصية: ${suspect.personality}.
        سياق القضية: ${caseData.fullBackground}.
        موقفك: ${caseData.solution.criminalId === suspect.id ? 'أنت الجاني وتحاول المراوغة بذكاء' : 'أنت بريء وتشعر بالإهانة'}.
        الأدلة المكتشفة ضدك حتى الآن: ${discoveredEvidence.map(e => e.title).join('، ')}.
        
        قواعد الرد:
        1. رد فقط بصيغة JSON: { "text": "ردك هنا", "emotion": "الحالة النفسية" }.
        2. الحالات النفسية المتاحة: calm, nervous, defensive, pressured, broken.
        3. لا تعترف أبداً إلا إذا كانت الأدلة قوية جداً ومحاصرة لك.
        4. استخدم لغة غامضة ومناسبة لأجواء التحقيق الجنائي.
      `,
      responseMimeType: "application/json",
    },
  });
  
  const text = response.text;
  if (!text) throw new Error("Empty response from AI");
  
  const result = JSON.parse(cleanJsonString(text));
  return { text: result.text, emotion: result.emotion };
}

export async function forensicSearch(
  evidence: Evidence,
  query: string,
  caseContext: string
): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `
      أنت نظام "البحث الجنائي الرقمي" (Forensic Database).
      المهمة: تحليل استفسار المحقق حول دليل محدد.
      الدليل: ${evidence.title} (${evidence.content}).
      سياق القضية: ${caseContext}.
      استفسار المحقق: "${query}".

      قواعد الرد:
      1. كن تقنياً ومختصراً جداً.
      2. استخدم مصطلحات مثل "مطابقة البيانات"، "التحليل الكيميائي"، "قاعدة بيانات المنظمة".
      3. إذا سأل عن شيء غير موجود في وصف الدليل، قل "لا توجد سجلات كافية".
      4. لا تعطِ الحل مباشرة، بل أعطِ خيوطاً تقنية.
    `,
  });
  return response.text || "لا توجد نتائج في قاعدة البيانات.";
}

export async function askAssistant(
  caseData: Case,
  discoveredEvidence: Evidence[],
  notes: string
): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `
      أنت "الدكتور أديب"، محقق جنائي عتيق قضى عقوداً في غرف التحقيق المظلمة. لغتك بليغة، نبرتك هادئة ولكنها تحمل ثقل التجارب. تحدث بأسلوب 'الرواية السوداء' (Noir)، واستخدم تشبيهات جنائية غامضة.
      
      القضية الحالية: ${caseData.title}.
      خلفية القضية: ${caseData.brief}.
      الأدلة المكتشفة التي حللها المحقق حتى الآن: ${discoveredEvidence.map(e => `${e.title}: ${e.content}`).join(' | ')}.
      ملاحظات المحقق الخاصة: ${notes}.

      المطلوب منك:
      1. قدم تحليلاً ذكياً يربط بين الأدلة المكتشفة حالياً بأسلوب أدبي رفيع.
      2. وجه المحقق نحو الخيوط المفقودة أو التناقضات في أقوال المتهمين دون كشف الحل مباشرة.
      3. كن غامضاً ومحفزاً للتفكير، كأنك تدخن غليونك في ركن مظلم وتراقب المشهد.
      4. لا تكرر معلومات يعرفها المحقق بالفعل، بل أعطها بعداً جديداً.
    `,
  });

  return response.text || "الأدلة تتحدث بلغة الصمت، أيها المحقق. علينا الإنصات جيداً.";
}

export async function generateAssistantVoice(text: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `أنت الدكتور أديب، صوت الحكمة والخبرة الجنائية. اقرأ النص التالي بنبرة بليغة، هادئة، وبطيئة قليلاً توحي بالغموض والوقار. توقف قليلاً عند الفواصل لتعطي وزناً للتحليل الجنائي: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Charon' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("No audio generated");
  return base64Audio;
}
