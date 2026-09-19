import express from "express";
import { signup, login } from "../controllers/authController.js";
import { validateAuth } from "../middleware/validation.js";

const router = express.Router();

router.post("/signup", validateAuth, signup);
router.post("/login", validateAuth, login);

export default router;
