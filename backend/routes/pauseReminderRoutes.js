import express from "express";
import PauseReminder from "../models/PauseReminder.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { action, reminderInterval, workdayElapsedSeconds } = req.body;

    if (!action || !reminderInterval) {
      return res.status(400).json({
        message: "Actie en herinneringsinterval zijn verplicht",
      });
    }

    const reminder = await PauseReminder.create({
      userId: req.user._id,
      action,
      reminderInterval,
      workdayElapsedSeconds,
    });

    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({
      message: "Pauzeherinnering kon niet opgeslagen worden",
      error: error.message,
    });
  }
});

router.patch("/:id", protect, async (req, res) => {
  try {
    const { action } = req.body;

    if (!action) {
      return res.status(400).json({
        message: "Actie is verplicht",
      });
    }

    const reminder = await PauseReminder.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id,
      },
      { action },
      { new: true }
    );

    if (!reminder) {
      return res.status(404).json({
        message: "Pauzeherinnering niet gevonden",
      });
    }

    res.status(200).json(reminder);
  } catch (error) {
    res.status(500).json({
      message: "Pauzeherinnering kon niet aangepast worden",
      error: error.message,
    });
  }
});

router.get("/me", protect, async (req, res) => {
  try {
    const reminders = await PauseReminder.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(reminders);
  } catch (error) {
    res.status(500).json({
      message: "Pauzeherinneringen konden niet opgehaald worden",
      error: error.message,
    });
  }
});

export default router;