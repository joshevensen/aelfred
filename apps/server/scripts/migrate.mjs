/**
 * Applies Aelf.red-owned SQL migrations to the configured Postgres database.
 * @context   Phase 2 auth/profile tables need a repeatable path that is separate from Mastra-managed storage.
 * @gotchas   Loads the repo root `.env`; migration files are idempotent through `aelfred_migrations`, not through permissive SQL.
 * @dependencies node:fs/promises, node:crypto, dotenv, pg
 */
import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import pg from "pg";

const { Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../../..");
const migrationsDir = path.resolve(__dirname, "../migrations");
const migrationsTable = "aelfred_migrations";
const lockId = "754001200012";

dotenv.config({ path: path.join(repoRoot, ".env"), quiet: true });

function requireDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("Missing required environment variable: DATABASE_URL");
  }

  return databaseUrl;
}

async function loadMigrations() {
  const entries = await readdir(migrationsDir, { withFileTypes: true });
  const sqlFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".sql"))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  return Promise.all(
    sqlFiles.map(async (name) => {
      const sql = await readFile(path.join(migrationsDir, name), "utf8");
      const checksum = createHash("sha256").update(sql).digest("hex");

      return { name, sql, checksum };
    }),
  );
}

async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${migrationsTable} (
      id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      name text NOT NULL UNIQUE,
      checksum text NOT NULL,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `);
}

async function getAppliedMigrations(client) {
  const result = await client.query(
    `SELECT name, checksum FROM ${migrationsTable} ORDER BY name`,
  );

  return new Map(result.rows.map((row) => [row.name, row.checksum]));
}

async function applyMigration(client, migration) {
  console.log(`Applying ${migration.name}`);
  await client.query(migration.sql);
  await client.query(
    `INSERT INTO ${migrationsTable} (name, checksum) VALUES ($1, $2)`,
    [migration.name, migration.checksum],
  );
}

async function run() {
  const migrations = await loadMigrations();
  const client = new Client({ connectionString: requireDatabaseUrl() });

  await client.connect();

  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock($1::bigint)", [lockId]);
    await ensureMigrationsTable(client);

    const appliedMigrations = await getAppliedMigrations(client);
    let appliedCount = 0;

    for (const migration of migrations) {
      const appliedChecksum = appliedMigrations.get(migration.name);

      if (appliedChecksum === migration.checksum) {
        console.log(`Skipping ${migration.name}`);
        continue;
      }

      if (appliedChecksum) {
        throw new Error(
          `Migration ${migration.name} was already applied with a different checksum`,
        );
      }

      await applyMigration(client, migration);
      appliedCount += 1;
    }

    await client.query("COMMIT");

    if (appliedCount === 0) {
      console.log("No pending migrations.");
    } else {
      console.log(`Applied ${appliedCount} migration(s).`);
    }
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      console.error("Failed to roll back migration transaction", rollbackError);
    }

    throw error;
  } finally {
    await client.end();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
