import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { to, productName, formLink } = req.body;

  if (!to || !productName) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.VITE_SMTP_USER,
      pass: process.env.VITE_SMTP_PASS,
    },
  });

  const htmlContent = `
    <div>
      <h2 style="color: #10b981;">🎉 Congratulations!</h2>
      <p>Your requested product <strong>${productName}</strong> is now available!</p>
      <p><a href="http://localhost:5173/affiliate">Click here to view</a></p>
      <p>👉 Fill this form to claim your commission:</p>
      <a href="${formLink}">Fill Commission Form</a>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"NemWeb Team" <${process.env.VITE_SMTP_USER}>`,
      to,
      subject: `🎁 Your requested product "${productName}" is live!`,
      html: htmlContent,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Email failed" });
  }
}
