import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createUser, getUserByEmail } from "../data/users.js";

const router = express.Router();
const JWT_SECRET = "j%Rk8!2dA$9e#4pQwL1zVu&bT*3sMnXr";

router.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password || password.length < 4) {
    return res.status(400).json({ error: "Adj meg emailt és jelszót." });
  }

  try {
    const user = createUser(email, password);
    res.status(201).json({ message: "Sikeres regisztráció.", user });
  } catch (err) {
    if (err.message === "EMAIL_EXISTS") {
      return res.status(409).json({ error: "Ez az email már létezik." });
    }
    res.status(500).json({ error: "Szerver hiba." });
  }
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = getUserByEmail(email);
  if (!user) return res.status(401).json({ error: "Hibás email vagy jelszó." });

  const ok = bcrypt.compareSync(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "Hibás email vagy jelszó." });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: "2h"
  });

  res.json({ token });
});

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) return res.status(401).json({ error: "Hiányzó token." });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.userId };
    next();
  } catch {
    res.status(401).json({ error: "Érvénytelen token." });
  }
}

export default router;