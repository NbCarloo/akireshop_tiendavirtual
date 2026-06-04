const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOrderConfirmation = async (to, order) => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #eee">${item.name} — ${item.color}, ${item.size}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.qty}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">$${(item.price * item.qty).toFixed(2)}</td>
    </tr>
  `).join('');

  await transporter.sendMail({
    from: `"akireshopcr" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Order Confirmed — #${order._id}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#1a1a1a">Thank you for your order! 🛍️</h2>
        <p>Hi ${order.shippingAddress.name}, your order has been confirmed.</p>
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr style="background:#f5f5f5">
              <th style="padding:8px;text-align:left">Item</th>
              <th style="padding:8px;text-align:center">Qty</th>
              <th style="padding:8px;text-align:right">Price</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <p style="text-align:right;font-weight:bold;margin-top:12px">Total: $${order.total.toFixed(2)}</p>
        <p style="color:#888;font-size:13px">We'll email you once your order ships. Questions? Reply to this email.</p>
        <p style="color:#888;font-size:13px">— The akireshopcr team</p>
      </div>
    `,
  });
};

module.exports = { sendOrderConfirmation };
