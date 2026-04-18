import "dotenv/config";
import express from "express";
import { prisma } from "@wassaly/database";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import { authenticateToken } from "./middleware/auth.middleware.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/health", authenticateToken, async (req, res) => {
  try {
    res.json({ status: "ok" });
  } catch (error) {
    console.error("Health check failed:", error);
  }
});

app.use("/api/auth", authRouter);
app.use("/api/users", authenticateToken, usersRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
