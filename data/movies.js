import db from "./db.js";

export function getAllMovies(query) {
  if (query) {
    const like = `%${query}%`;
    return db
      .prepare("SELECT * FROM movies WHERE title LIKE ? ORDER BY title")
      .all(like);
  }
  return db.prepare("SELECT * FROM movies ORDER BY title").all();
}

export function getMovieById(id) {
  return db.prepare("SELECT * FROM movies WHERE id = ?").get(id);
}