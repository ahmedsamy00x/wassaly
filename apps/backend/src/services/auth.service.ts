import "dotenv/config";
import { prisma } from "@wassaly/database";
import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../types/user.js";

export const register = async (
  name: string,
  email: string,
  password: string,
) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: email },
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return createdUser;
};

export const login = async (email: string, password: string) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!existingUser) {
    throw new Error("Invalid email or password.");
  }

  const hashedPassword = existingUser.password;

  const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);

  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password.");
  }

  const userToReturn = {
    id: existingUser.id,
    name: existingUser.name,
    email: existingUser.email,
  };

  console.log("xxxxx");

  const accessToken = jwt.sign(
    { userId: existingUser.id },
    process.env.JWT_ACCESS_TOKEN_SECRET!,
    { expiresIn: "15m" },
  );

  const refreshToken = jwt.sign(
    { userId: existingUser.id },
    process.env.JWT_REFRESH_TOKEN_SECRET!,
    { expiresIn: "7d" },
  );

  return {
    user: userToReturn,
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = (refreshToken: string) => {
  const decoded = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_TOKEN_SECRET!,
  );
  const userId = (decoded as User).userId;
  const newAccessToken = jwt.sign(
    { userId },
    process.env.JWT_ACCESS_TOKEN_SECRET!,
    { expiresIn: "15m" },
  );
  return newAccessToken;
};
