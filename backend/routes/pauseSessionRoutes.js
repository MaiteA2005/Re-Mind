import express from "express";
import PauseSession from "../models/PauseSession.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { pauseSlug, pauseTitle, duration } = req.body;

    const session = await PauseSession.create({
      userId: req.user._id,
      pauseSlug,
      pauseTitle,
      duration,
      completed: true,
      completedAt: new Date(),
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({
      message: "Pauzesessie kon niet opgeslagen worden",
      error: error.message,
    });
  }
});

router.get("/me", protect, async (req, res) => {
  try {
    const sessions = await PauseSession.find({
      userId: req.user._id,
    }).sort({ completedAt: -1 });

    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({
      message: "Pauzesessies konden niet opgehaald worden",
      error: error.message,
    });
  }
});

export default router;