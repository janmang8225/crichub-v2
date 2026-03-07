import type { Request, Response, NextFunction } from "express";
import db from "../../config/db.js";

// Called by Match Engine to validate players belong to a team
export async function getActiveTeamPlayers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { teamId } = req.params as { teamId: string };
    const result = await db.query(
      `SELECT player_id FROM team_players
       WHERE team_id = $1 AND is_active = true`,
      [teamId]
    );
    res.status(200).json({
      teamId,
      playerIds: result.rows.map((r) => r.player_id as string),
    });
  } catch (err) {
    next(err);
  }
}