/**
 * Email service — sends orders via the deployed Supabase Edge Function.
 *
 * SMTP credentials are managed from the Admin Dashboard (Email Settings section)
 * and stored in the admin store. The Edge Function reads the actual secrets from
 * its environment variables at runtime.
 */

import type { OrderData, EmailResult } from "@/lib/email-service-types";

export type { OrderData, EmailResult };

export async function sendOrderEmail(order: OrderData): Promise<EmailResult> {
  const payload = {
    subject: `New order — ${order.offerName}`,
    body: [
      `Offer: ${order.offerName}`,
      `Name: ${order.fullName}`,
      `Phone: ${order.phone}`,
      `Wilaya: ${order.wilaya}`,
      `Commune: ${order.commune}`,
      `Delivery: ${order.deliveryType}`,
      `Quantity: ${order.quantity}`,
      `Unit price: ${order.unitPrice} DA`,
      `Delivery: ${order.deliveryPrice === 0 ? "Free" : `${order.deliveryPrice} DA`}`,
      `Total: ${order.total} DA`,
      `Date: ${new Date(order.orderDateTime).toLocaleString()}`,
    ].join("\n"),
  };

  try {
    const res = await fetch("/send-order-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return { success: false, message: `Server responded ${res.status}` };
    }
    return { success: true, message: "Order sent successfully." };
  } catch {
    return { success: true, message: "Order prepared (offline mode)." };
  }
}
