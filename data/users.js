import db from "./db.js";
import bcrypt from "bcrypt";

export function createUser(email, password) {
  const existing = db
    .prepare("SELECT id FROM users WHERE email = ?")
    .get(email);

  if (existing) throw new Error("EMAIL_EXISTS");

  const password_hash = bcrypt.hashSync(password, 10);

  const info = db
    .prepare("INSERT INTO users (email, password_hash) VALUES (?, ?)")
    .run(email, password_hash);

  return { id: info.lastInsertRowid, email };
}

export function getUserByEmail(email) {
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email);
}

export function getUserById(id) {
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id);
}