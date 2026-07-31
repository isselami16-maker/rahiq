/**
 * Email service configuration — placeholders only.
 *
 * Replace the values below with your real SMTP credentials when you are ready
 * to send orders to your inbox. These same values must also be set as Supabase
 * Edge Function secrets (see the deployed `send-order-email` function):
 *
 *   SMTP_HOST, SMTP_PORT, SMTP_EMAIL, SMTP_PASSWORD, RECIPIENT_EMAIL
 *
 * Do NOT commit real credentials to this file. The Edge Function reads them
 * from environment variables at runtime, not from this file.
 */

export const emailConfig = {
  smtpHost: "YOUR_SMTP_HOST",
  smtpPort: "587",
  email: "your-email@example.com",
  password: "your-password",
  recipientEmail: "orders@rahiqparfums.dz",
} as const;

export type EmailConfig = typeof emailConfig;
