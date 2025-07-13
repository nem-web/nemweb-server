import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ Define transporter once globally
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.VITE_SMTP_USER,
    pass: process.env.VITE_SMTP_PASS,
  },
});

// First email route (used for manual affiliate requests)
app.post("/send-email", async (req, res) => {
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

// ✅ Product Notification Email Route (called from frontend on successful product add)
app.post("/send-product-notification", async (req, res) => {
  const { to, productName, formLink } = req.body;

  if (!to || !productName) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #10b981;">🎉 Congratulations!</h2>
      <p>Your requested product <strong>${productName}</strong> has been successfully added to our affiliate store!</p>
      <p>👉 <a href="http://localhost:5173/affiliate" style="color: #3b82f6; text-decoration: none;">Click here to view and buy</a></p>
      <p><strong>💰 Get 50% commission</strong> — just fill out this form to receive your commission:</p>
      <a href="${formLink}" style="display: inline-block; margin-top: 10px; padding: 10px 20px; background: #6366f1; color: white; text-decoration: none; border-radius: 6px;">
        Fill Commission Form
      </a>
      <p style="margin-top: 20px;">Thanks for using <strong>NemWeb</strong> 🚀</p>
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


// Contact form email (Gmail SMTP)
app.post("/send-contact", async (req, res) => {
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


app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
