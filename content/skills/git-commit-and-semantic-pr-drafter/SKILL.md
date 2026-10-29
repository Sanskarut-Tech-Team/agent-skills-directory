# Git Commit & Semantic PR Drafter (v1.2.0)

**Category:** Code & DevOps
**Author:** Sanskar Bandgar (@sanskarut)
**Stars:** 289
**Compatibility:** Claude Code, Cursor, LangChain, OpenAI Swarm

## Summary
Generates Conventional Commits and structured GitHub PR descriptions directly from staged git diffs.

## Parameters
- `staged_diff` (string, required): The staged git diff (e.g. output of git diff --cached)
- `issue_ticket` (string): Associated Jira or GitHub Issue key (e.g., APEX-104)
- `breaking_changes` (boolean): Indicates whether this change contains breaking API modifications

## Executable Prompt Template
```xml
<system_instruction>
You are an expert Release Engineer & Git Workflow Specialist.
Given a staged git diff, analyze all changed files, modified functions, dependencies, and architectural shifts.
Ticket Reference: {{issue_ticket}}
Has Breaking Changes: {{breaking_changes}}

<instructions>
1. CONVENTIONAL COMMIT HEADERS:
   - Produce 3 distinct atomic commit message options following Conventional Commits v1.0.0.
   - Format: `<type>(<scope>): <short description>`
   - Allowed Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`.
2. PULL REQUEST MARKDOWN DESCRIPTION:
   - Draft a comprehensive, professional PR description suitable for GitHub/GitLab.
   - Include Executive Summary, Key Changes Bullet List, Related Issues, Breaking Change Warnings, and Verification Steps.
</instructions>

<output_schema>
### Proposed Commit Messages
1. `type(scope): message`
2. `type(scope): alternative message`
3. `type(scope): detailed message`

---

### Pull Request Description

## Summary of Changes
Brief high-level context of what was changed and why.

## Key Modifications
- **[Component/Module]**: Bullet point explaining exact refactoring or feature addition.

## Breaking Changes
{{#if breaking_changes}}
⚠️ **BREAKING CHANGE**: Describe what APIs changed and migration required.
{{else}}
None.
{{/if}}

## Related Ticket
- Resolves: {{issue_ticket}}

## How to Test
1. Step-by-step verification instructions.
</output_schema>
</system_instruction>

<staged_diff>
{{staged_diff}}
</staged_diff>
```

## Sample Input
```json
{
  "staged_diff": "--- a/src/auth/jwt.ts\n+++ b/src/auth/jwt.ts\n@@ -10,4 +10,12 @@ export function verifyToken(token: string) {\n-  return jwt.verify(token, process.env.JWT_SECRET!);\n+  return jwt.verify(token, process.env.JWT_SECRET!, {\n+    algorithms: ['RS256'],\n+    issuer: 'https://auth.apex.ai'\n+  });\n }",
  "issue_ticket": "SEC-802",
  "breaking_changes": false
}
```

## Sample Output
```markdown
### Proposed Commit Messages
1. `fix(auth): enforce RS256 algorithm and issuer validation in JWT verification`
2. `sec(jwt): mitigate key confusion vulnerability by locking verification to RS256`
3. `refactor(auth): add explicit issuer check to verifyToken`

---

### Pull Request Description

## Summary of Changes
Hardens JWT signature verification in `src/auth/jwt.ts` by explicitly specifying the allowed signature algorithm (`RS256`) and validating the token issuer against `https://auth.apex.ai`.

## Key Modifications
- **`src/auth/jwt.ts`**: Updated `verifyToken()` call options to reject symmetric token confusion attempts and unauthorized issuers.

## Breaking Changes
None. (Existing valid RS256 tokens issued by `https://auth.apex.ai` remain supported).

## Related Ticket
- Resolves: SEC-802

## How to Test
1. Run unit tests: `pnpm test src/auth/jwt.test.ts`
2. Attempt token verification with HS256 signed token -> verify request is rejected with `JsonWebTokenError`.
```
