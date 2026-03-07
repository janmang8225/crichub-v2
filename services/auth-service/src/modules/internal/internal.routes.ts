import { Router } from "express";
import { internalAuthMiddleware } from "../../middlewares/internalAuth.middleware.js";
import { getUserById } from "./internal.controller.js";

const router = Router();

router.use(internalAuthMiddleware);
router.get("/users/:id", getUserById);

export default router;