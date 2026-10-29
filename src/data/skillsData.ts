import { SkillEntry } from '../lib/types';

export const skillsData: SkillEntry[] = [
  {
    id: "production-code-reviewer-security-linter",
    title: "Production Code Reviewer & Security Linter",
    slug: "production-code-reviewer-security-linter",
    category: "Security & Auditing",
    author: "Sanskar Bandgar (@sanskarut)",
    stars: 342,
    version: "1.4.0",
    tags: ["Security", "OWASP", "Code Review", "Linter", "Static Analysis"],
    summary: "Audits code diffs for OWASP Top 10 flaws, memory leaks, and anti-patterns with strict approval criteria.",
    compatibility: ["Claude Code", "Cursor", "OpenAI Swarm", "LangChain", "CrewAI"],
    parameters: [
      {
        name: "target_language",
        type: "select",
        description: "Primary programming language of the codebase under review",
        required: true,
        options: ["TypeScript/JavaScript", "Python", "Go", "Rust", "Java"],
        default: "TypeScript/JavaScript"
      },
      {
        name: "code_diff",
        type: "string",
        description: "The raw git patch, file diff, or pull request code snippet",
        required: true,
        default: ""
      },
      {
        name: "security_standard",
        type: "select",
        description: "Compliance or auditing baseline standard",
        required: true,
        options: ["OWASP Top 10", "SOC2 Compliance", "PCI-DSS v4.0", "Strict Zero-Trust"],
        default: "OWASP Top 10"
      },
      {
        name: "strict_mode",
        type: "boolean",
        description: "Reject pull request automatically if any critical or high severity vulnerability is detected",
        required: false,
        default: true
      }
    ],
    executablePrompt: `<system_instruction>
You are a Lead Security Architect & Principal Code Auditor.
Your objective is to perform an exhaustive, production-grade code review on the provided diff.
Compliance Standard: {{security_standard}}
Language Target: {{target_language}}
Strict Mode Gating: {{strict_mode}}

<review_mandate>
1. SECURITY VULNERABILITY ANALYSIS:
   - Inspect for OWASP Top 10 vulnerabilities (SQLi, XSS, SSRF, IDOR, Broken Authentication, Secrets Exposure).
   - Check for unsafe dynamic evaluation, command execution, or unsanitized deserialization.
2. RESOURCE & PERFORMANCE AUDIT:
   - Detect memory leaks, unclosed streams, missing database transaction rollbacks, or missing timeouts.
   - Identify O(N^2) complexity loops or unindexed queries inside hot execution paths.
3. ARCHITECTURAL & CODE QUALITY PATTERNS:
   - Identify anti-patterns, missing input validation (e.g., Zod/Pydantic), implicit type coercion, and poor error handling.
4. GATING DECISION:
   - Provide a formal verdict: APPROVED, APPROVED WITH NITS, or REJECTED.
   - In Strict Mode (true), ANY Critical or High finding MUST force a REJECTED verdict.
</review_mandate>

<output_schema>
Format your review strictly using the following Markdown structure:
## Executive Verdict: [APPROVED | APPROVED WITH NITS | REJECTED]
**Security Score:** [0-100]
**Compliance Baseline:** {{security_standard}}

### Severity Findings Matrix
| ID | Category | Severity | File/Line | Finding Summary |
|---|---|---|---|---|

### Detailed Vulnerability Breakdown
For each issue identified:
- **Location:** File path and line numbers
- **Vulnerability:** Explanation of the threat vector
- **Impact:** Potential exploit impact
- **Remediation:** Exact refactored code diff (before/after)

### Code Quality & Architectural Recommendations
- Specific actionable improvements for maintainability and resilience.
</output_schema>
</system_instruction>

<code_diff>
{{code_diff}}
</code_diff>`,
    sampleInput: {
      target_language: "TypeScript/JavaScript",
      code_diff: `--- a/src/controllers/userController.ts\n+++ b/src/controllers/userController.ts\n@@ -12,6 +12,14 @@ export async function getUserProfile(req: Request, res: Response) {\n-  const userId = req.session.userId;\n-  const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);\n+  const userId = req.query.id;\n+  const query = \`SELECT * FROM users WHERE id = '\${userId}'\`;\n+  const user = await db.query(query);\n+  console.log("Debug user data:", user.rows[0]);\n+  res.json(user.rows[0]);\n }`,
      security_standard: "OWASP Top 10",
      strict_mode: true
    },
    sampleOutput: `## Executive Verdict: REJECTED
**Security Score:** 15/100
**Compliance Baseline:** OWASP Top 10

### Severity Findings Matrix
| ID | Category | Severity | File/Line | Finding Summary |
|---|---|---|---|---|
| SEC-01 | Injection | CRITICAL | userController.ts:14 | SQL Injection via string interpolation of req.query.id |
| SEC-02 | Broken Access Control | HIGH | userController.ts:13 | IDOR flaw: Direct query parameter replaces session auth |
| SEC-03 | Security Logging | MEDIUM | userController.ts:16 | Sensitive user PII logged to stdout via console.log |

### Detailed Vulnerability Breakdown
- **Location:** \`src/controllers/userController.ts:14\`
- **Vulnerability:** SQL Injection (A03:2021-Injection). Concatenating unescaped user input (\`req.query.id\`) directly into the SQL query string allows attackers to execute arbitrary SQL commands.
- **Impact:** Complete database compromise, unauthorized data exfiltration, and potential data destruction.
- **Remediation:**
\`\`\`typescript
// BEFORE (Vulnerable)
const query = \`SELECT * FROM users WHERE id = '\${userId}'\`;
const user = await db.query(query);

// AFTER (Secure)
const userId = req.session?.userId;
if (!userId) {
  return res.status(401).json({ error: "Unauthorized" });
}
const user = await db.query('SELECT id, email, name, created_at FROM users WHERE id = $1', [userId]);
\`\`\`

### Code Quality & Architectural Recommendations
- Enforce parameterized SQL queries or leverage an ORM with built-in parameter escaping.
- Implement Zod schema validation for all incoming query parameters.
- Restrict logged payloads to strip PII and internal credentials before writing to log streams.`
  },
  {
    id: "git-commit-and-semantic-pr-drafter",
    title: "Git Commit & Semantic PR Drafter",
    slug: "git-commit-and-semantic-pr-drafter",
    category: "Code & DevOps",
    author: "Sanskar Bandgar (@sanskarut)",
    stars: 289,
    version: "1.2.0",
    tags: ["Git", "Pull Request", "DevOps", "Conventional Commits", "CI/CD"],
    summary: "Generates Conventional Commits and structured GitHub PR descriptions directly from staged git diffs.",
    compatibility: ["Claude Code", "Cursor", "LangChain", "OpenAI Swarm"],
    parameters: [
      {
        name: "staged_diff",
        type: "string",
        description: "The staged git diff (e.g. output of git diff --cached)",
        required: true,
        default: ""
      },
      {
        name: "issue_ticket",
        type: "string",
        description: "Associated Jira or GitHub Issue key (e.g., APEX-104)",
        required: false,
        default: "APEX-104"
      },
      {
        name: "breaking_changes",
        type: "boolean",
        description: "Indicates whether this change contains breaking API modifications",
        required: false,
        default: false
      }
    ],
    executablePrompt: `<system_instruction>
You are an expert Release Engineer & Git Workflow Specialist.
Given a staged git diff, analyze all changed files, modified functions, dependencies, and architectural shifts.
Ticket Reference: {{issue_ticket}}
Has Breaking Changes: {{breaking_changes}}

<instructions>
1. CONVENTIONAL COMMIT HEADERS:
   - Produce 3 distinct atomic commit message options following Conventional Commits v1.0.0.
   - Format: \`<type>(<scope>): <short description>\`
   - Allowed Types: \`feat\`, \`fix\`, \`refactor\`, \`docs\`, \`test\`, \`chore\`, \`perf\`.
2. PULL REQUEST MARKDOWN DESCRIPTION:
   - Draft a comprehensive, professional PR description suitable for GitHub/GitLab.
   - Include Executive Summary, Key Changes Bullet List, Related Issues, Breaking Change Warnings, and Verification Steps.
</instructions>

<output_schema>
### Proposed Commit Messages
1. \`type(scope): message\`
2. \`type(scope): alternative message\`
3. \`type(scope): detailed message\`

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
</staged_diff>`,
    sampleInput: {
      staged_diff: `--- a/src/auth/jwt.ts\n+++ b/src/auth/jwt.ts\n@@ -10,4 +10,12 @@ export function verifyToken(token: string) {\n-  return jwt.verify(token, process.env.JWT_SECRET!);\n+  return jwt.verify(token, process.env.JWT_SECRET!, {\n+    algorithms: ['RS256'],\n+    issuer: 'https://auth.apex.ai'\n+  });\n }`,
      issue_ticket: "SEC-802",
      breaking_changes: false
    },
    sampleOutput: `### Proposed Commit Messages
1. \`fix(auth): enforce RS256 algorithm and issuer validation in JWT verification\`
2. \`sec(jwt): mitigate key confusion vulnerability by locking verification to RS256\`
3. \`refactor(auth): add explicit issuer check to verifyToken\`

---

### Pull Request Description

## Summary of Changes
Hardens JWT signature verification in \`src/auth/jwt.ts\` by explicitly specifying the allowed signature algorithm (\`RS256\`) and validating the token issuer against \`https://auth.apex.ai\`.

## Key Modifications
- **\`src/auth/jwt.ts\`**: Updated \`verifyToken()\` call options to reject symmetric token confusion attempts and unauthorized issuers.

## Breaking Changes
None. (Existing valid RS256 tokens issued by \`https://auth.apex.ai\` remain supported).

## Related Ticket
- Resolves: SEC-802

## How to Test
1. Run unit tests: \`pnpm test src/auth/jwt.test.ts\`
2. Attempt token verification with HS256 signed token -> verify request is rejected with \`JsonWebTokenError\`.`
  },
  {
    id: "database-schema-sql-query-optimizer",
    title: "Database Schema & SQL Query Optimizer",
    slug: "database-schema-sql-query-optimizer",
    category: "Architecture & Data",
    author: "Sanskar Bandgar (@sanskarut)",
    stars: 418,
    version: "2.1.0",
    tags: ["PostgreSQL", "SQL", "Database", "Performance", "Indexing"],
    summary: "Analyzes EXPLAIN ANALYZE logs and SQL queries to suggest composite indexes and query rewrites.",
    compatibility: ["Claude Code", "Cursor", "LangChain", "OpenAI Swarm"],
    parameters: [
      {
        name: "database_engine",
        type: "select",
        description: "Database management system engine",
        required: true,
        options: ["PostgreSQL 16", "MySQL 8.0", "SQLite 3", "ClickHouse"],
        default: "PostgreSQL 16"
      },
      {
        name: "sql_query",
        type: "string",
        description: "The raw slow SQL query or ORM query string",
        required: true,
        default: ""
      },
      {
        name: "explain_plan",
        type: "string",
        description: "Optional EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) query execution log",
        required: false,
        default: ""
      },
      {
        name: "table_indexes",
        type: "string",
        description: "Existing schema DDL or existing index definitions",
        required: false,
        default: ""
      }
    ],
    executablePrompt: `<system_instruction>
You are a Principal Database Administrator & SQL Performance Tuning Specialist.
Target Engine: {{database_engine}}

<optimization_strategy>
1. EXPLAIN PLAN DECONSTRUCTION:
   - Identify Sequential Scans on large tables, High Memory Sorts, Nested Loops with high iteration counts, and Hash Join bottlenecks.
2. COMPOSITE INDEX STRATEGY:
   - Formulate targeted B-Tree, GIN, or Partial indexes based on equality-first, range-second, and covering index rules (INCLUDE clause where supported).
3. QUERY LOGIC RESTRUCTURING:
   - Eliminate N+1 query patterns, replace correlated subqueries with Common Table Expressions (CTEs) or LATERAL joins, and leverage window functions.
4. MIGRATION DDL & BENCHMARK PREDICTION:
   - Provide clean, non-blocking DDL (\`CREATE INDEX CONCURRENTLY\`) and estimated latency/cost reduction percentage.
</optimization_strategy>

<output_schema>
## Executive Performance Analysis
- **Engine:** {{database_engine}}
- **Primary Bottleneck:** [Sequential Scan / Spill to Disk / N+1 Loop]
- **Predicted Speedup:** [e.g., 12x (98% reduction in buffer reads)]

### Execution Bottlenecks
Detail the node-by-node cost driver from EXPLAIN ANALYZE or query structure.

### Recommended DDL Migration
\`\`\`sql
-- Non-blocking index creation statements
\`\`\`

### Optimized SQL Query Rewrites
\`\`\`sql
-- Refactored high-performance SQL query
\`\`\`

### Architectural Index & Partitioning Advice
- Explanations for composite index column order and memory optimization.
</output_schema>
</system_instruction>

<sql_query>
{{sql_query}}
</sql_query>

<explain_plan>
{{explain_plan}}
</explain_plan>

<table_indexes>
{{table_indexes}}
</table_indexes>`,
    sampleInput: {
      database_engine: "PostgreSQL 16",
      sql_query: "SELECT o.id, o.created_at, u.email FROM orders o JOIN users u ON o.user_id = u.id WHERE o.status = 'PENDING' AND o.created_at >= '2026-01-01' ORDER BY o.created_at DESC LIMIT 50;",
      explain_plan: "Limit (cost=45210.12..45210.25 rows=50 width=48)\n  -> Sort (cost=45210.12..45800.00 rows=235000 width=48)\n        Sort Key: o.created_at DESC\n        -> Hash Join (cost=1200.00..38900.50 rows=235000 width=48)\n              -> Seq Scan on orders o (cost=0.00..31200.00 rows=235000 width=32)\n                    Filter: ((status = 'PENDING'::text) AND (created_at >= '2026-01-01'::timestamp))",
      table_indexes: "CREATE TABLE orders (id uuid PRIMARY KEY, user_id uuid, status text, created_at timestamp);"
    },
    sampleOutput: `## Executive Performance Analysis
- **Engine:** PostgreSQL 16
- **Primary Bottleneck:** Full Sequential Scan on \`orders\` table (\`cost=31200.00\`) combined with Memory Sort spillage on \`created_at\`.
- **Predicted Speedup:** ~45x latency reduction (eliminates sequential scan and in-memory sort).

### Execution Bottlenecks
The query planner performs a full table scan on \`orders\` filtering by \`status\` and \`created_at\`. Because no index covers \`status\` and \`created_at\` together, PostgreSQL scans all 235,000 rows into memory and runs a dynamic sort.

### Recommended DDL Migration
\`\`\`sql
-- Create composite partial index to satisfy filter + sort order directly
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_pending_created
ON orders (status, created_at DESC)
INCLUDE (user_id)
WHERE status = 'PENDING';
\`\`\`

### Optimized SQL Query Rewrites
\`\`\`sql
SELECT o.id, o.created_at, u.email
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE o.status = 'PENDING'
  AND o.created_at >= '2026-01-01'
ORDER BY o.created_at DESC
LIMIT 50;
\`\`\`

### Architectural Index & Partitioning Advice
- Column order in \`idx_orders_pending_created\` uses equality first (\`status\`) and range second (\`created_at DESC\`).
- Using \`INCLUDE (user_id)\` enables Index-Only Scans, eliminating table heap fetches entirely.`
  },
  {
    id: "api-spec-to-typesafe-sdk-generator",
    title: "API Spec to Typesafe SDK Generator",
    slug: "api-spec-to-typesafe-sdk-generator",
    category: "Architecture & Data",
    author: "Sanskar Bandgar (@sanskarut)",
    stars: 310,
    version: "1.5.0",
    tags: ["OpenAPI", "TypeScript", "Zod", "SDK", "API Design"],
    summary: "Transforms OpenAPI/Swagger specs into idiomatic TypeScript clients paired with Zod runtime schemas.",
    compatibility: ["Claude Code", "Cursor", "LangChain", "CrewAI"],
    parameters: [
      {
        name: "api_spec_type",
        type: "select",
        description: "Format of input API specification",
        required: true,
        options: ["OpenAPI 3.1 JSON/YAML", "Swagger 2.0", "GraphQL Schema", "Raw JSON Response"],
        default: "OpenAPI 3.1 JSON/YAML"
      },
      {
        name: "spec_content",
        type: "string",
        description: "Raw API spec payload or schema definition",
        required: true,
        default: ""
      },
      {
        name: "sdk_name",
        type: "string",
        description: "Class name for generated TypeScript SDK client",
        required: true,
        default: "ApexApiClient"
      },
      {
        name: "include_zod_validation",
        type: "boolean",
        description: "Generate Zod validation schemas for request/response runtime validation",
        required: false,
        default: true
      }
    ],
    executablePrompt: `<system_instruction>
You are a Principal Software Architect specializing in SDK Engineering & Developer Tooling.
Goal: Transform the provided {{api_spec_type}} specification into a production-ready, type-safe TypeScript SDK client.
SDK Client Name: {{sdk_name}}
Include Zod Runtime Validation: {{include_zod_validation}}

<design_requirements>
1. TYPESCRIPT GENERATION:
   - Output clean, idiomatic TypeScript interfaces for all request parameters, headers, and response payloads.
   - Zero \`any\` usage; leverage strict generics and Discriminated Unions for error responses.
2. RUNTIME VALIDATION (Zod):
   - Export corresponding Zod schemas (e.g. \`UserSchema = z.object({ ... })\`).
3. HTTP CLIENT RESILIENCE:
   - Use native \`fetch\` with configurable base URL, authorization headers (Bearer token / API key), automatic retry logic, and structured error handling.
</design_requirements>

<output_schema>
Provide the generated SDK as a clean, single-file TypeScript module:
\`\`\`typescript
import { z } from 'zod';

// 1. Zod Schemas
// 2. Inferred TypeScript Types
// 3. Custom API Error Class
// 4. SDK Client Class with typed methods
\`\`\`
</output_schema>
</system_instruction>

<spec_content>
{{spec_content}}
</spec_content>`,
    sampleInput: {
      api_spec_type: "OpenAPI 3.1 JSON/YAML",
      spec_content: "paths:\n  /v1/agents:\n    get:\n      summary: List AI Agents\n      parameters:\n        - name: limit\n          in: query\n          schema:\n            type: integer\n            default: 10\n      responses:\n        '200':\n          description: Success\n          content:\n            application/json:\n              schema:\n                type: object\n                properties:\n                  agents:\n                    type: array\n                    items:\n                      type: object\n                      properties:\n                        id:\n                          type: string\n                        name:\n                          type: string\n                        status:\n                          type: string\n                          enum: [active, idle, failed]",
      sdk_name: "ApexAgentClient",
      include_zod_validation: true
    },
    sampleOutput: `\`\`\`typescript
import { z } from 'zod';

// --- 1. ZOD RUNTIME SCHEMAS ---
export const AgentStatusSchema = z.enum(['active', 'idle', 'failed']);

export const AgentSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: AgentStatusSchema,
});

export const ListAgentsResponseSchema = z.object({
  agents: z.array(AgentSchema),
});

export const ListAgentsParamsSchema = z.object({
  limit: z.number().optional().default(10),
});

// --- 2. INFERRED TYPESCRIPT TYPES ---
export type AgentStatus = z.infer<typeof AgentStatusSchema>;
export type Agent = z.infer<typeof AgentSchema>;
export type ListAgentsResponse = z.infer<typeof ListAgentsResponseSchema>;
export type ListAgentsParams = z.infer<typeof ListAgentsParamsSchema>;

// --- 3. CUSTOM ERROR CLASS ---
export class ApexApiError extends Error {
  constructor(public status: number, message: string, public details?: unknown) {
    super(message);
    this.name = 'ApexApiError';
  }
}

// --- 4. TYPESAFE SDK CLIENT ---
export class ApexAgentClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(config: { baseUrl?: string; apiKey: string }) {
    this.baseUrl = config.baseUrl || 'https://api.apex.ai';
    this.apiKey = config.apiKey;
  }

  async listAgents(params?: ListAgentsParams): Promise<ListAgentsResponse> {
    const parsedParams = ListAgentsParamsSchema.parse(params || {});
    const query = new URLSearchParams({ limit: String(parsedParams.limit) });
    const url = \`\${this.baseUrl}/v1/agents?\${query.toString()}\`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': \`Bearer \${this.apiKey}\`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new ApexApiError(res.status, \`HTTP error \${res.status}: \${res.statusText}\`);
    }

    const json = await res.json();
    return ListAgentsResponseSchema.parse(json);
  }
}
\`\`\``
  },
  {
    id: "ai-agent-tool-function-spec-generator",
    title: "AI Agent Tool/Function Spec Generator",
    slug: "ai-agent-tool-function-spec-generator",
    category: "Workflow & Automation",
    author: "Sanskar Bandgar (@sanskarut)",
    stars: 520,
    version: "2.0.0",
    tags: ["MCP", "Function Calling", "AI Agents", "JSON Schema", "Tools"],
    summary: "Converts natural language tool requirements into strict MCP and OpenAI JSON Schema function specs.",
    compatibility: ["Claude Code", "OpenAI Swarm", "LangChain", "CrewAI", "Cursor"],
    parameters: [
      {
        name: "target_format",
        type: "select",
        description: "Output specification target protocol",
        required: true,
        options: ["Model Context Protocol (MCP)", "OpenAI JSON Schema", "LangChain StructuredTool", "Anthropic Tool Spec"],
        default: "Model Context Protocol (MCP)"
      },
      {
        name: "tool_description",
        type: "string",
        description: "Natural language specification of what the tool does and what input parameters it accepts",
        required: true,
        default: ""
      },
      {
        name: "include_error_handling",
        type: "boolean",
        description: "Include error return codes and boundary validation constraints in description",
        required: false,
        default: true
      }
    ],
    executablePrompt: `<system_instruction>
You are an AI Systems Architect specializing in Tool Protocol Standardization (Model Context Protocol / OpenAI Tool Calling).
Your objective is to translate natural language tool capabilities into zero-ambiguity function schemas.
Target Format: {{target_format}}
Include Error Guardrails: {{include_error_handling}}

<design_rules>
1. Strict Type Definitions: All parameters must specify exact JSON Schema types (\`string\`, \`number\`, \`integer\`, \`boolean\`, \`array\`, \`object\`).
2. Comprehensive Parameter Descriptions: Describe valid ranges, formats, edge-case constraints, and default behaviors.
3. Strict Required Fields: Explicitly list all required properties. Set \`additionalProperties: false\` where appropriate.
4. Model Context Protocol Alignment: Ensure tool name follows snake_case and descriptions guide the LLM when to call the tool.
</design_rules>

<output_schema>
Output a production-grade specification file in valid JSON formatted according to the target standard.
</output_schema>
</system_instruction>

<tool_description>
{{tool_description}}
</tool_description>`,
    sampleInput: {
      target_format: "Model Context Protocol (MCP)",
      tool_description: "A tool that searches internal company vector database for documentation given a query string, optional filter tags, and top_k result count between 1 and 20.",
      include_error_handling: true
    },
    sampleOutput: `{
  "name": "search_internal_docs",
  "description": "Searches the internal corporate vector database for relevant documentation articles and technical specifications based on semantic similarity.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "The natural language search query or engineering question."
      },
      "tags": {
        "type": "array",
        "items": {
          "type": "string"
        },
        "description": "Optional list of metadata filter tags (e.g. ['architecture', 'security', 'v2'])."
      },
      "top_k": {
        "type": "integer",
        "description": "Maximum number of matching document chunks to return. Must be between 1 and 20.",
        "default": 5,
        "minimum": 1,
        "maximum": 20
      }
    },
    "required": [
      "query"
    ],
    "additionalProperties": false
  }
}`
  },
  {
    id: "documentation-adr-architectural-writer",
    title: "Documentation & Architecture Decision Record (ADR) Writer",
    slug: "documentation-adr-architectural-writer",
    category: "Architecture & Data",
    author: "Sanskar Bandgar (@sanskarut)",
    stars: 265,
    version: "1.3.0",
    tags: ["ADR", "Architecture", "Documentation", "System Design", "Engineering"],
    summary: "Drafts formal Architecture Decision Records capturing context, trade-offs, consequences, and alternatives.",
    compatibility: ["Claude Code", "Cursor", "OpenAI Swarm", "LangChain"],
    parameters: [
      {
        name: "adr_title",
        type: "string",
        description: "Title of the architectural decision (e.g. Migrate from REST to gRPC for Internal Services)",
        required: true,
        default: ""
      },
      {
        name: "context_problem",
        type: "string",
        description: "Background context, business driver, or technical challenge forcing this decision",
        required: true,
        default: ""
      },
      {
        name: "considered_options",
        type: "string",
        description: "Comma-separated list or description of architectural options evaluated",
        required: true,
        default: "Option A, Option B, Option C"
      },
      {
        name: "chosen_solution",
        type: "string",
        description: "The selected architectural path forward",
        required: true,
        default: ""
      }
    ],
    executablePrompt: `<system_instruction>
You are a Staff Enterprise Architect.
Draft a formal Architecture Decision Record (ADR) following the MADR (Markdown Architectural Decision Records) template.

<decision_meta>
Title: {{adr_title}}
Problem Statement: {{context_problem}}
Options Evaluated: {{considered_options}}
Selected Path: {{chosen_solution}}
</decision_meta>

<adr_template>
# ADR-[NUMBER]: {{adr_title}}

* **Status:** [Proposed | Accepted | Superseded]
* **Deciders:** Principal Architecture Committee
* **Date:** [YYYY-MM-DD]

## Context and Problem Statement
Thorough explanation of technical constraints, performance bottlenecks, team capabilities, and business drivers.

## Decision Drivers
* Driver 1: e.g., Sub-50ms p99 latency requirement
* Driver 2: e.g., Type safety across polyglot microservices

## Considered Options
1. Option 1
2. Option 2
3. Option 3

## Decision Outcome
Chosen Option: **{{chosen_solution}}**

### Positive Consequences
- Positive impact 1
- Positive impact 2

### Negative Consequences / Trade-offs
- Risk or operational overhead 1
- Mitigation strategy 1

## Pros and Cons of Options Matrix
| Option | Pros | Cons | Estimated Cost/Complexity |
|---|---|---|---|
</adr_template>
</system_instruction>`,
    sampleInput: {
      adr_title: "Adopt Apache Kafka for Real-time Event Streaming",
      context_problem: "Our current synchronous HTTP webhook setup fails under peak traffic bursts (10k req/sec), leading to dropped audit logs and cascading downstream failures.",
      considered_options: "Apache Kafka, AWS SQS + SNS, RabbitMQ",
      chosen_solution: "Apache Kafka on AWS MSK"
    },
    sampleOutput: `# ADR-008: Adopt Apache Kafka for Real-time Event Streaming

* **Status:** Accepted
* **Deciders:** Principal Architecture Committee
* **Date:** 2026-04-20

## Context and Problem Statement
Our current synchronous HTTP webhook architecture experiences severe queue backing and dropped audit event payloads when upstream transaction ingestion spikes past 10,000 req/sec. Downstream consumers cause cascading HTTP 504 timeouts. We require a decoupled, high-throughput message streaming buffer capable of persistent replayability.

## Decision Drivers
* Sub-10ms event ingestion latency at 50,000 events/sec.
* Replayability of historical log streams for disaster recovery.
* Managed cloud infrastructure options to minimize DevOps maintenance.

## Considered Options
1. **Apache Kafka (AWS MSK)**
2. **AWS SQS + SNS**
3. **RabbitMQ Cluster**

## Decision Outcome
Chosen Option: **Apache Kafka on AWS MSK**

### Positive Consequences
- Guarantees strict partition-key ordering for financial transactions.
- Provides 7-day log retention enabling instant consumer replay during outages.
- Decouples producer throughput from downstream consumer processing latency.

### Negative Consequences / Trade-offs
- Higher fixed monthly base cost compared to SQS serverless pricing.
- Requires team training on consumer group offset management and partition rebalancing.`
  },
  {
    id: "incident-postmortem-rca-synthesizer",
    title: "Incident Postmortem & RCA Synthesizer",
    slug: "incident-postmortem-rca-synthesizer",
    category: "Workflow & Automation",
    author: "Sanskar Bandgar (@sanskarut)",
    stars: 395,
    version: "1.1.0",
    tags: ["Postmortem", "RCA", "Sentry", "Site Reliability", "Incident Response"],
    summary: "Synthesizes Slack threads, Sentry logs, and metrics into blameless postmortems with RCA timelines.",
    compatibility: ["Claude Code", "Cursor", "OpenAI Swarm", "LangChain"],
    parameters: [
      {
        name: "incident_title",
        type: "string",
        description: "Name of the outage or service degradation incident",
        required: true,
        default: ""
      },
      {
        name: "raw_slack_logs",
        type: "string",
        description: "Exported Slack chat transcripts or incident channel notes",
        required: true,
        default: ""
      },
      {
        name: "sentry_error_logs",
        type: "string",
        description: "Raw stack traces, Sentry alert payloads, or Datadog log exports",
        required: false,
        default: ""
      },
      {
        name: "severity_level",
        type: "select",
        description: "Assigned incident severity score",
        required: true,
        options: ["SEV-1 (Critical Outage)", "SEV-2 (Major Degradation)", "SEV-3 (Minor Impact)"],
        default: "SEV-1 (Critical Outage)"
      }
    ],
    executablePrompt: `<system_instruction>
You are a Principal Site Reliability Engineer (SRE) & Incident Commander.
Your duty is to generate a Blameless Postmortem and Root Cause Analysis (RCA) report from raw incident artifacts.

Incident: {{incident_title}}
Severity: {{severity_level}}

<postmortem_principles>
1. BLAMELESS CULTURE: Focus on system mechanisms, missing guardrails, and missing alerts rather than individual human mistake.
2. TIMELINE RECONSTRUCTION: Extract exact UTC timestamps from Slack messages and log files to assemble a minute-by-minute timeline (T-0 to Resolution).
3. FIVE WHYS METHODOLOGY: Perform recursive 5 Whys analysis to uncover systemic root cause.
4. PREVENTIVE ACTION ITEMS: Assign SMART action items tagged as [Preventive], [Detective], or [Corrective].
</postmortem_principles>

<output_schema>
# Blameless Postmortem: {{incident_title}}

**Severity:** {{severity_level}}
**Date:** [YYYY-MM-DD]
**Incident Commander:** SRE On-Call

## Executive Summary
Concise business and customer impact summary (Downtime duration, impacted user percentage, failed requests count).

## Incident Timeline (UTC)
| Timestamp | Event / Action | Actor/System |
|---|---|---|

## Root Cause Analysis (5 Whys)
1. **Why did the outage occur?** ...
2. **Why?** ...
3. **Why?** ...
4. **Why?** ...
5. **Why (Root Systemic Cause)?** ...

## Action Items & Preventive Measures
| Action Item | Type | Priority | Owner | Ticket |
|---|---|---|---|---|
</output_schema>
</system_instruction>

<raw_slack_logs>
{{raw_slack_logs}}
</raw_slack_logs>

<sentry_error_logs>
{{sentry_error_logs}}
</sentry_error_logs>`,
    sampleInput: {
      incident_title: "Payment Gateway Connection Timeout Outage",
      raw_slack_logs: "14:02 UTC - @alex: Users reporting HTTP 504 on checkout\n14:05 UTC - @sarah: Datadog shows payment-service p99 latency spiked to 30s\n14:12 UTC - @devin: Found database pool exhausted at 100/100 connections\n14:20 UTC - @sarah: Restarted payment pods, traffic recovering",
      sentry_error_logs: "ConnectionPoolTimeoutError: Timeout waiting for connection from pool (max 100)",
      severity_level: "SEV-1 (Critical Outage)"
    },
    sampleOutput: `# Blameless Postmortem: Payment Gateway Connection Timeout Outage

**Severity:** SEV-1 (Critical Outage)
**Date:** 2026-04-15
**Incident Commander:** SRE On-Call

## Executive Summary
At 14:02 UTC, the checkout service experienced a 18-minute SEV-1 outage affecting approximately 32% of active users. Total failed transactions: 1,420. The issue was resolved by restarting payment pods at 14:20 UTC.

## Incident Timeline (UTC)
| Timestamp | Event / Action | Actor/System |
|---|---|---|
| 14:02 UTC | Customer checkout attempts begin returning HTTP 504 Gateway Timeouts | Automated Monitor |
| 14:05 UTC | SRE on-call paged; Datadog shows payment-service p99 latency at 30,000ms | Sentry / Datadog |
| 14:12 UTC | Root cause identified: Postgres connection pool maxed out at 100/100 connections | SRE Team |
| 14:20 UTC | Pods restarted; connection pool cleared; checkout success returns to 100% | SRE Team |

## Root Cause Analysis (5 Whys)
1. **Why did checkouts return 504 errors?** The payment microservice connection pool timed out waiting for database connections.
2. **Why was the pool exhausted?** Database connections were held open indefinitely during external Stripe API calls.
3. **Why were connections held open?** A recent release omitted a HTTP client timeout parameter on external API network calls.
4. **Why was the missing timeout not caught in staging?** Staging environment mock servers respond instantaneously, masking network hang issues.
5. **Why (Root Systemic Cause)?** Lack of architectural linting rules requiring explicit timeouts on all outbound HTTP client instances.`
  },
  {
    id: "competitive-market-strategy-teardown",
    title: "Competitive & Market Strategy Teardown",
    slug: "competitive-market-strategy-teardown",
    category: "Writing & Strategy",
    author: "Sanskar Bandgar (@sanskarut)",
    stars: 215,
    version: "1.0.0",
    tags: ["Strategy", "Market Analysis", "Competitive Teardown", "SaaS", "Product"],
    summary: "Evaluates tech products against competitors using moat analysis, pricing models, and feature gap matrices.",
    compatibility: ["Claude Code", "Cursor", "OpenAI Swarm", "LangChain"],
    parameters: [
      {
        name: "target_product",
        type: "string",
        description: "Name and description of target product being analyzed",
        required: true,
        default: ""
      },
      {
        name: "primary_competitors",
        type: "string",
        description: "Comma-separated list of top competitors",
        required: true,
        default: ""
      },
      {
        name: "target_market_segment",
        type: "select",
        description: "Primary audience focus",
        required: true,
        options: ["Developer Tooling / B2D", "Enterprise SaaS", "Consumer Tech", "Fintech / Insurtech"],
        default: "Developer Tooling / B2D"
      }
    ],
    executablePrompt: `<system_instruction>
You are a Principal Product Strategist & Venture Analyst.
Perform a rigorous market teardown evaluating {{target_product}} against key competitors: {{primary_competitors}}.
Segment: {{target_market_segment}}

<analysis_dimensions>
1. FEATURE MATRIX GAP ANALYSIS:
   - Construct a granular feature parity table evaluating core technical capabilities.
2. DEFENSIBILITY & MOAT EVALUATION:
   - Analyze 7 Powers moats (Network Effects, Switching Costs, Scale Economies, Counter-Positioning, Unique Process, Branding).
3. PRICING & PACKAGING STRUCTURE:
   - Compare value metric triggers (per-seat vs usage-based vs tier limits).
4. STRATEGIC RECOMMENDATIONS:
   - Identify counter-positioning moves to capture market share.
</analysis_dimensions>

<output_schema>
# Strategic Market Teardown: {{target_product}}

## Executive Summary
High-level positioning statement and market landscape posture.

## Feature Parity & Gap Matrix
| Capability | {{target_product}} | Competitor 1 | Competitor 2 | Advantage |
|---|---|---|---|---|

## Defensibility Moats (7 Powers Framework)
- **Switching Costs:** High/Med/Low explanation
- **Network Effects:** Analysis
- **Counter-Positioning:** Strategic opportunities

## Pricing & Packaging Analysis
Comparative teardown of monetization levers.

## Actionable Growth Roadmap
1. Immediate wedge feature opportunity
2. Enterprise expansion vector
</output_schema>
</system_instruction>`,
    sampleInput: {
      target_product: "Apex AI Skills Directory",
      primary_competitors: "PromptBase, GitHub Awesome Lists, LangChain Hub",
      target_market_segment: "Developer Tooling / B2D"
    },
    sampleOutput: `# Strategic Market Teardown: Apex AI Skills Directory

## Executive Summary
Apex AI Skills Directory positions itself as an enterprise-grade, deterministic AI skill repository for autonomous agent runtimes. Unlike raw prompt repositories that offer unvalidated text snippets, Apex targets engineering teams requiring schema validation, parameter interpolation, and multi-file agent skills.

## Feature Parity & Gap Matrix
| Capability | Apex AI Skills | PromptBase | LangChain Hub | Advantage |
|---|---|---|---|---|
| Dynamic Parameter Schemas | Yes (Typed) | No (Static text) | Partial | Apex (Runtime Type Safety) |
| Executable Prompt Blueprints | Yes | No | Yes | Tier-1 |
| Blazing Fast Local Search | Yes | No | No | Apex (Developer UX) |
| Multi-file Skill Bundles | Yes | No | No | Apex (Agent Ready) |

## Defensibility Moats (7 Powers Framework)
- **Switching Costs:** High once engineering teams integrate Apex's open-standard skill schema directly into their CI/CD and agent execution runtimes.
- **Counter-Positioning:** Open-core directory with zero paywalls counter-positions paid marketplaces like PromptBase.

## Actionable Growth Roadmap
1. Launch CLI tool (\`apex add <skill-id>\`) to embed skills directly into developer repositories.
2. Partner with agent frameworks (CrewAI, LangChain, Swarm) for native schema importing.`
  }
];
