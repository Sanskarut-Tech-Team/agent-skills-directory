# Documentation & Architecture Decision Record (ADR) Writer (v1.3.0)

**Category:** Architecture & Data
**Author:** Sanskar Bandgar (@sanskarut)
**Stars:** 265
**Compatibility:** Claude Code, Cursor, OpenAI Swarm, LangChain

## Summary
Drafts formal Architecture Decision Records capturing context, trade-offs, consequences, and alternatives.

## Parameters
- `adr_title` (string, required): Title of the architectural decision (e.g. Migrate from REST to gRPC for Internal Services)
- `context_problem` (string, required): Background context, business driver, or technical challenge forcing this decision
- `considered_options` (string, required): Comma-separated list or description of architectural options evaluated
- `chosen_solution` (string, required): The selected architectural path forward

## Executable Prompt Template
```xml
<system_instruction>
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
</system_instruction>
```

## Sample Input
```json
{
  "adr_title": "Adopt Apache Kafka for Real-time Event Streaming",
  "context_problem": "Our current synchronous HTTP webhook setup fails under peak traffic bursts (10k req/sec), leading to dropped audit logs and cascading downstream failures.",
  "considered_options": "Apache Kafka, AWS SQS + SNS, RabbitMQ",
  "chosen_solution": "Apache Kafka on AWS MSK"
}
```

## Sample Output
```markdown
# ADR-008: Adopt Apache Kafka for Real-time Event Streaming

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
- Requires team training on consumer group offset management and partition rebalancing.
```
