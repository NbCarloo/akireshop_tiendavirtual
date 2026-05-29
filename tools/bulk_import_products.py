"""
Bulk import products from a CSV file into akireshopcr.
Uploads images to Cloudinary and creates products via the admin API.

Usage:
  python tools/bulk_import_products.py

Required:
  - .tmp/collection.csv
  - .tmp/images/ folder with product images
  - .env with ADMIN_TOKEN, SERVER_URL, CLOUDINARY_* variables
"""
import csv
import json
import os
import requests
import cloudinary
import cloudinary.uploader
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)

SERVER_URL = os.getenv("SERVER_URL", "http://localhost:5000")
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN")
CSV_PATH = Path(".tmp/collection.csv")
IMAGES_DIR = Path(".tmp/images")
ERRORS_LOG = Path(".tmp/import_errors.log")
REPORT_PATH = Path(".tmp/import_report.json")

HEADERS = {"Authorization": f"Bearer {ADMIN_TOKEN}"}


def upload_image(filename):
    path = IMAGES_DIR / filename
    if not path.exists():
        raise FileNotFoundError(f"Image not found: {path}")
    result = cloudinary.uploader.upload(
        str(path),
        folder="akireshopcr/products",
        transformation=[{"width": 1200, "crop": "limit", "quality": "auto"}],
    )
    return result["secure_url"]


def parse_sizes(row):
    sizes = []
    for size in ["xs", "s", "m", "l", "xl", "2xl", "3xl"]:
        col = f"sizes_{size}"
        stock = int(row.get(col) or 0)
        if stock > 0:
            sizes.append({"size": size.upper(), "stock": stock})
    return sizes


def main():
    if not CSV_PATH.exists():
        print(f"ERROR: {CSV_PATH} not found")
        return

    errors = []
    successes = []

    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader, start=2):
            name = row.get("name", "").strip()
            try:
                # Upload images
                image_files = [x.strip() for x in row.get("image_files", "").split("|") if x.strip()]
                image_urls = [upload_image(f) for f in image_files]

                product_data = {
                    "name": name,
                    "description": row["description"].strip(),
                    "price": float(row["price"]),
                    "salePrice": float(row["sale_price"]) if row.get("sale_price") else None,
                    "category": row["category"].strip(),
                    "sizes": parse_sizes(row),
                    "colors": [{
                        "name": row.get("color_name", "Default").strip(),
                        "hex": row.get("color_hex", "#000000").strip(),
                        "images": image_urls,
                    }],
                    "tags": [t.strip() for t in row.get("tags", "").split("|") if t.strip()],
                }

                resp = requests.post(
                    f"{SERVER_URL}/api/products",
                    json={"data": json.dumps(product_data)},
                    headers=HEADERS,
                    timeout=30,
                )
                resp.raise_for_status()
                successes.append({"row": i, "name": name, "id": resp.json()["_id"]})
                print(f"  ✓ Row {i}: {name}")

            except Exception as e:
                msg = f"Row {i} ({name}): {e}"
                errors.append(msg)
                print(f"  ✗ {msg}")

    # Write report
    report = {"success": len(successes), "errors": len(errors), "products": successes}
    REPORT_PATH.write_text(json.dumps(report, indent=2))
    if errors:
        ERRORS_LOG.write_text("\n".join(errors))

    print(f"\nDone: {len(successes)} imported, {len(errors)} errors")
    if errors:
        print(f"See {ERRORS_LOG} for details")


if __name__ == "__main__":
    main()
