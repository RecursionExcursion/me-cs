import express from "express";
import { getAllTeams } from "./cfbrService";
import { StatWeights } from "./cfbApi/stats";

const router = express.Router();

router.get("/", async (req, res) => {
  const placeholderWeights: StatWeights = {
    offense: 1,
    defense: 1,
    pointsAllowed: 1,
    pointsFor: 1,
  };

  await getAllTeams(placeholderWeights);
  res.status(200).send({ data: "Hello from cfbr!" });
});

export default router;
