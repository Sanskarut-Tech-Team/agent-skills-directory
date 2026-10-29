# API Spec to Typesafe SDK Generator (v1.5.0)

**Category:** Architecture & Data
**Author:** Sanskar Bandgar (@sanskarut)
**Stars:** 310
**Compatibility:** Claude Code, Cursor, LangChain, CrewAI

## Summary
Transforms OpenAPI/Swagger specs into idiomatic TypeScript clients paired with Zod runtime schemas.

## Parameters
- `api_spec_type` (select, required): Format of input API specification
- `spec_content` (string, required): Raw API spec payload or schema definition
- `sdk_name` (string, required): Class name for generated TypeScript SDK client
- `include_zod_validation` (boolean): Generate Zod validation schemas for request/response runtime validation

## Executable Prompt Template
```xml
<system_instruction>
You are a Principal Software Architect specializing in SDK Engineering & Developer Tooling.
Goal: Transform the provided {{api_spec_type}} specification into a production-ready, type-safe TypeScript SDK client.
SDK Client Name: {{sdk_name}}
Include Zod Runtime Validation: {{include_zod_validation}}

<design_requirements>
1. TYPESCRIPT GENERATION:
   - Output clean, idiomatic TypeScript interfaces for all request parameters, headers, and response payloads.
   - Zero `any` usage; leverage strict generics and Discriminated Unions for error responses.
2. RUNTIME VALIDATION (Zod):
   - Export corresponding Zod schemas (e.g. `UserSchema = z.object({ ... })`).
3. HTTP CLIENT RESILIENCE:
   - Use native `fetch` with configurable base URL, authorization headers (Bearer token / API key), automatic retry logic, and structured error handling.
</design_requirements>

<output_schema>
Provide the generated SDK as a clean, single-file TypeScript module:
```typescript
import { z } from 'zod';

// 1. Zod Schemas
// 2. Inferred TypeScript Types
// 3. Custom API Error Class
// 4. SDK Client Class with typed methods
```
</output_schema>
</system_instruction>

<spec_content>
{{spec_content}}
</spec_content>
```

## Sample Input
```json
{
  "api_spec_type": "OpenAPI 3.1 JSON/YAML",
  "spec_content": "paths:\n  /v1/agents:\n    get:\n      summary: List AI Agents\n      parameters:\n        - name: limit\n          in: query\n          schema:\n            type: integer\n            default: 10\n      responses:\n        '200':\n          description: Success\n          content:\n            application/json:\n              schema:\n                type: object\n                properties:\n                  agents:\n                    type: array\n                    items:\n                      type: object\n                      properties:\n                        id:\n                          type: string\n                        name:\n                          type: string\n                        status:\n                          type: string\n                          enum: [active, idle, failed]",
  "sdk_name": "ApexAgentClient",
  "include_zod_validation": true
}
```

## Sample Output
```markdown
```typescript
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
    const url = `${this.baseUrl}/v1/agents?${query.toString()}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new ApexApiError(res.status, `HTTP error ${res.status}: ${res.statusText}`);
    }

    const json = await res.json();
    return ListAgentsResponseSchema.parse(json);
  }
}
```
```
