import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmationEmail({
  to,
  customerName,
  token,
  total,
  orderNumber,
}: {
  to: string;
  customerName: string;
  token: string;
  total: number;
  orderNumber: number;
}) {
  const statusUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/order/${token}`;

  try {
    await resend.emails.send({
      from: "L.A New Age <orders@newagetruckparts.com>", 
      to,
      subject: "Your L.A New Age order has been received",
      html: `
        <div style="font-family: sans-serif; color: #22303B; max-width: 480px; margin: 0 auto;">
         <h1 style="color: #1B2A38; font-size: 20px;">Thanks, ${customerName}!</h1>
          <p>Order #${orderNumber} — total <strong>$${total.toFixed(2)}</strong>.</p>
          <p>We'll follow up by email shortly with payment instructions. You can check your order status, or cancel it, anytime using the link below:</p>
          <p style="margin: 24px 0;">
            <a href="${statusUrl}" style="background: #1B2A38; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold;">
              View Your Order
            </a>
          </p>
          <p style="font-size: 13px; color: #6B7680;">Bookmark this link — it's the easiest way to check your order status.</p>
        </div>
      `,
    });
  } catch (err) {
    // Log but don't block order creation if email fails
    console.error("Failed to send order confirmation email:", err);
  }
}
export async function sendAdminNewOrderEmail({
  customerName,
  email,
  total,
  orderId,
}: {
  customerName: string;
  email: string;
  total: number;
  orderId: string;
}) {
  const adminUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/admin/orders/${orderId}`;

  try {
    await resend.emails.send({
     from: "L.A New Age <orders@newagetruckparts.com>",
      to: process.env.ADMIN_NOTIFICATION_EMAIL!,
      subject: `New order from ${customerName} — $${total.toFixed(2)}`,
      html: `
        <div style="font-family: sans-serif; color: #22303B; max-width: 480px; margin: 0 auto;">
          <h1 style="color: #1B2A38; font-size: 20px;">New Order Received</h1>
          <p><strong>${customerName}</strong> (${email}) just placed an order for <strong>$${total.toFixed(2)}</strong>.</p>
          <p style="margin: 24px 0;">
            <a href="${adminUrl}" style="background: #E85D25; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold;">
              View Order in Dashboard
            </a>
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send admin notification email:", err);
  }
}
export async function sendCustomerCancellationEmail({
  to,
  customerName,
}: {
  to: string;
  customerName: string;
}) {
  try {
    await resend.emails.send({
      from: "L.A New Age <orders@newagetruckparts.com>",
      to,
      subject: "Your L.A New Age order has been canceled",
      html: `
        <div style="font-family: sans-serif; color: #22303B; max-width: 480px; margin: 0 auto;">
          <h1 style="color: #1B2A38; font-size: 20px;">Order Canceled</h1>
          <p>Hi ${customerName}, your order has been canceled as requested. No payment is due.</p>
          <p>If this wasn't you, or you'd like to place a new order, feel free to reach out or visit the shop again anytime.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send customer cancellation email:", err);
  }
}

export async function sendAdminCancellationEmail({
  customerName,
  email,
  orderId,
}: {
  customerName: string;
  email: string;
  orderId: string;
}) {
  const adminUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/admin/orders/${orderId}`;

  try {
    await resend.emails.send({
      from: "L.A New Age <orders@newagetruckparts.com>",
      to: process.env.ADMIN_NOTIFICATION_EMAIL!,
      subject: `Order canceled — ${customerName}`,
      html: `
        <div style="font-family: sans-serif; color: #22303B; max-width: 480px; margin: 0 auto;">
          <h1 style="color: #1B2A38; font-size: 20px;">Order Canceled</h1>
          <p><strong>${customerName}</strong> (${email})'s order was just canceled. No action needed unless you'd already sent payment instructions.</p>
          <p style="margin: 24px 0;">
            <a href="${adminUrl}" style="background: #E85D25; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold;">
              View Order in Dashboard
            </a>
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send admin cancellation email:", err);
  }
}
export async function sendContactFormEmail({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) {
  try {
    await resend.emails.send({
      from: "L.A New Age <orders@newagetruckparts.com>",
      to: process.env.ADMIN_NOTIFICATION_EMAIL!,
      replyTo: email,
      subject: `Contact form message from ${name}`,
      html: `
        <div style="font-family: sans-serif; color: #22303B; max-width: 480px; margin: 0 auto;">
          <h1 style="color: #1B2A38; font-size: 20px;">New Contact Message</h1>
          <p><strong>${name}</strong> (${email}) sent this message:</p>
          <p style="background: #F4F5F6; padding: 16px; white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send contact form email:", err);
  }
}
export async function sendOrderLookupEmail({
  to,
  orders,
}: {
  to: string;
  orders: { token: string; createdAt: string; total: number }[];
}) {
  const rows = orders
    .map((o) => {
      const url = `${process.env.NEXT_PUBLIC_SITE_URL}/order/${o.token}`;
      const date = new Date(o.createdAt).toLocaleDateString();
      return `<p style="margin: 12px 0;">
        <a href="${url}" style="color: #E85D25; font-weight: bold;">
          Order from ${date} — $${o.total.toFixed(2)}
        </a>
      </p>`;
    })
    .join("");

  try {
    await resend.emails.send({
      from: "L.A New Age <orders@newagetruckparts.com>",
      to,
      subject: "Your L.A New Age order links",
      html: `
        <div style="font-family: sans-serif; color: #22303B; max-width: 480px; margin: 0 auto;">
          <h1 style="color: #1B2A38; font-size: 20px;">Your Orders</h1>
          <p>Here's the link to check the status of your order${orders.length > 1 ? "s" : ""}:</p>
          ${rows}
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send order lookup email:", err);
  }
}