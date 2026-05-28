import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import pauseSuggestionRoutes from "./routes/pauseSuggestionRoutes.js";
import pauseSessionRoutes from "./routes/pauseSessionRoutes.js";
import checkInRoutes from "./routes/checkInRoutes.js";
import dayClosingRoutes from "./routes/dayClosingRoutes.js";
import timerSessionRoutes from "./routes/timerSessionRoutes.js";
import businessRequestRoutes from "./routes/businessRequestRoutes.js";
import pauseReminderRoutes from "./routes/pauseReminderRoutes.js";
import favoritePauseRoutes from "./routes/favoritePauseRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/pause-suggestions", pauseSuggestionRoutes);
app.use("/api/pause-sessions", pauseSessionRoutes);
app.use("/api/check-ins", checkInRoutes);
app.use("/api/day-closings", dayClosingRoutes);
app.use("/api/timer-sessions", timerSessionRoutes);
app.use("/api/business-requests", businessRequestRoutes);
app.use("/api/pause-reminders", pauseReminderRoutes);
app.use("/api/favorite-pauses", favoritePauseRoutes);
app.get("/", (req, res) => {
  res.send("API werkt");
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server draait op poort ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connectie mislukt:", error.message);
  });