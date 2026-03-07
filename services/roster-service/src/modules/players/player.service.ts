import db from "../../config/db.js";

export async function createPlayerService(name: string) {
  const result = await db.query(
    `INSERT INTO players (name) VALUES ($1)
     RETURNING id, name, is_batsman, is_bowler, is_wicket_keeper, created_at`,
    [name.trim()]
  );
  const row = result.rows[0];
  if (!row) throw new Error("Player creation failed");
  return row;
}

export async function getPlayersService() {
  const result = await db.query(
    `SELECT id, name, is_batsman, is_bowler, is_wicket_keeper, created_at
     FROM players
     ORDER BY created_at DESC`
  );
  return result.rows;
}

export async function updatePlayerRoleService(
  playerId: string,
  isBatsman: boolean,
  isBowler: boolean,
  isWicketKeeper: boolean
) {
  const result = await db.query(
    `UPDATE players
     SET is_batsman = $1, is_bowler = $2, is_wicket_keeper = $3
     WHERE id = $4
     RETURNING id, name, is_batsman, is_bowler, is_wicket_keeper`,
    [isBatsman, isBowler, isWicketKeeper, playerId]
  );
  if ((result.rowCount ?? 0) === 0) {
    throw Object.assign(new Error("Player not found"), { statusCode: 404 });
  }
  const row = result.rows[0];
  if (!row) throw new Error("Update failed");
  return row;
}