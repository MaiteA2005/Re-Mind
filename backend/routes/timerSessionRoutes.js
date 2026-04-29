import express from "express";
import TimerSession from "../models/TimerSession.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const {
      type,
      durationMinutes,
      elapsedSeconds,
      pauseSeconds,
      completed,
      startedAt,
      endedAt,
    } = req.body;

    if (!type || !durationMinutes) {
      return res.status(400).json({
        message: "Type en duur zijn verplicht",
      });
    }

    const timerSession = await TimerSession.create({
      userId: req.user._id,
      type,
      durationMinutes,
      elapsedSeconds,
      pauseSeconds,
      completed,
      startedAt,
      endedAt: endedAt || new Date(),
    });

    res.status(201).json(timerSession);
  } catch (error) {
    res.status(500).json({
      message: "Timersessie kon niet opgeslagen worden",
      error: error.message,
    });
  }
});

router.get("/me", protect, async (req, res) => {
  try {
    const timerSessions = await TimerSession.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(timerSessions);
  } catch (error) {
    res.status(500).json({
      message: "Timersessies konden niet opgehaald worden",
      error: error.message,
    });
  }
});

export default router;