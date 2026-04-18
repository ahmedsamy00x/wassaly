import express from "express";
import {
  getUserController,
  updateUserController,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/me", getUserController);
router.patch("/me", updateUserController);

export default router;
