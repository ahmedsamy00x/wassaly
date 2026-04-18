import { Request, Response } from "express";
import { getUserById, updateUser } from "../services/users.service.js";

export const getUserController = async (req: Request, res: Response) => {
  try {
    const { user } = await getUserById(req.user?.userId!);

    if (!user) {
      res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  const { name, email, phone, currentPassword, newPassword } = req.body;

  console.log(name);
  try {
    const { user } = await updateUser(
      req.user?.userId!,
      name,
      email,
      phone,
      currentPassword,
      newPassword,
    );
    res.json(user);
  } catch (error: any) {
    res
      .status(400)
      .json({ error: `Failed to update user`, message: error.message });
  }
};
