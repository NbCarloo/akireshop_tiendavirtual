"""
Export akireshopcr orders to a Google Sheet.
Appends new orders since the last export date.

Usage:
  python tools/export_orders.py

Required:
  - credentials.json and token.json (Google OAuth)
  - .env with SERVER_URL, ADMIN_TOKEN, GOOGLE_SHEET_ID
"""
import os
import json
import requests
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

load_dotenv()

SERVER_URL = os.getenv("SERVER_URL", "http://localhost:5000")
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN")
SHEET_ID = os.getenv("GOOGLE_SHEET_ID")
SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
LAST_EXPORT_FILE = Path(".tmp/last_export.txt")

HEADERS = {"Authorization": f"Bearer {ADMIN_TOKEN}"}


def get_sheets_service():
    creds = None
    if Path("token.json").exists():
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file("credentials.json", SCOPES)
            creds = flow.run_local_server(port=0)
        Path("token.json").write_text(creds.to_json())
    return build("sheets", "v4", credentials=creds)


def fetch_orders(page=1):
    all_orders = []
    while True:
        resp = requests.get(
            f"{SERVER_URL}/api/admin/orders",
            params={"page": page, "limit": 100},
            headers=HEADERS,
            timeout=30,
        )
        resp.raise_for_status()
        data = resp.json()
        all_orders.extend(data["orders"])
        if page >= data["pages"]:
            break
        page += 1
    return all_orders


def order_to_row(order):
    items_str = "; ".join(
        f"{i['name']} ({i['color']}, {i['size']}) x{i['qty']}"
        for i in order.get("items", [])
    )
    addr = order.get("shippingAddress", {})
    return [
        order["_id"][-8:].upper(),
        order.get("user", {}).get("name", "") if order.get("user") else order.get("guestEmail", "Invitado"),
        order.get("user", {}).get("email", "") if order.get("user") else order.get("guestEmail", ""),
        order.get("status", ""),
        f"${order.get('total', 0):.2f}",
        items_str,
        f"{addr.get('street', '')}, {addr.get('city', '')}, {addr.get('country', '')}",
        order.get("trackingNumber", ""),
        datetime.fromisoformat(order["createdAt"].replace("Z", "+00:00")).strftime("%Y-%m-%d %H:%M"),
    ]


def main():
    print("Fetching orders...")
    orders = fetch_orders()
    if not orders:
        print("No orders found.")
        return

    print(f"Found {len(orders)} orders. Connecting to Google Sheets...")
    service = get_sheets_service()
    sheet = service.spreadsheets()

    headers = [["Order ID", "Cliente", "Email", "Estado", "Total", "Artículos", "Dirección", "Tracking", "Fecha"]]
    rows = [order_to_row(o) for o in orders]

    sheet.values().update(
        spreadsheetId=SHEET_ID,
        range="Pedidos!A1",
        valueInputOption="RAW",
        body={"values": headers + rows},
    ).execute()

    LAST_EXPORT_FILE.write_text(datetime.now().isoformat())
    print(f"✓ {len(rows)} orders exported to Google Sheets")


if __name__ == "__main__":
    main()
