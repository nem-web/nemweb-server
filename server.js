import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import sendAffiliateRequest from "./api/sendAffiliateRequest.js";
import sendProductNotification from "./api/sendProductNotification.js";
import sendContactForm from "./api/sendContactForm.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/send-email", sendAffiliateRequest);
app.use("/send-product-notification", sendProductNotification);
app.use("/send-contact", sendContactForm);

app.get("/", (req, res) => {
  res.send("✅ NemWeb Email Server is running.");
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
