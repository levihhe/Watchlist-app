import express from "express";
import { authMiddleware } from "./authRoutes.js";
import {
  getWatchlistByUserId,
  addToWatchlist,
  removeFromWatchlist
} from "../data/watchlist.js";
import { getMovieById } from "../data/movies.js";

const router = express.Router();

router.get("/watchlist", authMiddleware, (req, res) => {
  const list = getWatchlistByUserId(req.user.id);
  res.json(list);
});

router.post("/watchlist", authMiddleware, (req, res) => {
  const { movieId } = req.body;

  const movie = getMovieById(movieId);
  if (!movie) return res.status(404).json({ error: "Film nem található." });

  addToWatchlist(req.user.id, movieId);
  const list = getWatchlistByUserId(req.user.id);

  res.status(201).json(list);
});

router.delete("/watchlist/:movieId", authMiddleware, (req, res) => {
  const movieId = Number(req.params.movieId);

  removeFromWatchlist(req.user.id, movieId);
  const list = getWatchlistByUserId(req.user.id);

  res.json(list);
});

export default router;