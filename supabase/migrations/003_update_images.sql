
-- Update products table to use image_id for local images
ALTER TABLE products ADD COLUMN image_id TEXT;

-- Update existing products with local image file names
UPDATE products SET image_id = 'tshirt-cotton-classic.jpg' WHERE id = (SELECT id FROM products WHERE name = 'Classic Cotton T-Shirt' LIMIT 1);
UPDATE products SET image_id = 'jeans-slim-denim.jpg' WHERE id = (SELECT id FROM products WHERE name = 'Slim Fit Denim Jeans' LIMIT 1);
UPDATE products SET image_id = 'shirt-casual-button.jpg' WHERE id = (SELECT id FROM products WHERE name = 'Casual Button Shirt' LIMIT 1);
UPDATE products SET image_id = 'jacket-leather.jpg' WHERE id = (SELECT id FROM products WHERE name = 'Leather Jacket' LIMIT 1);
UPDATE products SET image_id = 'dress-summer-floral.jpg' WHERE id = (SELECT id FROM products WHERE name = 'Summer Floral Dress' LIMIT 1);
UPDATE products SET image_id = 'sneakers-premium.jpg' WHERE id = (SELECT id FROM products WHERE name = 'Premium Sneakers' LIMIT 1);
UPDATE products SET image_id = 'shirt-polo.jpg' WHERE id = (SELECT id FROM products WHERE name = 'Polo Shirt' LIMIT 1);
UPDATE products SET image_id = 'blazer-formal.jpg' WHERE id = (SELECT id FROM products WHERE name = 'Formal Blazer' LIMIT 1);
UPDATE products SET image_id = 'pants-cargo.jpg' WHERE id = (SELECT id FROM products WHERE name = 'Cargo Pants' LIMIT 1);
UPDATE products SET image_id = 'handbag-designer.jpg' WHERE id = (SELECT id FROM products WHERE name = 'Designer Handbag' LIMIT 1);
UPDATE products SET image_id = 'hoodie-casual.jpg' WHERE id = (SELECT id FROM products WHERE name = 'Casual Hoodie' LIMIT 1);
UPDATE products SET image_id = 'shirt-formal-dress.jpg' WHERE id = (SELECT id FROM products WHERE name = 'Formal Dress Shirt' LIMIT 1);
UPDATE products SET image_id = 'sandals-summer.jpg' WHERE id = (SELECT id FROM products WHERE name = 'Summer Sandals' LIMIT 1);
UPDATE products SET image_id = 'dress-evening-elegant.jpg' WHERE id = (SELECT id FROM products WHERE name = 'Elegant Evening Dress' LIMIT 1);
UPDATE products SET image_id = 'watch-designer.jpg' WHERE id = (SELECT id FROM products WHERE name = 'Designer Watch' LIMIT 1);
UPDATE products SET image_id = 'jacket-sports.jpg' WHERE id = (SELECT id FROM products WHERE name = 'Sports Jacket' LIMIT 1);

-- Eventually you can drop the old image column once all images are migrated
-- ALTER TABLE products DROP COLUMN image;
