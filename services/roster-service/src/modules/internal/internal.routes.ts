import { Router } from "express";
import { internalAuthMiddleware } from "../../middlewares/internalAuth.middleware.js";
import { getActiveTeamPlayers } from "./internal.controller.js";

const router = Router();

router.use(internalAuthMiddleware);
router.get("/teams/:teamId/players", getActiveTeamPlayers);

export default router;