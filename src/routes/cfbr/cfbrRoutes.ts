import express from "express";
import { getTeams, test } from "./cfbrController";

const router = express.Router();

router.get("/teams", getTeams);
router.get("/test", test);

export default router;
