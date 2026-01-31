
import { Case, EvidenceType, Reliability, AnalysisTool, DifficultyLevel } from './types';

export const CASES: Case[] = [
  {
    id: 'case-001',
    title: 'القفص المذهب',
    brief: 'وُجد الملياردير "آرثر" ميتاً في مكتبه المحصن. الباب مغلق من الداخل والنافذة لا تفتح. كيف دخل الموت؟',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519391056207-b8071ad4294e?auto=format&fit=crop&q=80&w=800',
    fullBackground: 'تم العثور على جثة آرثر جالساً على مكتبه. التقرير الطبي الأولي يشير لسكتة قلبية، لكن زوجته تصر على أنه قُتل بسبب اختفاء قرص صلب يحتوي على بيانات مشفرة.',
    difficulty: DifficultyLevel.EASY,
    requiredRank: 'مبتدئ',
    estimatedTime: '20 دقيقة',
    solution: {
      criminalId: 'suspect-assistant',
      motive: 'اكتشف آرثر اختلاس سارة لملايين الدولارات عبر ثغرة في النظام، وكان سيبلغ السلطات في الصباح.',
      method: 'استخدمت جهاز ترددات نبضية عالي الدقة وضعته خلف لوحة فنية، مما أدى لتعطيل جهاز تنظيم ضربات القلب الخاص به عن بعد.'
    },
    evidence: [
      {
        id: 'ev-1-1', type: EvidenceType.PHOTO, title: 'كوب القهوة', content: 'كوب سيراميك وُجد على المكتب بجانب جثة الضحية.',
        imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800',
        reliability: Reliability.NEUTRAL, discoveredAt: Date.now(), discoveredClueIds: [],
        hiddenClues: [{ id: 'c1', tool: AnalysisTool.MAGNIFIER, x: 45, y: 55, radius: 8, description: 'ترسبات بيضاء', revealedText: 'آثار مادة مهدئة كانت ستمنعه من المقاومة.' }]
      },
      {
        id: 'ev-1-2', type: EvidenceType.OBJECT, title: 'لوحة فنية معلقة', content: 'لوحة تجريدية تقع خلف كرسي الضحية مباشرة.',
        imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800',
        reliability: Reliability.NEUTRAL, discoveredAt: Date.now(), discoveredClueIds: [],
        hiddenClues: [{ id: 'c2', tool: AnalysisTool.SCANNER, x: 80, y: 20, radius: 10, description: 'جسم غريب', revealedText: 'جهاز إلكتروني يصدر نبضات كهرومغناطيسية موجهة.' }]
      },
      {
        id: 'ev-1-3', type: EvidenceType.DOCUMENT, title: 'سجل طبي', content: 'ملف الحالة الصحية لآرثر، يوضح اعتماده على جهاز تنظيم ضربات القلب.',
        imageUrl: 'https://images.unsplash.com/photo-1504813184591-01592fd03cf3?auto=format&fit=crop&q=80&w=800',
        reliability: Reliability.TRUSTED, discoveredAt: Date.now(), discoveredClueIds: [],
        hiddenClues: [{ id: 'c3', tool: AnalysisTool.UV_LIGHT, x: 10, y: 10, radius: 15, description: 'بصمة إصبع باهتة', revealedText: 'بصمة تعود للمساعدة الشخصية، رغم ادعائها عدم لمس الملف.' }]
      },
      {
        id: 'ev-1-4', type: EvidenceType.OBJECT, title: 'ساعة يد محطمة', content: 'ساعة آرثر توقفت في لحظة الوفاة بدقة متناهية.',
        imageUrl: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ad5?auto=format&fit=crop&q=80&w=800',
        reliability: Reliability.NEUTRAL, discoveredAt: Date.now(), discoveredClueIds: [],
        hiddenClues: [{ id: 'c4', tool: AnalysisTool.MAGNIFIER, x: 50, y: 50, radius: 10, description: 'تلف كهرومغناطيسي', revealedText: 'التروس الداخلية تظهر علامات تعرض لحقل مغناطيسي قوي فجائي.' }]
      }
    ],
    suspects: [
      { id: 'suspect-assistant', name: 'سارة المنصور', role: 'المساعدة الشخصية', gender: 'female', description: 'تعمل معه منذ 10 سنوات وتعرف كل أسراره.', portraitUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=300', personality: 'هادئة ومنظمة جداً.', secrets: ['تختلس مبالغ ضخمة لسداد ديون قمار.'] },
      { id: 'suspect-wife', name: 'ليلى الهاشم', role: 'الزوجة', gender: 'female', description: 'عارضة أزياء سابقة تعيش حياة بذخ.', portraitUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300', personality: 'متذمرة وتشعر بالوحدة.', secrets: ['كانت تخطط لطلب الطلاق والحصول على نصف الثروة.'] },
      { id: 'suspect-rival', name: 'ياسين فوزي', role: 'المنافس التجاري', gender: 'male', description: 'خسر صفقة بمليارات الدولارات لصالح آرثر الشهر الماضي.', portraitUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300', personality: 'عدواني وطموح.', secrets: ['قام بتهديد آرثر علناً في النادي الاجتماعي.'] },
      { id: 'suspect-bodyguard', name: 'كريم صقر', role: 'رئيس الأمن', gender: 'male', description: 'كان مسؤولاً عن حماية الجناح ليلة الحادث.', portraitUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300', personality: 'صامت ومطيع.', secrets: ['كان نائماً في الوردية وتم توبيخه من آرثر قبل ساعة من الوفاة.'] }
    ],
    timeline: [{ id: 't1', time: '10:45 م', description: 'سارة المنصور تضع القهوة وتغادر.' }]
  },
  {
    id: 'case-002',
    title: 'صدى الأوبرا',
    brief: 'سقوط السوبرانو "إيزابيل" ميتة في منتصف عرضها الأخير. المسرح كان مليئاً بالشهود لكن القاتل اختفى.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&q=80&w=800',
    fullBackground: 'في ذروة النوتة العالية، توقفت إيزابيل فجأة وسقطت. غرفتها كانت مغلقة، والميكروفون كان يعاني من تشويش غريب قبل الحادث.',
    difficulty: DifficultyLevel.MEDIUM,
    requiredRank: 'محقق مشارك',
    estimatedTime: '25 دقيقة',
    solution: {
      criminalId: 'suspect-rival-opera',
      motive: 'إيزابيل كانت تبتز منيرة صبري بتسجيلات تثبت تورطها في تزوير مسابقة عالمية.',
      method: 'وضعت غاز أعصاب مركز داخل بخاخ الحنجرة الذي تستخدمه إيزابيل قبل العرض مباشرة.'
    },
    evidence: [
      {
        id: 'ev-2-1', type: EvidenceType.OBJECT, title: 'بخاخ الحنجرة', content: 'بخاخ ذهبي صغير وُجد تحت جثة الضحية.',
        imageUrl: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&q=80&w=800',
        reliability: Reliability.NEUTRAL, discoveredAt: Date.now(), discoveredClueIds: [],
        hiddenClues: [{ id: 'c2-1', tool: AnalysisTool.UV_LIGHT, x: 20, y: 80, radius: 15, description: 'سائل لزج', revealedText: 'بقايا مادة سامة مركزة عديمة اللون.' }]
      },
      {
        id: 'ev-2-2', type: EvidenceType.OBJECT, title: 'ميكروفون لاسلكي', content: 'الميكروفون الذي كانت تستخدمه إيزابيل.',
        imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800',
        reliability: Reliability.SUSPICIOUS, discoveredAt: Date.now(), discoveredClueIds: [],
        hiddenClues: [{ id: 'c2-2', tool: AnalysisTool.SCANNER, x: 50, y: 50, radius: 10, description: 'جهاز تشويش', revealedText: 'تعديل تقني يهدف لإخفاء صوت اختناق الضحية عن الجمهور.' }]
      }
    ],
    suspects: [
      { id: 'suspect-rival-opera', name: 'منيرة صبري', role: 'المنافسة اللدود', gender: 'female', description: 'البديلة الدائمة لإيزابيل.', portraitUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300', personality: 'طموحة ومضطربة عاطفياً.', secrets: ['اشترت مادة كيميائية محظورة من السوق السوداء.'] },
      { id: 'suspect-engineer', name: 'حسام خليل', role: 'مهندس الصوت', gender: 'male', description: 'المسؤول التقني عن جودة الصوت في الأوبرا.', portraitUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300', personality: 'منعزل وغريب الأطوار.', secrets: ['كان يسرق معدات غالية الثمن وإيزابيل اكتشفته.'] }
    ],
    timeline: [{ id: 't2', time: '07:30 م', description: 'دخول شخص مجهول لغرفة تبديل الملابس.' }]
  },
  {
    id: 'case-003',
    title: 'سمفونية الرماد',
    brief: 'حريق غامض في مكتبة "المخطوطات الضائعة" يودي بحياة أمينها. هل كان حادثاً أم تغطية لجريمة؟',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800',
    fullBackground: 'تم العثور على جثة الأمين داخل القبو المحصن ضد الحريق. الغريب أن أجهزة استشعار الدخان تم تعطيلها يدوياً قبل الحريق بخمس دقائق.',
    difficulty: DifficultyLevel.MEDIUM,
    requiredRank: 'محقق مشارك',
    estimatedTime: '30 دقيقة',
    solution: {
      criminalId: 'suspect-scholar',
      motive: 'سرقة مخطوطة نادرة تثبت أن بحثه الأكاديمي الشهير مسروق من عالم قديم.',
      method: 'خنق الأمين بسلك رفيع ثم أشعل الحريق باستخدام مواد كيميائية سريعة الاشتعال لإخفاء آثار الجريمة.'
    },
    evidence: [
      {
        id: 'ev-3-1', type: EvidenceType.OBJECT, title: 'نظارات محطمة', content: 'نظارات الضحية وُجدت بعيدة عن الجثة.',
        imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800',
        reliability: Reliability.NEUTRAL, discoveredAt: Date.now(), discoveredClueIds: [],
        hiddenClues: [{ id: 'c3-1', tool: AnalysisTool.MAGNIFIER, x: 50, y: 50, radius: 10, description: 'خمش دقيق', revealedText: 'آثار جلد بشري تحت فصال النظارة تشير لتعرض الضحية لهجوم.' }]
      }
    ],
    suspects: [
      { id: 'suspect-scholar', name: 'د. يوسف زاهر', role: 'باحث تاريخي', gender: 'male', description: 'صديق قديم للضحية ومهتم بالمخطوطات.', portraitUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300', personality: 'متغطرس وذكي.', secrets: ['لديه حروق طفيفة في يده اليمنى يدعي أنها من المطبخ.'] }
    ],
    timeline: [{ id: 't3', time: '01:15 ص', description: 'تعطيل نظام الإنذار من لوحة التحكم الرئيسية.' }]
  },
  {
    id: 'case-004',
    title: 'شيفرة النيون',
    brief: 'اختفاء مبرمج عبقري من داخل غرفة خادم مؤمنة بيومترياً. ترك وراءه رسالة مشفرة على الشاشة.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    fullBackground: 'غرفة الخادم تتطلب بصمة العين واليد. الكاميرات لم تسجل خروج المبرمج، لكن ملابسه وُجدت مرتبة على الكرسي وكأنه تبخر.',
    difficulty: DifficultyLevel.HARD,
    requiredRank: 'محقق أول',
    estimatedTime: '35 دقيقة',
    solution: {
      criminalId: 'suspect-ceo',
      motive: 'المبرمج اكتشف باباً خلفياً في نظام الشركة يسمح بغسل الأموال لصالح منظمات خارجية.',
      method: 'استدرجه لغرفة الخادم التي تحتوي على تسريب غاز تبريد سام، ثم نقل الجثة عبر ممر التهوية باستخدام روبوت صيانة.'
    },
    evidence: [
      {
        id: 'ev-4-1', type: EvidenceType.DOCUMENT, title: 'سجل الأخطاء', content: 'سجل نظام الخادم ليلة الاختفاء.',
        imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=800',
        reliability: Reliability.NEUTRAL, discoveredAt: Date.now(), discoveredClueIds: [],
        hiddenClues: [{ id: 'c4-1', tool: AnalysisTool.SCANNER, x: 10, y: 90, radius: 12, description: 'كود مخفي', revealedText: 'رسالة مشفرة تقول: "المدير يعرف المستودع 404".' }]
      }
    ],
    suspects: [
      { id: 'suspect-ceo', name: 'عمر الحديدي', role: 'المدير التنفيذي', gender: 'male', description: 'مؤسس شركة التقنية الرائدة.', portraitUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300', personality: 'بارد وسلطوي.', secrets: ['يمتلك مفتاحاً يدوياً للطوارئ يفتح جميع الغرف.'] }
    ],
    timeline: [{ id: 't4', time: '03:00 ص', description: 'انخفاض مفاجئ في درجة حرارة غرفة الخوادم.' }]
  },
  {
    id: 'case-005',
    title: 'سم الوريد',
    brief: 'وفاة عارضة أزياء مشهورة أثناء جلسة تصوير خاصة. السبب الظاهري: حساسية حادة. الحقيقة: أعمق من ذلك.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800',
    fullBackground: 'كانت الضحية تشرب زجاجة ماء خاصة بها دائماً. التحاليل لم تجد شيئاً في الماء، لكنها توفيت بعد دقائق من ارتداء فستان "الحرير الأسود".',
    difficulty: DifficultyLevel.MEDIUM,
    requiredRank: 'محقق مشارك',
    estimatedTime: '25 دقيقة',
    solution: {
      criminalId: 'suspect-designer',
      motive: 'الضحية كانت تهدد بالانتقال لمنافس وتدمير علامته التجارية الجديدة.',
      method: 'حقن الفستان بمادة سمية تخترق الجلد عند التعرق، مما أدى لتوقف عضلة القلب بشكل يبدو طبيعياً.'
    },
    evidence: [
      {
        id: 'ev-5-1', type: EvidenceType.OBJECT, title: 'الفستان الأسود', content: 'الفستان الذي كانت ترتديه الضحية.',
        imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800',
        reliability: Reliability.NEUTRAL, discoveredAt: Date.now(), discoveredClueIds: [],
        hiddenClues: [{ id: 'c5-1', tool: AnalysisTool.UV_LIGHT, x: 70, y: 30, radius: 10, description: 'بقعة باهتة', revealedText: 'آثار مادة "الريسين" السامة مرشوشة على البطانة الداخلية.' }]
      }
    ],
    suspects: [
      { id: 'suspect-designer', name: 'كارل فوس', role: 'مصمم الأزياء', gender: 'male', description: 'مبدع غريب الأطوار ومشهور بتصاميمه.', portraitUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300', personality: 'مهووس بالكمال.', secrets: ['يعاني من إفلاس مالي وشيك.'] }
    ],
    timeline: [{ id: 't5', time: '01:00 م', description: 'المصمم يصر على تجربة الفستان بمفرده مع الضحية.' }]
  },
  {
    id: 'case-006',
    title: 'موت في المزاد',
    brief: 'رجل أعمال يسقط ميتاً لحظة فوزه بمزاد على "الماسة الزرقاء". القاعة كانت مؤمنة وأجهزة الكشف لم تجد أسلحة.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=800',
    fullBackground: 'سقط الضحية فور لمسه لمطرقة المزاد الخشبية احتفالاً بالنصر. القاعة مؤمنة وأجهزة الكشف لم تجد أسلحة.',
    difficulty: DifficultyLevel.HARD,
    requiredRank: 'محقق أول',
    estimatedTime: '30 دقيقة',
    solution: {
      criminalId: 'suspect-auctioneer',
      motive: 'الضحية كان يخطط لكشف أن الماسة الزرقاء المعروضة هي نسخة مزيفة صنعها الدلال.',
      method: 'وضع إبرة مجهرية مسمومة داخل قبضة مطرقة المزاد، تبرز فقط عند الضغط القوي عليها.'
    },
    evidence: [
      {
        id: 'ev-6-1', type: EvidenceType.OBJECT, title: 'مطرقة المزاد', content: 'المطرقة التي استخدمها الدلال والضحية.',
        imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
        reliability: Reliability.NEUTRAL, discoveredAt: Date.now(), discoveredClueIds: [],
        hiddenClues: [{ id: 'c6-1', tool: AnalysisTool.MAGNIFIER, x: 90, y: 10, radius: 5, description: 'ثقب مجهري', revealedText: 'آلية ميكانيكية دقيقة لإطلاق سم سريع المفعول.' }]
      }
    ],
    suspects: [
      { id: 'suspect-auctioneer', name: 'أحمد سالم', role: 'الدلال', gender: 'male', description: 'خبير تحف مشهور بإدارة المزادات الكبرى.', portraitUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300', personality: 'فصيح ولبق.', secrets: ['لديه معمل سري لتزييف الأحجار الكريمة.'] }
    ],
    timeline: [{ id: 't6', time: '09:00 م', description: 'الدلال يستبدل مطرقة المزاد بـ "المطرقة الرسمية".' }]
  },
  {
    id: 'case-007',
    title: 'جريمة في الـ 18',
    brief: 'لاعب جولف محترف يُقتل في الحفرة الأخيرة من البطولة العالمية. لا يوجد أحد بالقرب منه في الملعب المفتوح.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&q=80&w=800',
    fullBackground: 'أصيب الضحية في جبهته وسقط فجأة. لم يسمع أحد صوت رصاص، والملعب محاط بغابات كثيفة لكنها بعيدة جداً عن مدى القناصة التقليديين.',
    difficulty: DifficultyLevel.EXTREME,
    requiredRank: 'كبير المحققين',
    estimatedTime: '40 دقيقة',
    solution: {
      criminalId: 'suspect-caddy',
      motive: 'اللاعب كان يسيء معاملته جسدياً وابتزه لسنوات بعقود احتكار ظالمة.',
      method: 'استخدم طائرة درون صغيرة مبرمجة لضرب كرات جولف معدنية بسرعة هائلة من مسافة قريبة جداً، ثم سحبها للأعلى بسرعة.'
    },
    evidence: [
      {
        id: 'ev-7-1', type: EvidenceType.PHOTO, title: 'كرة الجولف', content: 'الكرة التي كانت بجانب الجثة.',
        imageUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=800',
        reliability: Reliability.NEUTRAL, discoveredAt: Date.now(), discoveredClueIds: [],
        hiddenClues: [{ id: 'c7-1', tool: AnalysisTool.SCANNER, x: 50, y: 50, radius: 10, description: 'وزن غير طبيعي', revealedText: 'كرة جولف معدنية مموهة بالبلاستيك، تزن 3 أضعاف الكرة الطبيعية.' }]
      }
    ],
    suspects: [
      { id: 'suspect-caddy', name: 'سامي', role: 'حامل المضارب', gender: 'male', description: 'يرافق اللاعب في كل تحركاته.', portraitUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=300', personality: 'منطوي ومطيع.', secrets: ['خبير في هندسة الطيران والتحكم عن بعد.'] }
    ],
    timeline: [{ id: 't7', time: '04:30 م', description: 'سماع صوت طنين خفيف جداً قبل الحادث.' }]
  },
  {
    id: 'case-008',
    title: 'همس الساعات',
    brief: 'وُجد صانع الساعات العجوز ميتاً داخل ورشته، مغلقاً عليه من الداخل. الساعة العملاقة توقفت في لحظة وفاته.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ad5?auto=format&fit=crop&q=80&w=800',
    fullBackground: 'الورشة مليئة بالساعات التي تعمل بتزامن غريب. الضحية كان يمسك بساعة جيب نادرة جداً لم تُكتمل بعد.',
    difficulty: DifficultyLevel.MEDIUM,
    requiredRank: 'محقق مشارك',
    estimatedTime: '25 دقيقة',
    solution: {
      criminalId: 'suspect-apprentice',
      motive: 'سرقة سر "الحركة الدائمة" التي كان العجوز على وشك إتمامها.',
      method: 'أطلق زنبركاً قوياً جداً كان مضغوطاً داخل آلية الباب، مما أدى لكسر رقبة الضحية عند فتحه للباب من الداخل.'
    },
    evidence: [
      {
        id: 'ev-8-1', type: EvidenceType.OBJECT, title: 'ساعة الجيب', content: 'الساعة التي كان يمسكها الضحية.',
        imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800',
        reliability: Reliability.NEUTRAL, discoveredAt: Date.now(), discoveredClueIds: [],
        hiddenClues: [{ id: 'c8-1', tool: AnalysisTool.MAGNIFIER, x: 30, y: 70, radius: 8, description: 'بصمة ناقصة', revealedText: 'بصمات المتدرب موجودة داخل التروس الداخلية للساعة.' }]
      }
    ],
    suspects: [
      { id: 'suspect-apprentice', name: 'لؤي', role: 'المتدرب', gender: 'male', description: 'شاب طموح يعمل في الورشة منذ سنتين.', portraitUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300', personality: 'هادئ ومراقب جيد.', secrets: ['كان يبيع تصاميم المعلم لشركات سويسرية سراً.'] }
    ],
    timeline: [{ id: 't8', time: '11:00 م', description: 'سماع صوت "طقطقة" معدنية قوية في الورشة.' }]
  },
  {
    id: 'case-009',
    title: 'أسرار الأعماق',
    brief: 'وفاة عالمة بحار داخل مختبر تحت الماء. الأكسجين كان كافياً، لكنها اختنقت بالماء في غرفتها الجافة.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&q=80&w=800',
    fullBackground: 'المختبر يقع على عمق 200 متر. وُجدت جثة العالمة في سريرها، ورئتاها ممتلئتان بماء البحر المالح، رغم عدم وجود أي تسريب في القبو.',
    difficulty: DifficultyLevel.HARD,
    requiredRank: 'محقق أول',
    estimatedTime: '30 دقيقة',
    solution: {
      criminalId: 'suspect-biologist',
      motive: 'الضحية كانت ستلغي تمويل مشروع أبحاثه الجينية المثير للجدل.',
      method: 'حقن كيس المحلول الوريدي الذي تستخدمه للنوم بماء بحر مركز جداً، مما أدى لوذمة رئوية حادة وموت شبيه بالغرق.'
    },
    evidence: [
      {
        id: 'ev-9-1', type: EvidenceType.OBJECT, title: 'كيس المحلول', content: 'كيس التغذية والترطيب بجانب السرير.',
        imageUrl: 'https://images.unsplash.com/photo-1516670428252-df97bba108d1?auto=format&fit=crop&q=80&w=800',
        reliability: Reliability.NEUTRAL, discoveredAt: Date.now(), discoveredClueIds: [],
        hiddenClues: [{ id: 'c9-1', tool: AnalysisTool.SCANNER, x: 20, y: 20, radius: 15, description: 'ملوحة عالية', revealedText: 'نسبة الملوحة في المحلول مطابقة لماء المحيط الخارجي.' }]
      }
    ],
    suspects: [
      { id: 'suspect-biologist', name: 'د. خالد', role: 'عالم أحياء', gender: 'male', description: 'باحث في الجينات البحرية.', portraitUrl: 'https://images.unsplash.com/photo-1537367636760-4c5b2404544e?auto=format&fit=crop&q=80&w=300', personality: 'مهووس بنتائج أبحاثه.', secrets: ['قام بتزوير نتائج تجاربه الأخيرة لتجنب إلغاء المشروع.'] }
    ],
    timeline: [{ id: 't9', time: '10:00 م', description: 'د. خالد يغير أكياس المحلول لجميع أفراد الطاقم.' }]
  },
  {
    id: 'case-010',
    title: 'المذاق الأخير',
    brief: 'سقوط شيف مشهور أثناء بث مباشر لبرنامج طبخ. الجميع تذوق الطعام، لكن هو فقط من تسمم.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800',
    fullBackground: 'كان الشيف "باسل" يحضر طبق "شوربة الفطر" الأسطوري. تذوق ملعقة واحدة وسقط فوراً. الغريب أن الضيوف أكلوا من نفس القدر ولم يصابوا بأذى.',
    difficulty: DifficultyLevel.HARD,
    requiredRank: 'محقق أول',
    estimatedTime: '35 دقيقة',
    solution: {
      criminalId: 'suspect-assistant-chef',
      motive: 'الشيف باسل كان يسرق وصفات مساعده وينسبها لنفسه، وكان يخطط لطرده في نهاية الموسم.',
      method: 'وضع السم على ملعقة التذوق الشخصية الخاصة بالشيف فقط، وليس في الطعام نفسه.'
    },
    evidence: [
      {
        id: 'ev-10-1', type: EvidenceType.OBJECT, title: 'ملعقة تذوق خشبية', content: 'الملعقة التي استخدمها الشيف في لحظاته الأخيرة.',
        imageUrl: 'https://images.unsplash.com/photo-1591871937573-74dbba515c4c?auto=format&fit=crop&q=80&w=800',
        reliability: Reliability.NEUTRAL, discoveredAt: Date.now(), discoveredClueIds: [],
        hiddenClues: [{ id: 'c10-1', tool: AnalysisTool.UV_LIGHT, x: 80, y: 20, radius: 10, description: 'بقعة عديمة اللون', revealedText: 'آثار لسم السيانيد المركز على طرف الملعقة.' }]
      }
    ],
    suspects: [
      { id: 'suspect-assistant-chef', name: 'كريم الهاشم', role: 'مساعد الشيف', gender: 'male', description: 'يعمل خلف الكواليس ويقوم بكل العمل الشاق.', portraitUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=300', personality: 'هادئ ومستاء.', secrets: ['لديه مدونة سرية ينشر فيها وصفاته المسروقة.'] }
    ],
    timeline: [{ id: 't10', time: '08:00 م', description: 'كريم يجهز أدوات الطبخ الشخصية للشيف باسل.' }]
  }
];
