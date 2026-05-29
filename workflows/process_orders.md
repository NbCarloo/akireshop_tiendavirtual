# Workflow: Process Orders

## Objective
Daily review of new orders, update their status, add tracking numbers, and export to Google Sheets for visibility.

## Required Inputs
- Admin access to `/admin/orders` on the site
- Shipping carrier tracking numbers (from your logistics provider)
- Google Sheets credentials (`credentials.json`, `token.json`)

## Daily Steps

### 1. Review new orders (status = "paid")
- Go to `/admin/orders` and filter by status "paid"
- For each order, check items and shipping address
- Change status to "processing" once you begin preparing the shipment

### 2. Update shipped orders
- Once an order is physically shipped, update status to "shipped"
- Add the tracking number in the order detail panel
- The customer will see the tracking number in their profile under "Mis pedidos"

### 3. Mark delivered orders
- After the carrier confirms delivery, update status to "delivered"
- If a customer reports non-delivery after 10 days, open a manual investigation

### 4. Export orders to Google Sheets
Run this tool once per day to keep the owner's spreadsheet updated:
```bash
python tools/export_orders.py
```

## Edge Cases
- **Payment failed but order exists**: These have status "pending". Verify in Stripe dashboard if payment was actually captured. If not, cancel the order.
- **Customer requests cancellation**: Only cancel if status is still "pending" or "paid". Once "processing" has begun, coordinate with the customer.
- **Return/refund**: Issue refund via Stripe dashboard, then update order status to "cancelled" and note the reason in the tracking field.

## Output
- Order statuses updated in MongoDB
- Google Sheets document updated with latest order data
