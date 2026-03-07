import { Router } from "express";
import { getUsers, updateUserRole } from "./user.controller.js";

const router = Router();

// NOTE: auth + role enforcement is handled by the API Gateway.
// By the time a request reaches this service, it has already been
// verified. The gateway forwards X-User-Id and X-User-Role headers.

router.patch("/users/:id/role", updateUserRole);
router.get("/users", getUsers);

export default router;