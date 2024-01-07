import { Database, SqlDatabase } from "../database";
import { Insertable, Updateable } from "kysely";

type Table = keyof Database;
export function createCrudRepository<R>(db: SqlDatabase, table: Table) {
  return {
    async findById(id: number): Promise<R> {
      return db
        .selectFrom(table)
        .selectAll()
        .where("id", "=", id)
        .executeTakeFirstOrThrow() as R;
    },
    async create(row: Insertable<Table>): Promise<R> {
      const { insertId } = await db
        .insertInto(table)
        .values(row)
        .executeTakeFirstOrThrow();
      return this.findById(Number(insertId!));
    },

    async createMulti(rows: Insertable<Table>[]) {
      await db.insertInto(table).values(rows).execute();
    },

    async update(id: number, payload: Updateable<Table>): Promise<R> {
      await db
        .updateTable(table)
        .set(payload)
        .where("id", "=", id)
        .executeTakeFirstOrThrow();
      return this.findById(id);
    },
    async delete(id: number): Promise<void> {
      await db.deleteFrom(table).where("id", "=", id).executeTakeFirstOrThrow();
    },
    async bulkDelete(ids: number[]): Promise<void> {
      await db.deleteFrom(table).where("id", "in", ids).execute();
    },
    async find() {
      return db.selectFrom(table).selectAll().execute();
    },
  };
}
