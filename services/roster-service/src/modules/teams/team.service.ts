import db from "../../config/db.js";

export async function createTeamService(name: string) {
  const result = await db.query(
    `INSERT INTO teams (name) VALUES ($1)
     RETURNING id, name, created_at`,
    [name.trim()]
  );
  const row = result.rows[0];
  if (!row) throw new Error("Team creation failed");
  return row;
}

export async function getTeamsService() {
  const result = await db.query(
    `SELECT id, name, created_at FROM teams ORDER BY created_at DESC`
  );
  return result.rows;
}

export async function getPlayersByTeamService(teamId: string) {
  const result = await db.query(
    `SELECT p.id, p.name, p.is_batsman, p.is_bowler, p.is_wicket_keeper
     FROM team_players tp
     JOIN players p ON p.id = tp.player_id
     WHERE tp.team_id = $1 AND tp.is_active = true`,
    [teamId]
  );
  return result.rows;
}

export async function addPlayerToTeamService(
  teamId: string,
  playerId: string
) {
  const team = await db.query(
    `SELECT id FROM teams WHERE id = $1`,
    [teamId]
  );
  if ((team.rowCount ?? 0) === 0) {
    throw Object.assign(new Error("Team not found"), { statusCode: 404 });
  }

  const player = await db.query(
    `SELECT id FROM players WHERE id = $1`,
    [playerId]
  );
  if ((player.rowCount ?? 0) === 0) {
    throw Object.assign(new Error("Player not found"), { statusCode: 404 });
  }

  const result = await db.query(
    `INSERT INTO team_players (team_id, player_id)
     VALUES ($1, $2)
     RETURNING team_id, player_id, is_active, joined_at`,
    [teamId, playerId]
  );
  const row = result.rows[0];
  if (!row) throw new Error("Failed to add player to team");
  return row;
}

export async function deactivatePlayerFromTeamService(
  teamId: string,
  playerId: string
) {
  const result = await db.query(
    `UPDATE team_players
     SET is_active = false, left_at = now()
     WHERE team_id = $1 AND player_id = $2 AND is_active = true
     RETURNING team_id, player_id, is_active, left_at`,
    [teamId, playerId]
  );
  if ((result.rowCount ?? 0) === 0) {
    throw Object.assign(new Error("Active team-player record not found"), { statusCode: 404 });
  }
  const row = result.rows[0];
  if (!row) throw new Error("Update failed");
  return row;
}