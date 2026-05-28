import express from "express";
import User from "../models/User.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("favoritePauses");
        res.status(200).json(user.favoritePauses || []);
    } catch (error) {
        res.status(500).json({
        message: "Favorieten ophalen mislukt",
        error: error.message,
        });
    }
});

router.post("/:pauseId", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        const alreadyFavorite = user.favoritePauses.some(
        (pauseId) => pauseId.toString() === req.params.pauseId
        );

        if (!alreadyFavorite) {
        user.favoritePauses.push(req.params.pauseId);
        }

        await user.save();

        res.status(200).json(user.favoritePauses);
    } catch (error) {
        res.status(500).json({
        message: "Favoriet toevoegen mislukt",
        error: error.message,
        });
    }
});

router.delete("/:pauseId", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        user.favoritePauses = user.favoritePauses.filter(
        (pauseId) => pauseId.toString() !== req.params.pauseId
        );

        await user.save();

        res.status(200).json(user.favoritePauses);
    } catch (error) {
        res.status(500).json({
        message: "Favoriet verwijderen mislukt",
        error: error.message,
        });
    }
});

export default router;