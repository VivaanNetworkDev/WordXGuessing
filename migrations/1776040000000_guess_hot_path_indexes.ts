import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
    CREATE INDEX IF NOT EXISTS guesses_game_id_guess_idx
    ON guesses (game_id, guess);
  `.execute(db);

  await sql`
    CREATE INDEX IF NOT EXISTS guesses_game_id_created_at_idx
    ON guesses (game_id, created_at);
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`
    DROP INDEX IF EXISTS guesses_game_id_created_at_idx;
  `.execute(db);

  await sql`
    DROP INDEX IF EXISTS guesses_game_id_guess_idx;
  `.execute(db);
}
