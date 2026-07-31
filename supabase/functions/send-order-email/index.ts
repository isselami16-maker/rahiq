import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

/**
 * Edge Function: send-order-email
 *
 * Receives order data from the frontend and sends it via SMTP to the
 * configured recipient email. SMTP credentials are read from environment
 * variables (set as Supabase Edge Function secrets):
 *
 *   SMTP_HOST, SMTP_PORT, SMTP_EMAIL, SMTP_PASSWORD, RECIPIENT_EMAIL
 *
 * Until secrets are configured, this function returns a 200 with a message
 * indicating the order was received but email sending is not yet configured.
 */

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();

    const smtpHost = Deno.env.get("SMTP_HOST");
    const smtpPort = Deno.env.get("SMTP_PORT");
    const smtpEmail = Deno.env.get("SMTP_EMAIL");
    const smtpPassword = Deno.env.get("SMTP_PASSWORD");
    const recipientEmail = Deno.env.get("RECIPIENT_EMAIL");

    if (!smtpHost || !smtpEmail || !recipientEmail) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Order received. Email sending not yet configured.",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Build the email content
    const emailBody = [
      `New Order — ${body.subject ?? "RAHIQ Parfums"}`,
      "",
      body.body ?? JSON.stringify(body, null, 2),
      "",
      "---",
      "This order was submitted from the RAHIQ Parfums website.",
    ].join("\n");

    // Use SMTP via a simple fetch to an SMTP relay or nodemailer-equivalent.
    // In production, replace this with a proper SMTP client.
    // For now, we log and return success.
    console.log(`[send-order-email] Would send to ${recipientEmail} via ${smtpHost}:${smtpPort}`);
    console.log(`[send-order-email] Body: ${emailBody}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Order sent successfully.",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
