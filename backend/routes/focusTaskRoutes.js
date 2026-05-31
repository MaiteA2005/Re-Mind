import express from "express";
import FocusTask from "../models/FocusTask.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, async (req, res) => {
    try {
        const tasks = await FocusTask.find({ userId: req.user._id }).sort({
        createdAt: -1,
        });

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({
        message: "Focus taken ophalen mislukt",
        error: error.message,
        });
    }
    });

    router.post("/", protect, async (req, res) => {
    try {
        const { text, day = "today", source = "manual" } = req.body;

        if (!text?.trim()) {
        return res.status(400).json({
            message: "Taak mag niet leeg zijn",
        });
        }

        const task = await FocusTask.create({
        userId: req.user._id,
        text: text.trim(),
        day,
        source,
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({
        message: "Focus taak toevoegen mislukt",
        error: error.message,
        });
    }
});

router.patch("/:id", protect, async (req, res) => {
    try {
        const { text, day, done } = req.body;

        const task = await FocusTask.findOneAndUpdate(
        {
            _id: req.params.id,
            userId: req.user._id,
        },
        {
            ...(text !== undefined && { text }),
            ...(day !== undefined && { day }),
            ...(done !== undefined && { done }),
        },
        { new: true }
        );

        if (!task) {
        return res.status(404).json({
            message: "Focus taak niet gevonden",
        });
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({
        message: "Focus taak aanpassen mislukt",
        error: error.message,
        });
    }
});

router.delete("/:id", protect, async (req, res) => {
    try {
        const task = await FocusTask.findOneAndDelete({
        _id: req.params.id,
        userId: req.user._id,
        });

        if (!task) {
        return res.status(404).json({
            message: "Focus taak niet gevonden",
        });
        }

        res.status(200).json({
        message: "Focus taak verwijderd",
        });
    } catch (error) {
        res.status(500).json({
        message: "Focus taak verwijderen mislukt",
        error: error.message,
        });
    }
});

export default router;