import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Naam, email en wachtwoord zijn verplicht",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Er bestaat al een account met dit e-mailadres",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      token: createToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        onboardingCompleted: user.onboardingCompleted,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Account kon niet aangemaakt worden",
      error: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email en wachtwoord zijn verplicht",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Ongeldige login gegevens",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Ongeldige login gegevens",
      });
    }

    res.status(200).json({
      token: createToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        onboardingCompleted: user.onboardingCompleted,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Inloggen mislukt",
      error: error.message,
    });
  }
});

router.get("/me", protect, async (req, res) => {
  res.status(200).json(req.user);
});

router.patch("/onboarding", protect, async (req, res) => {
  try {
    const {
      workSituation,
      workload,
      goals,
      notificationsEnabled,
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        workSituation,
        workload,
        goals,
        notificationsEnabled,
        onboardingCompleted: true,
      },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({
      message: "Onboarding kon niet opgeslagen worden",
      error: error.message,
    });
  }
});

export default router;