import db from "./db.js";

export function getWatchlistByUserId(userId) {
  return db
    .prepare(
      `
    SELECT m.*
    FROM watchlist w
    JOIN movies m ON m.id = w.movie_id
    WHERE w.user_id = ?
    ORDER BY m.title
  `
    )
    .all(userId);
}

export function addToWatchlist(userId, movieId) {
  const exists = db
    .prepare("SELECT 1 FROM watchlist WHERE user_id = ? AND movie_id = ?")
    .get(userId, movieId);

  if (exists) return;

  db.prepare("INSERT INTO watchlist (user_id, movie_id) VALUES (?, ?)")
    .run(userId, movieId);
}

export function removeFromWatchlist(userId, movieId) {
  db.prepare("DELETE FROM watchlist WHERE user_id = ? AND movie_id = ?")
    .run(userId, movieId);
}