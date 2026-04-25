import express from "express";
import PauseSuggestion from "../models/PauseSuggestion.js";

const router = express.Router();

// Alle pauzes ophalen
router.get("/", async (req, res) => {
  try {
    const pauseSuggestions = await PauseSuggestion.find().sort({ id: 1 });

    res.status(200).json(pauseSuggestions);
  } catch (error) {
    res.status(500).json({
      message: "Pauzes konden niet opgehaald worden",
      error: error.message,
    });
  }
});

// Eén pauze ophalen via slug
router.get("/:slug", async (req, res) => {
  try {
    const pauseSuggestion = await PauseSuggestion.findOne({
      slug: req.params.slug,
    });

    if (!pauseSuggestion) {
      return res.status(404).json({
        message: "Pauze niet gevonden",
      });
    }

    res.status(200).json(pauseSuggestion);
  } catch (error) {
    res.status(500).json({
      message: "Pauze kon niet opgehaald worden",
      error: error.message,
    });
  }
});

export default router;