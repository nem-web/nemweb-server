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
  const { user_email, user_name, subject, message } = req.body;

  if (!user_email || !user_name || !subject || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const htmlMessage = `
    <div style="font-family: Arial; color: #333;">
      <h2 style="color: #8b5cf6;">📩 New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${user_name}</p>
      <p><strong>Email:</strong> ${user_email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p style="margin-left: 20px;">${message.replace(/\n/g, "<br>")}</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"${user_name}" <${process.env.VITE_SMTP_USER}>`,
      to: process.env.VITE_SMTP_ADMIN,
      subject: `New Contact Message: ${subject}`,
      html: htmlMessage,
    });

    res.status(200).json({ message: "Contact email sent successfully" });
  } catch (err) {
    console.error("Contact email error:", err);
    res.status(500).json({ error: "Failed to send contact email" });
  }
});

export default router;
