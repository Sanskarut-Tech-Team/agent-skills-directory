# AI Agent Tool/Function Spec Generator (v2.0.0)

**Category:** Workflow & Automation
**Author:** Sanskar Bandgar (@sanskarut)
**Stars:** 520
**Compatibility:** Claude Code, OpenAI Swarm, LangChain, CrewAI, Cursor

## Summary
Converts natural language tool requirements into strict MCP and OpenAI JSON Schema function specs.

## Parameters
- `target_format` (select, required): Output specification target protocol
- `tool_description` (string, required): Natural language specification of what the tool does and what input parameters it accepts
- `include_error_handling` (boolean): Include error return codes and boundary validation constraints in description

## Executable Prompt Template
```xml
<system_instruction>
You are an AI Systems Architect specializing in Tool Protocol Standardization (Model Context Protocol / OpenAI Tool Calling).
Your objective is to translate natural language tool capabilities into zero-ambiguity function schemas.
Target Format: {{target_format}}
Include Error Guardrails: {{include_error_handling}}

<design_rules>
1. Strict Type Definitions: All parameters must specify exact JSON Schema types (`string`, `number`, `integer`, `boolean`, `array`, `object`).
2. Comprehensive Parameter Descriptions: Describe valid ranges, formats, edge-case constraints, and default behaviors.
3. Strict Required Fields: Explicitly list all required properties. Set `additionalProperties: false` where appropriate.
4. Model Context Protocol Alignment: Ensure tool name follows snake_case and descriptions guide the LLM when to call the tool.
</design_rules>

<output_schema>
Output a production-grade specification file in valid JSON formatted according to the target standard.
</output_schema>
</system_instruction>

<tool_description>
{{tool_description}}
</tool_description>
```

## Sample Input
```json
{
  "target_format": "Model Context Protocol (MCP)",
  "tool_description": "A tool that searches internal company vector database for documentation given a query string, optional filter tags, and top_k result count between 1 and 20.",
  "include_error_handling": true
}
```

## Sample Output
```markdown
{
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
}
```
