import express from "express";
import DayClosing from "../models/DayClosing.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const {
      dayFeeling,
      highlight,
      challenge,
      energyAfterWork,
      gratitude,
      tomorrowFocus,
    } = req.body;

    if (!dayFeeling || !energyAfterWork) {
      return res.status(400).json({
        message: "Gevoel van de dag en energie na werk zijn verplicht",
      });
    }

    const dayClosing = await DayClosing.create({
      userId: req.user._id,
      dayFeeling,
      highlight,
      challenge,
      energyAfterWork,
      gratitude,
      tomorrowFocus,
    });

    res.status(201).json(dayClosing);
  } catch (error) {
    res.status(500).json({
      message: "Dagafsluiting kon niet opgeslagen worden",
      error: error.message,
    });
  }
});

router.get("/me", protect, async (req, res) => {
  try {
    const dayClosings = await DayClosing.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(dayClosings);
  } catch (error) {
    res.status(500).json({
      message: "Dagafsluitingen konden niet opgehaald worden",
      error: error.message,
    });
  }
});

router.get("/tomorrow-focus", protect, async (req, res) => {
  try {
    const now = new Date();

    const startOfYesterday = new Date(now);
    startOfYesterday.setDate(now.getDate() - 1);
    startOfYesterday.setHours(0, 0, 0, 0);

    const endOfYesterday = new Date(now);
    endOfYesterday.setDate(now.getDate() - 1);
    endOfYesterday.setHours(23, 59, 59, 999);

    const focus = await DayClosing.findOne({
      userId: req.user._id,
      tomorrowFocus: { $ne: "" },
      focusCompleted: false,
      createdAt: {
        $gte: startOfYesterday,
        $lte: endOfYesterday,
      },
    }).sort({ createdAt: -1 });

    res.status(200).json(focus);
  } catch (error) {
    res.status(500).json({
      message: "Focus voor vandaag kon niet opgehaald worden",
      error: error.message,
    });
  }
});

router.patch("/:id/focus-complete", protect, async (req, res) => {
  try {
    const focus = await DayClosing.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id,
      },
      {
        focusCompleted: true,
      },
      { new: true }
    );

    res.status(200).json(focus);
  } catch (error) {
    res.status(500).json({
      message: "Focus kon niet voltooid worden",
      error: error.message,
    });
  }
});

export default router;