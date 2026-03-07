import { Router } from "express";
import {
  createPlayer,
  getPlayers,
  updatePlayerRole,
} from "./player.controller.js";

const router = Router();

router.post("/", createPlayer);
router.get("/", getPlayers);
router.patch("/:id/role", updatePlayerRole);

export default router;