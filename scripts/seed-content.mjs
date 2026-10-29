import fs from 'node:fs';
import path from 'node:path';

const skillsDir = path.resolve('content/skills');
const promptsDir = path.resolve('content/prompts');

fs.mkdirSync(skillsDir, { recursive: true });
fs.mkdirSync(promptsDir, { recursive: true });

// Read src/data/skillsData.ts file content directly or parse json to avoid TS ESM file extension issues in node
const skillsDataTsPath = path.resolve('src/data/skillsData.ts');
const fileContent = fs.readFileSync(skillsDataTsPath, 'utf-8');

// Wipe existing content/skills folder completely to guarantee clean replacement
if (fs.existsSync(skillsDir)) {
  fs.rmSync(skillsDir, { recursive: true, force: true });
  fs.mkdirSync(skillsDir, { recursive: true });
}

// Extract JSON array from export const skillsData: SkillEntry[] = [...]
const jsonMatch = fileContent.match(/export const skillsData:\s*SkillEntry\[\]\s*=\s*(\[\s*\{[\s\S]*\}\s*\]);/);

if (!jsonMatch) {
  console.error('Could not parse skillsData array from src/data/skillsData.ts');
  process.exit(1);
}

// Clean syntax if needed or evaluate in JS context safely
let skillsData = [];
try {
  // Use Function evaluation to parse JS object literal safely
  const evalSkills = new Function(`return ${jsonMatch[1]}`);
  skillsData = evalSkills();
} catch (err) {
  console.error('Error evaluating skillsData:', err);
  process.exit(1);
}

for (const skill of skillsData) {
  const folderPath = path.join(skillsDir, skill.id);
  fs.mkdirSync(folderPath, { recursive: true });

  // 1. Save main skill.json
  const jsonPath = path.join(folderPath, 'skill.json');
  fs.writeFileSync(jsonPath, JSON.stringify(skill, null, 2), 'utf-8');

  // 2. Save Markdown representation SKILL.md
  const mdPath = path.join(folderPath, 'SKILL.md');
  const mdContent = `# ${skill.title} (v${skill.version})

**Category:** ${skill.category}
**Author:** ${skill.author}
**Stars:** ${skill.stars}
**Compatibility:** ${skill.compatibility.join(', ')}

## Summary
${skill.summary}

## Parameters
${skill.parameters
  .map(
    (p) =>
      `- \`${p.name}\` (${p.type}${p.required ? ', required' : ''}): ${p.description}`
  )
  .join('\n')}

## Executable Prompt Template
\`\`\`xml
${skill.executablePrompt}
\`\`\`

## Sample Input
\`\`\`json
${JSON.stringify(skill.sampleInput, null, 2)}
\`\`\`

## Sample Output
\`\`\`markdown
${typeof skill.sampleOutput === 'string' ? skill.sampleOutput : JSON.stringify(skill.sampleOutput, null, 2)}
\`\`\`
`;
  fs.writeFileSync(mdPath, mdContent, 'utf-8');

  console.log(`Seeded production skill: content/skills/${skill.id}`);
}

console.log(`Successfully migrated and seeded ${skillsData.length} skills in content/skills/`);
