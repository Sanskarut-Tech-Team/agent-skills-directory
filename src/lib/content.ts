import fs from 'node:fs';
import path from 'node:path';
import { AISkill, AIPrompt, AISkillFile } from './types';

const contentSkillsDir = path.join(process.cwd(), 'content', 'skills');
const contentPromptsDir = path.join(process.cwd(), 'content', 'prompts');

export async function getAllSkills(): Promise<AISkill[]> {
  try {
    if (fs.existsSync(contentSkillsDir)) {
      const items = fs.readdirSync(contentSkillsDir);
      const skills: AISkill[] = [];

      for (const item of items) {
        const itemPath = path.join(contentSkillsDir, item);
        const stat = fs.statSync(itemPath);

        // Check if item is a folder: /content/skills/<skill-slug>/
        if (stat.isDirectory()) {
          const skillJsonPath = path.join(itemPath, 'skill.json');
          if (fs.existsSync(skillJsonPath)) {
            const data: any = JSON.parse(fs.readFileSync(skillJsonPath, 'utf-8'));

            // Map fields for full backward compatibility
            data.description = data.summary || data.description || '';
            data.promptContent = data.executablePrompt || data.promptContent || '';
            data.dateAdded = data.dateAdded || '2026-04-20';
            data.supportedModels = data.compatibility || data.supportedModels || ['Claude Code', 'Cursor'];

            // Check if there are other files in the folder
            const readDirRecursive = (dir: string, base = ''): AISkillFile[] => {
              const res: AISkillFile[] = [];
              const entries = fs.readdirSync(dir);
              for (const e of entries) {
                if (e === 'skill.json') continue;
                const full = path.join(dir, e);
                const rel = base ? `${base}/${e}` : e;
                if (fs.statSync(full).isDirectory()) {
                  res.push(...readDirRecursive(full, rel));
                } else {
                  res.push({
                    path: rel,
                    content: fs.readFileSync(full, 'utf-8'),
                  });
                }
              }
              return res;
            };

            const diskFiles = readDirRecursive(itemPath);
            if (diskFiles.length > 0) {
              data.files = diskFiles;
            }

            skills.push(data as AISkill);
          }
        } else if (item.endsWith('.json')) {
          const data: any = JSON.parse(fs.readFileSync(itemPath, 'utf-8'));
          data.description = data.summary || data.description || '';
          data.promptContent = data.executablePrompt || data.promptContent || '';
          data.dateAdded = data.dateAdded || '2026-04-20';
          data.supportedModels = data.compatibility || data.supportedModels || ['Claude Code', 'Cursor'];
          skills.push(data as AISkill);
        }
      }

      return skills.sort((a, b) => (b.stars || 0) - (a.stars || 0));
    }
  } catch (error) {
    console.error('Error reading skills from content/skills:', error);
  }
  return [];
}

export async function getSkillById(id: string): Promise<AISkill | null> {
  const skills = await getAllSkills();
  return skills.find((s) => s.id === id || s.slug === id) || null;
}

export async function getAllPrompts(): Promise<AIPrompt[]> {
  try {
    if (fs.existsSync(contentPromptsDir)) {
      const files = fs.readdirSync(contentPromptsDir).filter((f) => f.endsWith('.json'));
      const prompts: AIPrompt[] = [];
      for (const file of files) {
        const fullPath = path.join(contentPromptsDir, file);
        const data: AIPrompt = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
        prompts.push(data);
      }
      return prompts;
    }
  } catch (error) {
    console.error('Error reading prompts from content/prompts:', error);
  }
  return [];
}

export async function getPromptById(id: string): Promise<AIPrompt | null> {
  const prompts = await getAllPrompts();
  return prompts.find((p) => p.id === id) || null;
}
