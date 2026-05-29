# Workflow: Add New Collection

## Objective
Upload a new seasonal collection of products to akireshopcr using a CSV file and Cloudinary images.

## Required Inputs
- `collection.csv` — product data file (see format below)
- Product images in `./images/` folder (filenames must match the `image_files` column)
- Admin JWT token (from logging in as admin at `/api/auth/login`)

## CSV Format
```
name,description,price,sale_price,category,sizes_xs,sizes_s,sizes_m,sizes_l,sizes_xl,color_name,color_hex,image_files,tags
"Crop Top Linen","Crop top de lino natural",35.00,,Tops,5,10,8,6,3,Blanco,#FFFFFF,"top-linen-white-1.jpg|top-linen-white-2.jpg","new-arrival|featured"
```

## Steps
1. Place `collection.csv` and `images/` folder in `.tmp/`
2. Set `ADMIN_TOKEN` in `.env`:
   ```
   ADMIN_TOKEN=<your_jwt_token>
   ```
3. Run the bulk import tool:
   ```bash
   python tools/bulk_import_products.py
   ```
4. Verify products appear at `/collection` on the site
5. If any products have errors, check `.tmp/import_errors.log`

## Edge Cases
- **Image upload fails**: Cloudinary will reject files > 10MB. Compress images first.
- **Duplicate slug**: If a product name already exists, the script will skip it and log the conflict.
- **Missing required fields**: Script validates name, price, and category before uploading.

## Output
- Products created in MongoDB
- Images uploaded to Cloudinary under `akireshopcr/products/`
- Import report saved to `.tmp/import_report.json`
