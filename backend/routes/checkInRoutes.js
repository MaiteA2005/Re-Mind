import express from "express";
import CheckIn from "../models/CheckIn.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { stressLevel, energyLevel, note } = req.body;

    if (!stressLevel || !energyLevel) {
      return res.status(400).json({
        message: "Stressniveau en energieniveau zijn verplicht",
      });
    }

    const checkIn = await CheckIn.create({
      userId: req.user._id,
      stressLevel,
      energyLevel,
      note,
    });

    res.status(201).json(checkIn);
  } catch (error) {
    res.status(500).json({
      message: "Check-in kon niet opgeslagen worden",
      error: error.message,
    });
  }
});

router.get("/me", protect, async (req, res) => {
  try {
    const checkIns = await CheckIn.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(checkIns);
  } catch (error) {
    res.status(500).json({
      message: "Check-ins konden niet opgehaald worden",
      error: error.message,
    });
  }
});

export default router;