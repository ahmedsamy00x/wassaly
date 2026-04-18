import {
  login,
  refreshAccessToken,
  register,
} from "../services/auth.service.js";
import { Request, Response } from "express";

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const user = await register(name, email, password);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const { user, accessToken, refreshToken } = await login(email, password);
    res.json({ user, accessToken, refreshToken });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ error: "Refresh token is required" });
      return;
    }
    const newAccessToken = await refreshAccessToken(refreshToken);
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(400).json({ error: "Invalid refresh token" });
  }
};
