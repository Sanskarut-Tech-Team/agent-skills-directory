# Database Schema & SQL Query Optimizer (v2.1.0)

**Category:** Architecture & Data
**Author:** Sanskar Bandgar (@sanskarut)
**Stars:** 418
**Compatibility:** Claude Code, Cursor, LangChain, OpenAI Swarm

## Summary
Analyzes EXPLAIN ANALYZE logs and SQL queries to suggest composite indexes and query rewrites.

## Parameters
- `database_engine` (select, required): Database management system engine
- `sql_query` (string, required): The raw slow SQL query or ORM query string
- `explain_plan` (string): Optional EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) query execution log
- `table_indexes` (string): Existing schema DDL or existing index definitions

## Executable Prompt Template
```xml
<system_instruction>
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
   - Provide clean, non-blocking DDL (`CREATE INDEX CONCURRENTLY`) and estimated latency/cost reduction percentage.
</optimization_strategy>

<output_schema>
## Executive Performance Analysis
- **Engine:** {{database_engine}}
- **Primary Bottleneck:** [Sequential Scan / Spill to Disk / N+1 Loop]
- **Predicted Speedup:** [e.g., 12x (98% reduction in buffer reads)]

### Execution Bottlenecks
Detail the node-by-node cost driver from EXPLAIN ANALYZE or query structure.

### Recommended DDL Migration
```sql
-- Non-blocking index creation statements
```

### Optimized SQL Query Rewrites
```sql
-- Refactored high-performance SQL query
```

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
</table_indexes>
```

## Sample Input
```json
{
  "database_engine": "PostgreSQL 16",
  "sql_query": "SELECT o.id, o.created_at, u.email FROM orders o JOIN users u ON o.user_id = u.id WHERE o.status = 'PENDING' AND o.created_at >= '2026-01-01' ORDER BY o.created_at DESC LIMIT 50;",
  "explain_plan": "Limit (cost=45210.12..45210.25 rows=50 width=48)\n  -> Sort (cost=45210.12..45800.00 rows=235000 width=48)\n        Sort Key: o.created_at DESC\n        -> Hash Join (cost=1200.00..38900.50 rows=235000 width=48)\n              -> Seq Scan on orders o (cost=0.00..31200.00 rows=235000 width=32)\n                    Filter: ((status = 'PENDING'::text) AND (created_at >= '2026-01-01'::timestamp))",
  "table_indexes": "CREATE TABLE orders (id uuid PRIMARY KEY, user_id uuid, status text, created_at timestamp);"
}
```

## Sample Output
```markdown
## Executive Performance Analysis
- **Engine:** PostgreSQL 16
- **Primary Bottleneck:** Full Sequential Scan on `orders` table (`cost=31200.00`) combined with Memory Sort spillage on `created_at`.
- **Predicted Speedup:** ~45x latency reduction (eliminates sequential scan and in-memory sort).

### Execution Bottlenecks
The query planner performs a full table scan on `orders` filtering by `status` and `created_at`. Because no index covers `status` and `created_at` together, PostgreSQL scans all 235,000 rows into memory and runs a dynamic sort.

### Recommended DDL Migration
```sql
-- Create composite partial index to satisfy filter + sort order directly
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_pending_created
ON orders (status, created_at DESC)
INCLUDE (user_id)
WHERE status = 'PENDING';
```

### Optimized SQL Query Rewrites
```sql
SELECT o.id, o.created_at, u.email
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE o.status = 'PENDING'
  AND o.created_at >= '2026-01-01'
ORDER BY o.created_at DESC
LIMIT 50;
```

### Architectural Index & Partitioning Advice
- Column order in `idx_orders_pending_created` uses equality first (`status`) and range second (`created_at DESC`).
- Using `INCLUDE (user_id)` enables Index-Only Scans, eliminating table heap fetches entirely.
```
