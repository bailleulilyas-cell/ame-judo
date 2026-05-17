import mysql from "mysql2/promise";

declare global {
  // eslint-disable-next-line no-var
  var __mysqlPool: mysql.Pool | undefined;
}

function makePool(): mysql.Pool {
  return mysql.createPool({
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "ame_judo",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: "utf8mb4",
    dateStrings: true,
  });
}

export const db = global.__mysqlPool ?? makePool();
if (process.env.NODE_ENV !== "production") global.__mysqlPool = db;

type Param = string | number | boolean | Date | null | Buffer;

export async function query<T = unknown>(
  sql: string,
  params: Param[] = []
): Promise<T[]> {
  const [rows] = await db.execute(sql, params);
  return rows as T[];
}

export async function queryOne<T = unknown>(
  sql: string,
  params: Param[] = []
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}
