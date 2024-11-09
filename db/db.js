import pg from "pg";
import env from "dotenv";

env.config({
  path: "./.env",
});

const db = new pg.Client({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT,
  password: process.env.DATABASE_PASSWORD,
});

export default db;
