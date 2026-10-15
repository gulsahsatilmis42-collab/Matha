export type TaskId = 'mil' | 'round' | 'mental' | 'pattern';

export interface MaarifTask {
  id: string;
  type: TaskId;
  questNumber: number;
  title: string;
  subTitle: string;
  contextText: string;
  storyImage: string;
  questionText: string;
  correctAnswer: string | number;
  options: string[];
  explanation: string;
  socraticClues: string[];
  valueTitle: string;
  valueDescription: string;
  targetCompetency: string;
  interactiveTool: 'abacus' | 'rounding' | 'mental' | 'mosaic';
  initialToolData?: any;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  criteria: string;
  unlocked: boolean;
}

export interface SlideData {
  id: number;
  slideLabel: string;
  title: string;
  category: string;
  theme: 'dark' | 'light';
  relatedTaskId?: TaskId;
  badgeEarned?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: 'gemini' | 'pedagogical-fallback';
}

export interface TeamScore {
  name: string;
  score: number;
  color: string;
}
