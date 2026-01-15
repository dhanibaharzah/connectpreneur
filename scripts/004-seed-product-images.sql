-- Seed data untuk product_images
-- Memasukkan gambar produk untuk setiap bisnis

-- Bandeng Presto ISRAFOOD
INSERT INTO product_images (business_id, image_url, sort_order)
SELECT id, '/images/israfood-product-1.png', 1 FROM businesses WHERE slug = 'bandeng-presto-israfood'
UNION ALL
SELECT id, '/images/israfood-product-2.png', 2 FROM businesses WHERE slug = 'bandeng-presto-israfood'
UNION ALL
SELECT id, '/images/israfood-product-3.png', 3 FROM businesses WHERE slug = 'bandeng-presto-israfood';

-- DC HNI HPAI KARANGNUNGGAL
INSERT INTO product_images (business_id, image_url, sort_order)
SELECT id, '/images/hni-etta-goatmilk.jpg', 1 FROM businesses WHERE slug = 'dc-hni-hpai-karangnunggal';

-- Dapoer Reka
INSERT INTO product_images (business_id, image_url, sort_order)
SELECT id, '/images/img-20250516-100504.jpg', 1 FROM businesses WHERE slug = 'dapoer-reka'
UNION ALL
SELECT id, '/images/img-20250613-121934.jpg', 2 FROM businesses WHERE slug = 'dapoer-reka'
UNION ALL
SELECT id, '/images/img-20250908-174433.jpg', 3 FROM businesses WHERE slug = 'dapoer-reka'
UNION ALL
SELECT id, '/images/img-20250516-101852.jpg', 4 FROM businesses WHERE slug = 'dapoer-reka'
UNION ALL
SELECT id, '/images/img-20251006-055901.jpg', 5 FROM businesses WHERE slug = 'dapoer-reka'
UNION ALL
SELECT id, '/images/img-20250512-054651.jpg', 6 FROM businesses WHERE slug = 'dapoer-reka';

-- Tiara Jaya Farm
INSERT INTO product_images (business_id, image_url, sort_order)
SELECT id, '/images/tiara-jaya-farm-eggs.jpg', 1 FROM businesses WHERE slug = 'tiara-jaya-farm';

-- Saefaza by Kaza Boba Soreang
INSERT INTO product_images (business_id, image_url, sort_order)
SELECT id, '/images/saefaza-menu.jpg', 1 FROM businesses WHERE slug = 'saefaza-by-kaza-boba-soreang'
UNION ALL
SELECT id, '/images/saefaza-products.jpg', 2 FROM businesses WHERE slug = 'saefaza-by-kaza-boba-soreang';

-- K4y Takoyaki
INSERT INTO product_images (business_id, image_url, sort_order)
SELECT id, 'https://drive.google.com/open?id=1X3GZSGwRyqPx-1JPTXeBggEi0oFIgF6w', 1 FROM businesses WHERE slug = 'k4y-takoyaki';

-- Gudeg Plus
INSERT INTO product_images (business_id, image_url, sort_order)
SELECT id, 'https://drive.google.com/open?id=1octa7zulJtxwquLVpbfmgxTCe2Xpiz5D', 1 FROM businesses WHERE slug = 'gudeg-plus';

-- Hijab Bilqis
INSERT INTO product_images (business_id, image_url, sort_order)
SELECT id, 'https://drive.google.com/open?id=18j2vgvHDytStQaMuZdrmszmcT7kcom9s', 1 FROM businesses WHERE slug = 'hijab-bilqis'
UNION ALL
SELECT id, 'https://drive.google.com/open?id=1q28kMrl8cj7N81iyh62TpK11K-UtYBeR', 2 FROM businesses WHERE slug = 'hijab-bilqis'
UNION ALL
SELECT id, 'https://drive.google.com/open?id=1ZMB5LNtaLKWLgnLICOHZmhsxkjPq_M4G', 3 FROM businesses WHERE slug = 'hijab-bilqis';

-- LeKulinair
INSERT INTO product_images (business_id, image_url, sort_order)
SELECT id, 'https://drive.google.com/open?id=1VhmRUlLUHHE1lWT6rFyIKEI1isefL9As', 1 FROM businesses WHERE slug = 'lekulinair';

-- Radenshop Aksessoris
INSERT INTO product_images (business_id, image_url, sort_order)
SELECT id, 'https://drive.google.com/open?id=1OQDahQbsLQ4pgyvQ2Ij_VaSHrtcGqLFt', 1 FROM businesses WHERE slug = 'radenshop-aksessoris'
UNION ALL
SELECT id, 'https://drive.google.com/open?id=16Q5SWmrXEKwPlxD18dMfCNkUNYyY_kGx', 2 FROM businesses WHERE slug = 'radenshop-aksessoris';

-- Laris Manis Coklat
INSERT INTO product_images (business_id, image_url, sort_order)
SELECT id, 'https://drive.google.com/open?id=1jncCSk_T2aAw-ZSD2iryz1KIXw7RYwOL', 1 FROM businesses WHERE slug = 'laris-manis-coklat'
UNION ALL
SELECT id, 'https://drive.google.com/open?id=1QXowgjga4oA6nHIrkI5bRtMMPvbRVY7a', 2 FROM businesses WHERE slug = 'laris-manis-coklat'
UNION ALL
SELECT id, 'https://drive.google.com/open?id=1Zr1avhq6HQd6bka6cilV8PBzXa6khxG2', 3 FROM businesses WHERE slug = 'laris-manis-coklat';

-- Kentang Balado Teh Dian
INSERT INTO product_images (business_id, image_url, sort_order)
SELECT id, 'https://drive.google.com/open?id=1Nkd8_7xRITOi8PLwi-XJib0l5aNfm7uz', 1 FROM businesses WHERE slug = 'kentang-balado-teh-dian'
UNION ALL
SELECT id, 'https://drive.google.com/open?id=1bDmuoWV7D27oNCz59DheK0iEtJj2DsPK', 2 FROM businesses WHERE slug = 'kentang-balado-teh-dian';

-- Premium Melon by GSF
INSERT INTO product_images (business_id, image_url, sort_order)
SELECT id, 'https://drive.google.com/open?id=1OjYQPZQA3-QMs3_NaxSyrKUmndZfur_4', 1 FROM businesses WHERE slug = 'premium-melon-by-gsf'
UNION ALL
SELECT id, 'https://drive.google.com/open?id=1HTT1jis7D5-74i9AH8FwhZ2BKy8fpYHf', 2 FROM businesses WHERE slug = 'premium-melon-by-gsf'
UNION ALL
SELECT id, 'https://drive.google.com/open?id=1fVOGeW01tpgETMU3tqUY5m21wusxDt7r', 3 FROM businesses WHERE slug = 'premium-melon-by-gsf';

-- SAE FOOD
INSERT INTO product_images (business_id, image_url, sort_order)
SELECT id, 'https://drive.google.com/open?id=1MHNnSu2xht5DJ2rwbQp6d06BDpAaYHjf', 1 FROM businesses WHERE slug = 'sae-food';

-- Rumah Produksi Mang Den
INSERT INTO product_images (business_id, image_url, sort_order)
SELECT id, 'https://drive.google.com/open?id=1YfarJCD-95y_QX1H3m6EPERoLkjw2NMc', 1 FROM businesses WHERE slug = 'rumah-produksi-mang-den'
UNION ALL
SELECT id, 'https://drive.google.com/open?id=16TgGXtSVTYwadtNyicYV7md2RqD8gieQ', 2 FROM businesses WHERE slug = 'rumah-produksi-mang-den'
UNION ALL
SELECT id, 'https://drive.google.com/open?id=1CIT_tCE9xeNwCAsWiLmlmdbNp_qX-AGy', 3 FROM businesses WHERE slug = 'rumah-produksi-mang-den';

-- Warung Berkah
INSERT INTO product_images (business_id, image_url, sort_order)
SELECT id, 'https://drive.google.com/open?id=16coC8bzV5eoQKJMEW1KrV2Q_EUBxmCSt', 1 FROM businesses WHERE slug = 'warung-berkah'
UNION ALL
SELECT id, 'https://drive.google.com/open?id=17BpS7WM985lqp9bDe1fifbaBfOVnj3IW', 2 FROM businesses WHERE slug = 'warung-berkah'
UNION ALL
SELECT id, 'https://drive.google.com/open?id=1inXdl9kk7PaThuAkms4eV8SP6be-sYJX', 3 FROM businesses WHERE slug = 'warung-berkah';

-- Endutch Shop
INSERT INTO product_images (business_id, image_url, sort_order)
SELECT id, 'https://drive.google.com/open?id=1txkfhNRzqIvIvMePe_QZEc1cAgTkBjxP', 1 FROM businesses WHERE slug = 'endutch-shop'
UNION ALL
SELECT id, 'https://drive.google.com/open?id=1L9UwJlyHruBCF_aXp9WMGKLaemPQG7hw', 2 FROM businesses WHERE slug = 'endutch-shop';

-- Bawang Goreng Brebes
INSERT INTO product_images (business_id, image_url, sort_order)
SELECT id, 'https://drive.google.com/open?id=1eh7slKZEoUBhKp6_Ww2Vm-mb1IE97D3a', 1 FROM businesses WHERE slug = 'bawang-goreng-brebes'
UNION ALL
SELECT id, 'https://drive.google.com/open?id=1W-diYJevPs3XUmF75ObGJalFws66OjAz', 2 FROM businesses WHERE slug = 'bawang-goreng-brebes'
UNION ALL
SELECT id, 'https://drive.google.com/open?id=1OlnxnS7OUQ9a5kzxX4VHxtM1kMt66p3X', 3 FROM businesses WHERE slug = 'bawang-goreng-brebes';

-- AsKafood
INSERT INTO product_images (business_id, image_url, sort_order)
SELECT id, 'https://drive.google.com/open?id=1PckPQaLJACr7ueJh2hATmYTBmhAqxFPz', 1 FROM businesses WHERE slug = 'askafood';
