import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const { userEmail, productUrl } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.VITE_SMTP_USER,
      pass: process.env.VITE_SMTP_PASS,
    },
  });

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

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to send email" });
  }
}
