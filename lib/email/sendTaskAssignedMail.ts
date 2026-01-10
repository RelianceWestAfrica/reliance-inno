import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendTaskAssignedMail({
  to,
  taskTitle,
  assignedBy,
}: {
  to: string;
  taskTitle: string;
  assignedBy: string;
}) {
  if (!to) return;

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject: "Nouvelle tâche assignée",
    html: `
      <div style="font-family: Arial, sans-serif; line-height:1.6">
        <h2>Nouvelle tâche assignée</h2>
        <p>Bonjour,</p>
        <p>Une nouvelle tâche vous a été assignée :</p>
        <p><strong>${taskTitle}</strong></p>
        <p>Assignée par : <strong>${assignedBy}</strong></p>
        <br />
        <p>Merci.</p>
      </div>
    `,
  });
}