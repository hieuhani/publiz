import { CreateTableBuilder, sql } from "kysely";

export function withTimestamps<Table extends string, Fields extends string>(
  qb: CreateTableBuilder<Table, Fields>
) {
  return qb
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`)
    );
}
