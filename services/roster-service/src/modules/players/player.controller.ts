import type { Request, Response, NextFunction } from "express";
import {
  createPlayerService,
  getPlayersService,
  updatePlayerRoleService,
} from "./player.service.js";
import { isValidUUID, isNonEmptyString, isValidLength } from "../../utils/validate.js";

export async function createPlayer(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as Record<string, unknown>;
    if (!isNonEmptyString(body.name) || !isValidLength(body.name, 2, 100)) {
      res.status(400).json({ message: "Name must be 2–100 characters" });
      return;
    }
    const player = await createPlayerService(body.name);
    res.status(201).json(player);
  } catch (err) {
    next(err);
  }
}

export async function getPlayers(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const players = await getPlayersService();
    res.status(200).json(players);
  } catch (err) {
    next(err);
  }
}

export async function updatePlayerRole(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    if (!isValidUUID(id)) {
      res.status(400).json({ message: "Invalid player ID" });
      return;
    }

    const body = req.body as Record<string, unknown>;
    const { isBatsman, isBowler, isWicketKeeper } = body;

    if (
      typeof isBatsman !== "boolean" ||
      typeof isBowler !== "boolean" ||
      typeof isWicketKeeper !== "boolean"
    ) {
      res.status(400).json({ message: "isBatsman, isBowler, isWicketKeeper must be booleans" });
      return;
    }

    const player = await updatePlayerRoleService(id, isBatsman, isBowler, isWicketKeeper);
    res.status(200).json(player);
  } catch (err) {
    next(err);
  }
}