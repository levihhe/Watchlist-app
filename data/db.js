import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "watchlist.db");
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    year INTEGER,
    genre TEXT
  );

  CREATE TABLE IF NOT EXISTS watchlist (
    user_id INTEGER NOT NULL,
    movie_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, movie_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (movie_id) REFERENCES movies(id)
  );
`);

const countMovies = db.prepare("SELECT COUNT(*) AS cnt FROM movies").get().cnt;

if (countMovies === 0) {
  const insertMovie = db.prepare(
    "INSERT INTO movies (title, year, genre) VALUES (?, ?, ?)"
  );

  const movies = [
    ["The Shawshank Redemption", 1994, "Drama"],
    ["The Godfather", 1972, "Crime"],
    ["The Dark Knight", 2008, "Action"],
    ["Pulp Fiction", 1994, "Crime"],
    ["Fight Club", 1999, "Drama"],
    ["Inception", 2010, "Sci-Fi"],
    ["Forrest Gump", 1994, "Drama"],
    ["The Matrix", 1999, "Sci-Fi"],
    ["Interstellar", 2014, "Sci-Fi"],
    ["The Green Mile", 1999, "Drama"],
    ["Se7en", 1995, "Thriller"],
    ["Gladiator", 2000, "Action"],
    ["Avengers: Endgame", 2019, "Action"]
  ];

  const insertMany = db.transaction((arr) => {
    arr.forEach((m) => insertMovie.run(m[0], m[1], m[2]));
  });

  insertMany(movies);
}

export default db;