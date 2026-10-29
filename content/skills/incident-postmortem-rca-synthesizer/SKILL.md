# Incident Postmortem & RCA Synthesizer (v1.1.0)

**Category:** Workflow & Automation
**Author:** Sanskar Bandgar (@sanskarut)
**Stars:** 395
**Compatibility:** Claude Code, Cursor, OpenAI Swarm, LangChain

## Summary
Synthesizes Slack threads, Sentry logs, and metrics into blameless postmortems with RCA timelines.

## Parameters
- `incident_title` (string, required): Name of the outage or service degradation incident
- `raw_slack_logs` (string, required): Exported Slack chat transcripts or incident channel notes
- `sentry_error_logs` (string): Raw stack traces, Sentry alert payloads, or Datadog log exports
- `severity_level` (select, required): Assigned incident severity score

## Executable Prompt Template
```xml
<system_instruction>
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
</sentry_error_logs>
```

## Sample Input
```json
{
  "incident_title": "Payment Gateway Connection Timeout Outage",
  "raw_slack_logs": "14:02 UTC - @alex: Users reporting HTTP 504 on checkout\n14:05 UTC - @sarah: Datadog shows payment-service p99 latency spiked to 30s\n14:12 UTC - @devin: Found database pool exhausted at 100/100 connections\n14:20 UTC - @sarah: Restarted payment pods, traffic recovering",
  "sentry_error_logs": "ConnectionPoolTimeoutError: Timeout waiting for connection from pool (max 100)",
  "severity_level": "SEV-1 (Critical Outage)"
}
```

## Sample Output
```markdown
# Blameless Postmortem: Payment Gateway Connection Timeout Outage

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
5. **Why (Root Systemic Cause)?** Lack of architectural linting rules requiring explicit timeouts on all outbound HTTP client instances.
```
