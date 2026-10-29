# Competitive & Market Strategy Teardown (v1.0.0)

**Category:** Writing & Strategy
**Author:** Sanskar Bandgar (@sanskarut)
**Stars:** 215
**Compatibility:** Claude Code, Cursor, OpenAI Swarm, LangChain

## Summary
Evaluates tech products against competitors using moat analysis, pricing models, and feature gap matrices.

## Parameters
- `target_product` (string, required): Name and description of target product being analyzed
- `primary_competitors` (string, required): Comma-separated list of top competitors
- `target_market_segment` (select, required): Primary audience focus

## Executable Prompt Template
```xml
<system_instruction>
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
</system_instruction>
```

## Sample Input
```json
{
  "target_product": "Apex AI Skills Directory",
  "primary_competitors": "PromptBase, GitHub Awesome Lists, LangChain Hub",
  "target_market_segment": "Developer Tooling / B2D"
}
```

## Sample Output
```markdown
# Strategic Market Teardown: Apex AI Skills Directory

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
1. Launch CLI tool (`apex add <skill-id>`) to embed skills directly into developer repositories.
2. Partner with agent frameworks (CrewAI, LangChain, Swarm) for native schema importing.
```
