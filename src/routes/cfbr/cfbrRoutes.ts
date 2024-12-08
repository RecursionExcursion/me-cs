import express from "express";
import {
  getGame,
  getRankings,
  getStats,
  getTeam,
  getTeamGames,
  getTeams,
  test,
  getGames,
} from "./cfbrController";

const router = express.Router();

router.get("/teams", getTeams);
router.get("/games", getGames);
router.get("/team", getTeam);
router.get("/teamGames", getTeamGames);
router.get("/game", getGame);
router.get("/stats", getStats);
router.get("/rankings", getRankings);

router.get("/test", test);

export default router;
