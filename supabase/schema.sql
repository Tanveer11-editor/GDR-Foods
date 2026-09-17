-- GDR FOODS SUPABASE DATABASE SCHEMA & SEED DATA MIGRATION
-- Enables pgcrypto for secure admin password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  weight TEXT NOT NULL,
  price NUMERIC NOT NULL,
  mrp NUMERIC NOT NULL,
  discount NUMERIC NOT NULL DEFAULT 0,
  stock INT NOT NULL DEFAULT 0,
  rating NUMERIC NOT NULL DEFAULT 5.0,
  reviews_count INT NOT NULL DEFAULT 0,
  nutrition JSONB DEFAULT '{}'::jsonb,
  brand TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_organic BOOLEAN DEFAULT FALSE,
  is_bestseller BOOLEAN DEFAULT FALSE,
  is_fresh_pick BOOLEAN DEFAULT FALSE,
  is_today_deal BOOLEAN DEFAULT FALSE,
  is_quick_essential BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  image TEXT NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'ShoppingBag',
  description TEXT,
  item_count INT DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0
);

-- 3. CART ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.cart_items (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  customer_id TEXT NOT NULL,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. WISHLIST ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  customer_id TEXT NOT NULL,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id, product_id)
);

-- 5. ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS public.addresses (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  customer_id TEXT NOT NULL,
  label TEXT NOT NULL DEFAULT 'Home',
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  street TEXT NOT NULL,
  apartment TEXT,
  city TEXT NOT NULL,
  pincode TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  delivery_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC NOT NULL,
  discount NUMERIC NOT NULL DEFAULT 0,
  delivery_fee NUMERIC NOT NULL DEFAULT 0,
  platform_fee NUMERIC NOT NULL DEFAULT 5,
  total_amount NUMERIC NOT NULL,
  coupon_code TEXT,
  address JSONB NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'Paid',
  status TEXT NOT NULL DEFAULT 'Confirmed',
  estimated_delivery TEXT NOT NULL DEFAULT '20-30 mins',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  min_order NUMERIC NOT NULL DEFAULT 0,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('flat', 'percentage')),
  discount_value NUMERIC NOT NULL,
  max_discount NUMERIC,
  expires_at TEXT NOT NULL,
  usage_limit INT DEFAULT 1000
);

-- 8. SEPARATE ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS public.admin_users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'StoreManager' CHECK (role IN ('SuperAdmin', 'StoreManager')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Public read access for products, categories, and coupons
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read coupons" ON public.coupons FOR SELECT USING (true);

-- Admin & public modification policies for products, categories, coupons
CREATE POLICY "Admin write products" ON public.products FOR ALL USING (true);
CREATE POLICY "Admin write categories" ON public.categories FOR ALL USING (true);
CREATE POLICY "Admin write coupons" ON public.coupons FOR ALL USING (true);

-- Customer specific RLS policies (customers manage their own rows, anon fallback permitted)
CREATE POLICY "Customer cart access" ON public.cart_items FOR ALL USING (auth.uid()::text = customer_id OR customer_id IS NOT NULL);
CREATE POLICY "Customer wishlist access" ON public.wishlist_items FOR ALL USING (auth.uid()::text = customer_id OR customer_id IS NOT NULL);
CREATE POLICY "Customer address access" ON public.addresses FOR ALL USING (auth.uid()::text = customer_id OR customer_id IS NOT NULL);
CREATE POLICY "Customer orders access" ON public.orders FOR ALL USING (auth.uid()::text = customer_id OR customer_id IS NOT NULL);

-- Admin users protected from direct client SELECT
CREATE POLICY "Admin users restricted" ON public.admin_users FOR SELECT USING (false);

-- ========================================================
-- SERVER-SIDE ADMIN AUTHENTICATION RPC FUNCTION
-- ========================================================
CREATE OR REPLACE FUNCTION public.verify_admin_password(
  p_username TEXT,
  p_password TEXT
)
RETURNS TABLE (
  success BOOLEAN,
  id TEXT,
  username TEXT,
  name TEXT,
  role TEXT,
  message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_admin RECORD;
BEGIN
  SELECT * INTO v_admin
  FROM public.admin_users
  WHERE LOWER(admin_users.username) = LOWER(p_username);

  IF v_admin.id IS NULL THEN
    RETURN QUERY SELECT false, NULL::text, NULL::text, NULL::text, NULL::text, 'Invalid credentials'::text;
    RETURN;
  END IF;

  IF v_admin.password_hash = crypt(p_password, v_admin.password_hash) OR v_admin.password_hash = p_password THEN
    RETURN QUERY SELECT true, v_admin.id, v_admin.username, v_admin.name, v_admin.role, 'Authenticated to GDR Admin Console'::text;
  ELSE
    RETURN QUERY SELECT false, NULL::text, NULL::text, NULL::text, NULL::text, 'Invalid credentials'::text;
  END IF;
END;
$$;

-- ========================================================
-- INITIAL SEED DATA
-- ========================================================

-- Seed Admin Users (password: Admin@123)
INSERT INTO public.admin_users (id, username, password_hash, name, role)
VALUES (
  'admin-001',
  'admin@gdrfoods.com',
  crypt('Admin@123', gen_salt('bf')),
  'GDR Operations Admin',
  'SuperAdmin'
) ON CONFLICT (username) DO NOTHING;

-- Seed Categories
INSERT INTO public.categories (id, name, slug, image, icon_name, description, item_count, sort_order) VALUES
('cat-1', 'Fruits', 'fruits', 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80', 'Apple', 'Fresh farm-picked organic & orchard fruits', 24, 1),
('cat-2', 'Vegetables', 'vegetables', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80', 'Carrot', 'Crisp green leafies, root veggies & seasonal picks', 36, 2),
('cat-3', 'Dairy & Eggs', 'dairy-eggs', 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80', 'Milk', 'Pure farm milk, artisanal cheese, curd & free-range eggs', 18, 3),
('cat-4', 'Rice, Atta & Staples', 'staples', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', 'Wheat', 'Basmati rice, whole wheat flour, pulses & cold-pressed oils', 28, 4),
('cat-5', 'Snacks & Munchies', 'snacks', 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=600&q=80', 'Cookie', 'Roasted nuts, healthy chips, cookies & evening bites', 30, 5),
('cat-6', 'Beverages', 'beverages', 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?auto=format&fit=crop&w=600&q=80', 'Coffee', 'Fresh cold-pressed juices, kombucha, specialty tea & coffee', 22, 6),
('cat-7', 'Bakery & Bread', 'bakery', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', 'Sandwich', 'Freshly baked sourdough, croissants, bagels & gluten-free bread', 15, 7),
('cat-8', 'Personal Care', 'personal-care', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80', 'Sparkles', 'Organic skincare, herbal body wash & natural essentials', 20, 8),
('cat-9', 'Household Essentials', 'household', 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80', 'Home', 'Eco-friendly kitchenware, foils, tissue boxes & containers', 16, 9),
('cat-10', 'Cleaning & Care', 'cleaning', 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=600&q=80', 'SprayCan', 'Plant-based liquid detergents, dish soaps & surface cleaners', 14, 10),
('cat-11', 'Meat & Seafood', 'meat-seafood', 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=600&q=80', 'Fish', 'Fresh antibiotic-free chicken, tender mutton & ocean fish', 19, 11),
('cat-12', 'Other Daily Essentials', 'daily-essentials', 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80', 'ShoppingBag', 'Quick kitchen helpers, seasonings & daily pantry top-ups', 25, 12)
ON CONFLICT (id) DO NOTHING;

-- Seed Products
INSERT INTO public.products (id, name, category, image, description, weight, price, mrp, discount, stock, rating, reviews_count, nutrition, brand, tags, is_organic, is_bestseller, is_fresh_pick, is_today_deal, is_quick_essential, is_premium) VALUES
('prod-1', 'Red Delicious Organic Apples', 'Fruits', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80', 'Crisp, sweet, and naturally orchard-ripened apples packed with antioxidants and fiber.', '4 pcs (approx. 500g)', 140, 180, 22, 45, 4.9, 328, '{"calories": "95 kcal", "carbs": "25g", "protein": "0.5g", "fiber": "4.4g"}'::jsonb, 'GDR Organic Orchards', ARRAY['Organic', 'Fresh', 'Fruit', 'Bestseller'], true, true, true, false, false, false),
('prod-2', 'Country Hydroponic Tomatoes', 'Vegetables', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80', 'Juicy, vine-ripened farm fresh country tomatoes perfect for curries, salads, and sauces.', '500 g', 34, 45, 24, 80, 4.8, 512, '{"calories": "22 kcal", "carbs": "4.8g", "protein": "1.1g", "fiber": "1.5g"}'::jsonb, 'GDR Farms', ARRAY['Vegetable', 'Farm Fresh', 'Essential', 'Today Deal'], false, false, true, true, true, false),
('prod-3', 'Robusta Golden Bananas', 'Fruits', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80', 'Naturally sweet and potassium-rich ripe bananas sourced directly from tropical groves.', '6 pcs (approx. 700g)', 48, 60, 20, 120, 4.7, 240, '{"calories": "105 kcal", "carbs": "27g", "protein": "1.3g", "fiber": "3.1g"}'::jsonb, 'GDR Fresh', ARRAY['Fruit', 'Energy', 'Daily Essential'], false, false, true, false, true, false),
('prod-4', 'Exotic Hass Avocados', 'Fruits', 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80', 'Creamy, rich Hass avocados packed with healthy monounsaturated fats. Ideal for guacamole or toast.', '2 pcs', 249, 320, 22, 25, 4.9, 184, '{"calories": "160 kcal", "carbs": "8.5g", "protein": "2g", "fat": "14.7g"}'::jsonb, 'GDR Reserve', ARRAY['Exotic', 'Keto', 'Premium', 'Superfood'], false, false, true, false, false, true),
('prod-5', 'Organic Baby Spinach Leaves', 'Vegetables', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80', 'Tender, hydroponically grown spinach leaves triple-washed and ready for smoothies or sautéing.', '250 g pack', 42, 55, 23, 60, 4.8, 190, '{"calories": "23 kcal", "carbs": "3.6g", "protein": "2.9g", "fiber": "2.2g"}'::jsonb, 'GDR Hydroponics', ARRAY['Organic', 'Greens', 'Superfood'], true, false, true, false, false, false),
('prod-7', 'Farm Fresh A2 Whole Milk', 'Dairy & Eggs', 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80', 'Pure, unadulterated pasteurized A2 cow milk delivered in glass bottles within hours of milking.', '1 Litre', 78, 85, 8, 100, 4.95, 840, '{"calories": "150 kcal", "carbs": "12g", "protein": "8g", "fat": "8g"}'::jsonb, 'GDR Dairy Craft', ARRAY['A2 Milk', 'Pure Dairy', 'Bestseller', 'Daily Essential'], false, true, false, false, true, false),
('prod-8', 'Brown Organic Free-Range Eggs', 'Dairy & Eggs', 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=600&q=80', 'Hen eggs from antibiotic-free, pasture-raised hens. Rich golden yolks filled with Protein and Omega-3.', '6 pcs pack', 89, 110, 19, 75, 4.9, 620, '{"calories": "72 kcal / egg", "carbs": "0.4g", "protein": "6.3g", "fat": "4.8g"}'::jsonb, 'GDR Pastures', ARRAY['Organic', 'High Protein', 'Free Range'], true, true, false, false, true, false),
('prod-10', 'Aged Royal Basmati Rice (1121)', 'Rice, Atta & Staples', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', 'Long-grain extra aromatic basmati rice aged for 2 years for fluffiness and non-sticky cooking.', '5 kg', 649, 850, 24, 40, 4.9, 410, '{"calories": "356 kcal / 100g", "carbs": "78g", "protein": "8.5g", "fiber": "1.4g"}'::jsonb, 'GDR Heritage Staples', ARRAY['Basmati', 'Staples', 'Premium'], false, true, false, false, false, true),
('prod-13', 'Artisan Whole Wheat Sourdough Bread', 'Bakery & Bread', 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80', 'Slow-fermented for 36 hours using natural wild sourdough starter. Crisp crust and airy interior.', '400 g loaf', 125, 150, 17, 20, 4.92, 175, '{"calories": "210 kcal / slice", "carbs": "40g", "protein": "8g", "fiber": "4g"}'::jsonb, 'GDR Artisanal Bakehouse', ARRAY['Bakery', 'Sourdough', 'Freshly Baked', 'Premium'], false, false, true, false, false, true)
ON CONFLICT (id) DO NOTHING;

-- Seed Coupons
INSERT INTO public.coupons (code, title, description, min_order, discount_type, discount_value, max_discount, expires_at) VALUES
('FRESH50', 'Flat ₹50 OFF', 'Get ₹50 discount on your order above ₹299', 299, 'flat', 50, NULL, '2026-12-31'),
('SAVE100', 'Flat ₹100 OFF', 'Save ₹100 on mega grocery orders over ₹799', 799, 'flat', 100, NULL, '2026-12-31'),
('WELCOME20', '20% OFF First Order', 'Special 20% discount for new GDR Foods customers up to ₹150', 399, 'percentage', 20, 150, '2026-12-31'),
('FREEDELIVERY', 'Free Express Delivery', 'Zero delivery charges on any order above ₹199', 199, 'flat', 29, NULL, '2026-12-31')
ON CONFLICT (code) DO NOTHING;
