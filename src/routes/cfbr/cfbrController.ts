import express from "express";
import { getAllTeams } from "./cfbrService";

const router = express.Router();

router.get("/", (req, res) => {
  getAllTeams();
  res.status(200).send({ data: "Hello from cfbr!" });
});

export default router;