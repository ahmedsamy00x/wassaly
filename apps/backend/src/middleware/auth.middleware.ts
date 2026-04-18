import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../types/user.js";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeaders = req.headers["authorization"];
  const token = authHeaders && authHeaders.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET!);
    req.user = verified as User;
    next();
  } catch (error) {
    res.status(403).json({ message: "Forbidden" });
  }
};
