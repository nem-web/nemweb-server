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
  const { to, productName, formLink } = req.body;

  if (!to || !productName) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #10b981;">🎉 Congratulations!</h2>
      <p>Your requested product <strong>${productName}</strong> has been successfully added to our affiliate store!</p>
      <p>👉 <a href="http://localhost:5173/affiliate" style="color: #3b82f6;">Click here to view and buy</a></p>
      <p><strong>💰 Get 50% commission</strong> — just fill out this form to receive your commission:</p>
      <a href="${formLink}" style="display: inline-block; margin-top: 10px; padding: 10px 20px; background: #6366f1; color: white; border-radius: 6px;">
        Fill Commission Form
      </a>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"NemWeb Team" <${process.env.VITE_SMTP_USER}>`,
      to,
      subject: `🎁 Your requested product "${productName}" is live!`,
      html: htmlContent,
    });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.error("Email send error:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

export default router;
