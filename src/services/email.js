import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function sendRegistrationInvitationEmail({ to, name, registrationLink }) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY mangler i .env");
  }

  if (!process.env.EMAIL_FROM) {
    throw new Error("EMAIL_FROM mangler i .env");
  }

  const safeName = escapeHtml(name);

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to,
    subject: "Complete your registration",
    html: `
      <p>Hi ${safeName},</p>
      <p>You have been invited to complete your registration.</p>
      <p>
        <a href="${registrationLink}">
          Complete registration
        </a>
      </p>
      <p>This invitation expires automatically.</p>
    `,
  });

  console.log(registrationLink);

  if (error) {
    console.error("Error sending email:", error);
    throw new Error(error.message);
  }

  return data;
}