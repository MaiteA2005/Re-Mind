import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import pauseSuggestionRoutes from "./routes/pauseSuggestionRoutes.js";
import pauseSessionRoutes from "./routes/pauseSessionRoutes.js";
import checkInRoutes from "./routes/checkInRoutes.js";
import dayClosingRoutes from "./routes/dayClosingRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/pause-suggestions", pauseSuggestionRoutes);
app.use("/api/pause-sessions", pauseSessionRoutes);
app.use("/api/check-ins", checkInRoutes);
app.use("/api/day-closings", dayClosingRoutes);

app.get("/", (req, res) => {
  res.send("API werkt");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server draait op poort ${PORT}`);
});