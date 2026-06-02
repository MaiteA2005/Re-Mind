import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

import User from "../models/User.js";
import protect from "../middleware/authMiddleware.js";

import CheckIn from "../models/CheckIn.js";
import PauseSession from "../models/PauseSession.js";

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
      workdayStartTime,
      workdayEndTime,
      lunchStartTime,
      lunchDurationMinutes,
      calendarConnected,
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
        workdayStartTime,
        workdayEndTime,
        lunchStartTime,
        lunchDurationMinutes,
        calendarConnected,
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

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is verplicht" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        message: "Als dit e-mailadres bestaat, sturen we een resetlink.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 30;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/#/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Re:Mind" <${process.env.BREVO_SMTP_USER}>`,
      to: user.email,
      subject: "Wachtwoord opnieuw instellen",
      html: `
        <h2>Wachtwoord opnieuw instellen</h2>
        <p>Klik op de knop hieronder om je wachtwoord opnieuw in te stellen.</p>
        <a href="${resetUrl}">Wachtwoord wijzigen</a>
        <p>Deze link is 30 minuten geldig.</p>
      `,
    });

    res.status(200).json({
      message: "Als dit e-mailadres bestaat, sturen we een resetlink.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Resetlink versturen mislukt",
      error: error.message,
    });
  }
});

router.patch("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Nieuw wachtwoord is verplicht" });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Resetlink is ongeldig of verlopen",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = "";
    user.resetPasswordExpires = null;

    await user.save();

    res.status(200).json({
      message: "Wachtwoord succesvol aangepast",
    });
  } catch (error) {
    res.status(500).json({
      message: "Wachtwoord resetten mislukt",
      error: error.message,
    });
  }
});

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