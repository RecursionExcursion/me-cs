import express from "express";
import { getGame, getStats, getTeam, getTeams, test } from "./cfbrController";

const router = express.Router();

router.get("/teams", getTeams);
router.get("/team", getTeam);
router.get("/game", getGame);
router.get("/stats", getStats);
router.get("/test", test);

export default router;
