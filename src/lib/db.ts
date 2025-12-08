import { Pool } from "pg";


export const db = new Pool({
    host: process.env.PGHOST ?? "localhost",
    port: Number(process.env.PGPORT) || 5432,
    database: process.env.PGDATABASE ?? "design_system_dev",
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
});