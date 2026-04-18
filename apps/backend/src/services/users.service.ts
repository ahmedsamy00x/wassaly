import { Prisma, prisma } from "@wassaly/database";
import bcrypt from "bcryptjs";

export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
  return { user };
};

export const updateUser = async (
  userId: string,
  name?: string,
  email?: string,
  phone?: string,
  currentPassword?: string,
  newPassword?: string,
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const updatedData: Prisma.UserUpdateInput = {};
  if (name !== undefined) updatedData.name = name;
  if (email !== undefined) updatedData.email = email;
  if (phone !== undefined) updatedData.phone = phone;

  if (newPassword) {
    if (!currentPassword) {
      throw new Error("Current password is required to set a new password");
    }
    const isCurrentPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isCurrentPasswordCorrect) {
      throw new Error("Current password is incorrect");
    }
    updatedData.password = await bcrypt.hash(newPassword, 10);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updatedData,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  });

  return { user: updatedUser };
};
