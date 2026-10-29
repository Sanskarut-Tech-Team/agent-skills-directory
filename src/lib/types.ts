export interface AISkillFile {
  path: string;
  content: string;
}

export interface AISkill {
  id: string;
  title: string;
  category: string;
  description: string;
  promptContent: string;
  tags: string[];
  author: string;
  dateAdded: string;
  supportedModels?: string[];
  files?: AISkillFile[];
}

export type TargetAI =
  | "ChatGPT"
  | "Claude"
  | "Gemini"
  | "DeepSeek"
  | "Meta Llama"
  | "Midjourney"
  | "Cursor"
  | "v0"
  | string;

export interface AIPrompt {
  id: string;
  title: string;
  targetAI: TargetAI[];
  promptText: string;
  useCase: string;
  copyable: boolean;
  author?: string;
  tags?: string[];
}

export interface ReviewFeedback {
  id: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  content: string;
  verifiedSkill: string;
}
