import { NextResponse } from 'next/server';
import { getAllSkills, getAllPrompts } from '@/lib/content';

export async function GET() {
  const [skills, prompts] = await Promise.all([
    getAllSkills(),
    getAllPrompts(),
  ]);

  const siteUrl = 'https://apex-ai-skills.vercel.app';

  let content = `# Apex AI Skills — Full Knowledge Base & Prompt Specifications

> Complete collection of raw prompt texts, system instructions, and multi-file schemas for autonomous AI models and code generators.
> Source: ${siteUrl}

---

# 1. AI Skills Detailed Specifications

`;

  for (const skill of skills) {
    content += `## Skill: ${skill.title}
- ID: ${skill.id}
- Category: ${skill.category}
- Supported Models: ${(skill.supportedModels || []).join(', ')}
- Tags: ${skill.tags.join(', ')}
- Description: ${skill.description}

### Primary Prompt Content / System Instructions:
\`\`\`text
${skill.promptContent}
\`\`\`

`;

    if (skill.files && skill.files.length > 0) {
      content += `### Included Package Files:\n\n`;
      for (const file of skill.files) {
        content += `#### File: \`${file.path}\`\n\`\`\`text\n${file.content}\n\`\`\`\n\n`;
      }
    }

    content += `---\n\n`;
  }

  content += `# 2. Production Prompts Detailed Catalog\n\n`;

  for (const prompt of prompts) {
    content += `## Prompt: ${prompt.title}
- ID: ${prompt.id}
- Use Case: ${prompt.useCase}
- Target AI: ${prompt.targetAI.join(', ')}
- Tags: ${(prompt.tags || []).join(', ')}

### Prompt Template:
\`\`\`text
${prompt.promptText}
\`\`\`

---\n\n`;
  }

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
