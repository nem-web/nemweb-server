import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.VITE_SMTP_USER,
    pass: process.env.VITE_SMTP_PASS,
  },
});

router.post("/", async (req, res) => {
  const { userEmail, productUrl } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.VITE_SMTP_USER,
      to: process.env.VITE_SMTP_ADMIN,
      subject: "📦 New Affiliate Link Request",
      html: `
        <h2>Affiliate Request</h2>
        <p><strong>User Email:</strong> ${userEmail}</p>
        <p><strong>Product URL:</strong> <a href="${productUrl}" target="_blank">${productUrl}</a></p>
      `,
    });

    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ success: false, message: "Email failed" });
  }
});

export default router;
