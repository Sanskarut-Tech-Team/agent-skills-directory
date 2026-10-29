import { NextResponse } from 'next/server';
import { getAllSkills, getAllPrompts } from '@/lib/content';

export async function GET() {
  const [skills, prompts] = await Promise.all([
    getAllSkills(),
    getAllPrompts(),
  ]);

  const siteUrl = 'https://apex-ai-skills.vercel.app';

  let content = `# Apex AI Skills

> A curated, production-grade library of deterministic AI skill specifications and prompt engineering blueprints for frontier LLMs (ChatGPT, Claude 3.5, Google Gemini, DeepSeek, Meta Llama, Midjourney, Cursor, and v0).

- Website: ${siteUrl}
- Skills Directory: ${siteUrl}/skills
- Prompts Catalog: ${siteUrl}/prompts
- Contribution: ${siteUrl}/contribute
- Contact: ${siteUrl}/contact
- Full Text & Prompt Contents: ${siteUrl}/llms-full.txt

## AI Skills (Multi-File Blueprints)
Structured system instructions and tool calling schemas:

`;

  for (const skill of skills) {
    content += `### ${skill.title}
- ID: \`${skill.id}\`
- Category: ${skill.category}
- Supported Models: ${(skill.supportedModels || ['Claude', 'ChatGPT']).join(', ')}
- Description: ${skill.description}
- URL: ${siteUrl}/skills?q=${encodeURIComponent(skill.id)}
- Tags: ${skill.tags.join(', ')}

`;
  }

  content += `## Production Prompts Catalog
Calibrated prompts engineered for zero hallucinations:

`;

  for (const prompt of prompts) {
    content += `### ${prompt.title}
- ID: \`${prompt.id}\`
- Use Case: ${prompt.useCase}
- Target Models: ${prompt.targetAI.join(', ')}
- URL: ${siteUrl}/prompts?q=${encodeURIComponent(prompt.id)}
- Tags: ${(prompt.tags || []).join(', ')}

`;
  }

  content += `## Sanskarut Contribution Criteria
1. Zero-Fluff & Deterministic Yield: Output must be typed and eliminate conversational pleasantries.
2. Multi-Model Verification: Tested against at least one frontier model.
3. Multi-File Skill Structure: Include SKILL.md and relative config files.
4. Repository Isolation: Prompts live in /content/prompts/ and skills in /content/skills/<slug>/.
`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
