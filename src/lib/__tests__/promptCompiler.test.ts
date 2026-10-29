import { compileSkillPrompt } from '../promptCompiler';
import { skillsData } from '../../data/skillsData';
import { SkillParameter } from '../types';

async function testPromptCompiler() {
  console.log('--- Testing compileSkillPrompt() ---');

  // Test 1: Basic variable replacement
  const template = 'Hello {{ name }}, welcome to {{ system }}!';
  const result1 = compileSkillPrompt(template, { name: 'Alice', system: 'Apex AI' });
  if (result1 !== 'Hello Alice, welcome to Apex AI!') {
    throw new Error(`Test 1 Failed: Expected "Hello Alice, welcome to Apex AI!", got "${result1}"`);
  }
  console.log('✓ Test 1 Passed: Basic variable replacement');

  // Test 2: Fallback to default when parameter omitted
  const specs: SkillParameter[] = [
    { name: 'user_id', type: 'string', description: 'User ID', required: true },
    { name: 'role', type: 'string', description: 'Role', required: false, default: 'developer' },
  ];
  const template2 = 'User {{ user_id }} has role {{ role }}.';
  const result2 = compileSkillPrompt(template2, { user_id: 'usr_123' }, specs);
  if (result2 !== 'User usr_123 has role developer.') {
    throw new Error(`Test 2 Failed: Expected "User usr_123 has role developer.", got "${result2}"`);
  }
  console.log('✓ Test 2 Passed: Parameter default fallbacks');

  // Test 3: Exception on missing required parameter without default
  try {
    compileSkillPrompt(template2, {}, specs);
    throw new Error('Test 3 Failed: Expected exception for missing required parameter');
  } catch (err: any) {
    if (!err.message.includes('Missing required parameter')) {
      throw new Error(`Test 3 Failed: Unexpected error message "${err.message}"`);
    }
    console.log('✓ Test 3 Passed: Validation error on missing required parameter');
  }

  // Test 4: Verify all 8 skills in skillsData compile cleanly with their sampleInput
  console.log('--- Validating 8 Skill Entries in Catalog ---');
  if (skillsData.length < 8) {
    throw new Error(`Expected at least 8 skills, found ${skillsData.length}`);
  }

  for (const skill of skillsData) {
    // Schema integrity checks
    if (!skill.id || typeof skill.id !== 'string') throw new Error(`Invalid id for skill: ${skill.title}`);
    if (!skill.summary || skill.summary.length > 120) {
      throw new Error(`Summary for ${skill.id} must be <= 120 chars (got ${skill.summary?.length})`);
    }
    if (!skill.executablePrompt) throw new Error(`Missing executablePrompt for ${skill.id}`);
    if (!skill.sampleInput || typeof skill.sampleInput !== 'object') throw new Error(`Missing sampleInput for ${skill.id}`);
    if (!skill.sampleOutput) throw new Error(`Missing sampleOutput for ${skill.id}`);

    // Compilation check using sampleInput
    const compiled = compileSkillPrompt(skill.executablePrompt, skill.sampleInput, skill.parameters);
    if (!compiled || compiled.length === 0) {
      throw new Error(`Compiled prompt for ${skill.id} is empty`);
    }
    console.log(`✓ Skill Verified: [${skill.id}] - ${skill.title} (v${skill.version})`);
  }

  console.log('All tests passed successfully!');
}

testPromptCompiler().catch((err) => {
  console.error('Test Suite Failure:', err);
  process.exit(1);
});
