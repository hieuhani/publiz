import { Database, SqlDatabase } from "../database";
import { Insertable, Selectable, Updateable } from "kysely";

type Table = keyof Database;
export function createCrudRepository<R extends Database[Table]>(
  db: SqlDatabase,
  table: Table
) {
  return {
    async findById(id: number): Promise<Selectable<R>> {
      return db
        .selectFrom(table)
        .selectAll()
        .where("id", "=", id)
        .executeTakeFirstOrThrow() as Selectable<R>;
    },
    async findByIds(ids: number[]): Promise<Selectable<R>[]> {
      return db
        .selectFrom(table)
        .selectAll()
        .where("id", "in", ids)
        .execute() as Promise<Selectable<R>[]>;
    },
    async create(row: Insertable<Table>): Promise<Selectable<R>> {
      const { id } = await db
        .insertInto(table)
        .values(row)
        .returning("id")
        .executeTakeFirstOrThrow();
      return this.findById(id) as Selectable<R>;
    },

    async createMulti(rows: Insertable<Table>[]) {
      await db.insertInto(table).values(rows).execute();
    },

    async update(
      id: number,
      payload: Updateable<Table>
    ): Promise<Selectable<R>> {
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
