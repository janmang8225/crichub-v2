import type { Request, Response, NextFunction } from "express";
import {
  createTeamService,
  getTeamsService,
  getPlayersByTeamService,
  addPlayerToTeamService,
  deactivatePlayerFromTeamService,
} from "./team.service.js";
import { isValidUUID, isNonEmptyString, isValidLength } from "../../utils/validate.js";

export async function createTeam(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as Record<string, unknown>;
    if (!isNonEmptyString(body.name) || !isValidLength(body.name, 2, 100)) {
      res.status(400).json({ message: "Team name must be 2-100 characters" });
      return;
    }
    const team = await createTeamService(body.name);
    res.status(201).json(team);
  } catch (err) {
    next(err);
  }
}

export async function getTeams(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const teams = await getTeamsService();
    res.status(200).json(teams);
  } catch (err) {
    next(err);
  }
}

export async function getPlayersByTeam(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { teamId } = req.params as { teamId: string };
    if (!isValidUUID(teamId)) {
      res.status(400).json({ message: "Invalid team ID" });
      return;
    }
    const players = await getPlayersByTeamService(teamId);
    res.status(200).json(players);
  } catch (err) {
    next(err);
  }
}

export async function addPlayerToTeam(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { teamId, playerId } = req.params as {
      teamId: string;
      playerId: string;
    };
    if (!isValidUUID(teamId) || !isValidUUID(playerId)) {
      res.status(400).json({ message: "Invalid team or player ID" });
      return;
    }
    const result = await addPlayerToTeamService(teamId, playerId);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function deactivatePlayerFromTeam(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { teamId, playerId } = req.params as {
      teamId: string;
      playerId: string;
    };
    if (!isValidUUID(teamId) || !isValidUUID(playerId)) {
      res.status(400).json({ message: "Invalid team or player ID" });
      return;
    }
    const result = await deactivatePlayerFromTeamService(teamId, playerId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}