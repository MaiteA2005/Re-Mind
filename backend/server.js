import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import pauseSuggestionRoutes from "./routes/pauseSuggestionRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/pause-suggestions", pauseSuggestionRoutes);

app.get("/", (req, res) => {
  res.send("API werkt");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server draait op poort ${PORT}`);
});