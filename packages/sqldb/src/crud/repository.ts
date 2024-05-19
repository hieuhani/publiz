import { Database, SqlDatabase } from "../database";
import { Insertable, Updateable } from "kysely";

export const createCrudRepository = <T extends keyof Database>(
  db: SqlDatabase,
  table: T
) => {
  return {
    /**
     * @deprecated use getById instead
     * @param id
     * @returns
     */
    findById: (id: number) => {
      return db
        .selectFrom(table)
        .where("id", "=", id as any)
        .selectAll()
        .executeTakeFirstOrThrow();
    },
    getById: (id: number) => {
      return db
        .selectFrom(table)
        .where("id", "=", id as any)
        .selectAll()
        .executeTakeFirstOrThrow();
    },
    async findByIds(ids: number[]) {
      return db
        .selectFrom(table)
        .selectAll()
        .where("id", "in", ids as any)
        .execute();
    },
    async create(row: Insertable<T>) {
      const { id } = await db
        .insertInto(table)
        .values(row as any)
        .returning("id")
        .executeTakeFirstOrThrow();
      return this.getById(id);
    },
    async createMulti(rows: Insertable<T>[]) {
      return await db
        .insertInto(table)
        .values(rows as any)
        .execute();
    },
    async update(id: number, payload: Updateable<T>) {
      await db
        .updateTable(table)
        .set(payload as any)
        .where("id", "=", id as any)
        .executeTakeFirstOrThrow();
      return this.getById(id);
    },
    async delete(id: number): Promise<void> {
      await db
        .deleteFrom(table)
        .where("id", "=", id as any)
        .executeTakeFirstOrThrow();
    },
    async bulkDelete(ids: number[]): Promise<void> {
      await db
        .deleteFrom(table)
        .where("id", "in", ids as any)
        .execute();
    },
    async find() {
      return db.selectFrom(table).selectAll().execute();
    },
  };
};
