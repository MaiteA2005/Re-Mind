const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Hallo van de backend" });
});

app.listen(PORT, () => {
  console.log(`Server draait op https://re-mind-dnch.onrender.com:${PORT}`);
});