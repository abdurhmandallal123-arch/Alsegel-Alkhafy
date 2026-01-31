
export enum EvidenceType {
  DOCUMENT = 'DOCUMENT',
  PHOTO = 'PHOTO',
  AUDIO = 'AUDIO',
  NOTE = 'NOTE',
  OBJECT = 'OBJECT'
}

export enum Reliability {
  NEUTRAL = 'NEUTRAL',
  TRUSTED = 'TRUSTED',
  SUSPICIOUS = 'SUSPICIOUS'
}

export enum AnalysisTool {
  MAGNIFIER = 'MAGNIFIER',
  UV_LIGHT = 'UV_LIGHT',
  SCANNER = 'SCANNER'
}

export type Emotion = 'calm' | 'nervous' | 'defensive' | 'pressured' | 'broken';

export enum DifficultyLevel {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
  EXTREME = 'EXTREME'
}

export interface HiddenClue {
  id: string;
  tool: AnalysisTool;
  x: number; // 0-100 percentage
  y: number; // 0-100 percentage
  radius: number;
  description: string;
  revealedText: string;
}

export interface Evidence {
  id: string;
  type: EvidenceType;
  title: string;
  content: string;
  imageUrl?: string;
  reliability: Reliability;
  timestamp?: string;
  discoveredAt: number;
  hiddenClues?: HiddenClue[];
  discoveredClueIds: string[];
  isLocked?: boolean;
  puzzleType?: 'sequence' | 'code' | 'pattern';
  puzzleSolution?: string;
}

export interface Suspect {
  id: string;
  name: string;
  role: string;
  gender: 'male' | 'female';
  description: string;
  portraitUrl: string;
  personality: string;
  secrets: string[];
}

export interface TimelineEvent {
  id: string;
  time: string;
  description: string;
  evidenceId?: string;
}

export interface ConnectionLink {
  id: string;
  fromId: string;
  toId: string;
  note?: string;
}

export interface Case {
  id: string;
  title: string;
  brief: string;
  thumbnailUrl: string;
  fullBackground: string;
  difficulty: DifficultyLevel;
  requiredRank: string;
  estimatedTime: string;
  solution: {
    criminalId: string;
    motive: string;
    method: string;
  };
  evidence: Evidence[];
  suspects: Suspect[];
  timeline: TimelineEvent[];
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  emotion?: Emotion;
}

export interface PlayerStats {
  xp: number;
  rank: string;
  solvedCases: number;
  labCredits: number;
}
