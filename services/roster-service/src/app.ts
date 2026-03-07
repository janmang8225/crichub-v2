import express from "express";
import cors from "cors";
import playerRoutes from "./modules/players/player.routes.js";
import teamRoutes from "./modules/teams/team.routes.js";
import internalRoutes from "./modules/internal/internal.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "roster-service" });
});

app.use("/players", playerRoutes);
app.use("/teams", teamRoutes);
app.use("/internal", internalRoutes);

app.use(errorMiddleware);

export default app;