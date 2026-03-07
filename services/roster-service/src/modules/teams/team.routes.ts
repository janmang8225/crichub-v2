import { Router } from "express";
import {
  createTeam,
  getTeams,
  getPlayersByTeam,
  addPlayerToTeam,
  deactivatePlayerFromTeam,
} from "./team.controller.js";

const router = Router();

router.post("/", createTeam);
router.get("/", getTeams);
router.get("/:teamId/players", getPlayersByTeam);
router.post("/:teamId/players/:playerId", addPlayerToTeam);
router.patch("/:teamId/players/:playerId/deactivate", deactivatePlayerFromTeam);

export default router;