import express from "express";
import { authMiddleware } from "./authRoutes.js";
import { getAllMovies } from "../data/movies.js";

const router = express.Router();

router.get("/movies", authMiddleware, (req, res) => {
  const q = req.query.query || "";
  const movies = getAllMovies(q);
  res.json(movies);
});

export default router;