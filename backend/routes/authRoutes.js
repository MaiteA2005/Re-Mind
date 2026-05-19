import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import protect from "../middleware/authMiddleware.js";

import CheckIn from "../models/CheckIn.js";
import PauseSession from "../models/PauseSession.js";

const router = express.Router();

// Functie om JWT token te creëren
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Endpoint voor gebruikersregistratie
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

// Endpoint voor gebruikerslogin
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

// Endpoint om huidige gebruikersgegevens op te halen
router.get("/me", protect, async (req, res) => {
  res.status(200).json(req.user);
});

// Endpoint voor het updaten van onboarding gegevens
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

// Endpoint voor het updaten van abonnement en facturering
router.patch("/subscription", protect, async (req, res) => {
  try {
    const { subscriptionPlan, billingCycle } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        subscriptionPlan,
        billingCycle,
      },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({
      message: "Abonnement kon niet aangepast worden",
      error: error.message,
    });
  }
});

// Endpoint voor het updaten van gebruikersinstellingen
router.patch("/settings", protect, async (req, res) => {
  try {
    const {
      name,
      email,
      workSituation,
      notificationsEnabled,
      checkInReminders,
      pauseSuggestionsEnabled,
      notificationFrequency,
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        email,
        workSituation,
        notificationsEnabled,
        checkInReminders,
        pauseSuggestionsEnabled,
        notificationFrequency,
      },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({
      message: "Instellingen konden niet opgeslagen worden",
      error: error.message,
    });
  }
});

// Endpoint voor het updaten van het wachtwoord
router.patch("/password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Huidig wachtwoord en nieuw wachtwoord zijn verplicht",
      });
    }

    const user = await User.findById(req.user._id);

    const passwordMatches = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatches) {
      return res.status(400).json({
        message: "Huidig wachtwoord is niet correct",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({
      message: "Wachtwoord succesvol aangepast",
    });
  } catch (error) {
    res.status(500).json({
      message: "Wachtwoord kon niet aangepast worden",
      error: error.message,
    });
  }
});

// Endpoint voor het exporteren van persoonlijke data
router.get("/export", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    const checkIns = await CheckIn.find({ userId: req.user._id });
    const pauseSessions = await PauseSession.find({ userId: req.user._id });

    res.status(200).json({
      user,
      checkIns,
      pauseSessions,
      exportedAt: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      message: "Data exporteren mislukt",
      error: error.message,
    });
  }
});

// Endpoint voor het verwijderen van persoonlijke data
router.delete("/data", protect, async (req, res) => {
  try {
    await CheckIn.deleteMany({ userId: req.user._id });
    await PauseSession.deleteMany({ userId: req.user._id });

    res.status(200).json({
      message: "Persoonlijke data verwijderd",
    });
  } catch (error) {
    res.status(500).json({
      message: "Data verwijderen mislukt",
      error: error.message,
    });
  }
});

// Endpoint voor het verwijderen van het account en alle data
router.delete("/account", protect, async (req, res) => {
  try {
    await CheckIn.deleteMany({ userId: req.user._id });
    await PauseSession.deleteMany({ userId: req.user._id });
    await User.findByIdAndDelete(req.user._id);

    res.status(200).json({
      message: "Account verwijderd",
    });
  } catch (error) {
    res.status(500).json({
      message: "Account verwijderen mislukt",
      error: error.message,
    });
  }
});

export default router;