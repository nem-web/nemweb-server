import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sendEmailRoute from "./api/send-email.js"; // 👈 correctly import

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mount routes
app.use("/send-email", sendEmailRoute); // 👈 base path

app.get("/", (req, res) => {
  res.send("🚀 NemWeb server is running!");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
