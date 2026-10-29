export type SkillCategory =
  | "Code & DevOps"
  | "Architecture & Data"
  | "Writing & Strategy"
  | "Security & Auditing"
  | "Workflow & Automation";

export interface SkillParameter {
  name: string;
  type: "string" | "number" | "boolean" | "select";
  description: string;
  required: boolean;
  options?: string[];
  default?: string | number | boolean;
}

export interface SkillEntry {
  id: string;
  title: string;
  slug: string;
  category: SkillCategory;
  author: string;
  stars: number;
  version: string;
  tags: string[];
  summary: string;
  compatibility: string[];
  parameters: SkillParameter[];
  executablePrompt: string;
  sampleInput: Record<string, any>;
  sampleOutput: string | Record<string, any>;
}

export interface AISkillFile {
  path: string;
  content: string;
}

export interface AISkill extends SkillEntry {
  // Backward compatibility fields mapped from SkillEntry
  description: string;
  promptContent: string;
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
