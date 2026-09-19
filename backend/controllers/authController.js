import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const signup = async (req, res) => {
  try {
    const name = req.body.name.trim();
    const email = req.body.email.trim().toLowerCase();
    const { password } = req.body;

    const user = await User.findOne({ email });
    if (user) return res.status(409).json({ message: "An account with this email already exists." });

    const createdUser = await User.create({ name, email, password });

    res.status(201).json({
      user: {
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Unable to create account right now." });
  }
};

export const login = async (req, res) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const { password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch {
    res.status(500).json({ message: "Unable to login right now." });
  }
};
