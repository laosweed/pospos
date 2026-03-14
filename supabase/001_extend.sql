-- ─────────────────────────────────────────────
--  001_extend.sql  –  Add columns, write policies, seed data
-- ─────────────────────────────────────────────

-- ── Extend tables ─────────────────────────────
ALTER TABLE products  ADD COLUMN IF NOT EXISTS emoji  text NOT NULL DEFAULT '🛍️';
ALTER TABLE employees ADD COLUMN IF NOT EXISTS phone  text;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS active boolean NOT NULL DEFAULT true;

-- ── RLS on categories (was missing) ───────────
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read"   ON categories FOR SELECT USING (true);

-- ── Write policies (demo mode – allow all) ─────
CREATE POLICY "public insert" ON stores    FOR INSERT WITH CHECK (true);
CREATE POLICY "public update" ON stores    FOR UPDATE USING (true);

CREATE POLICY "public insert" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "public update" ON categories FOR UPDATE USING (true);
CREATE POLICY "public delete" ON categories FOR DELETE USING (true);

CREATE POLICY "public insert" ON products  FOR INSERT WITH CHECK (true);
CREATE POLICY "public update" ON products  FOR UPDATE USING (true);
CREATE POLICY "public delete" ON products  FOR DELETE USING (true);

CREATE POLICY "public insert" ON employees FOR INSERT WITH CHECK (true);
CREATE POLICY "public update" ON employees FOR UPDATE USING (true);
CREATE POLICY "public delete" ON employees FOR DELETE USING (true);

CREATE POLICY "public insert" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "public update" ON customers FOR UPDATE USING (true);
CREATE POLICY "public delete" ON customers FOR DELETE USING (true);

CREATE POLICY "public insert" ON sales     FOR INSERT WITH CHECK (true);
CREATE POLICY "public update" ON sales     FOR UPDATE USING (true);

CREATE POLICY "public insert" ON sale_items FOR INSERT WITH CHECK (true);

CREATE POLICY "public insert" ON purchases  FOR INSERT WITH CHECK (true);
CREATE POLICY "public update" ON purchases  FOR UPDATE USING (true);

CREATE POLICY "public insert" ON purchase_items FOR INSERT WITH CHECK (true);

-- ── Seed categories ────────────────────────────
INSERT INTO categories (id, store_id, name, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'เบเกอรี่',    1),
  ('c1000000-0000-0000-0000-000000000002', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'เค้ก',        2),
  ('c1000000-0000-0000-0000-000000000003', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'โดนัท',       3),
  ('c1000000-0000-0000-0000-000000000004', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'คุกกี้',      4),
  ('c1000000-0000-0000-0000-000000000005', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'เครื่องดื่ม', 5),
  ('c1000000-0000-0000-0000-000000000006', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'อาหาร',       6)
ON CONFLICT (id) DO NOTHING;

-- ── Seed products ──────────────────────────────
INSERT INTO products (id, store_id, category_id, name, price, cost, stock, sku, emoji, active) VALUES
  ('p0000000-0000-0000-0000-000000000001','a1b2c3d4-e5f6-7890-abcd-ef1234567890','c1000000-0000-0000-0000-000000000001','ครัวซองต์เนย',       45, 20, 20,'CRO-001','🥐',true),
  ('p0000000-0000-0000-0000-000000000002','a1b2c3d4-e5f6-7890-abcd-ef1234567890','c1000000-0000-0000-0000-000000000001','ขนมปังโฮลวีท',       35, 15, 15,'BRD-001','🍞',true),
  ('p0000000-0000-0000-0000-000000000003','a1b2c3d4-e5f6-7890-abcd-ef1234567890','c1000000-0000-0000-0000-000000000001','มัฟฟินบลูเบอร์รี่',  55, 22,  3,'MUF-001','🧁',true),
  ('p0000000-0000-0000-0000-000000000004','a1b2c3d4-e5f6-7890-abcd-ef1234567890','c1000000-0000-0000-0000-000000000002','เค้กช็อกโกแลต',     180, 80,  8,'CAK-001','🎂',true),
  ('p0000000-0000-0000-0000-000000000005','a1b2c3d4-e5f6-7890-abcd-ef1234567890','c1000000-0000-0000-0000-000000000002','ชีสเค้ก',           160, 70,  6,'CAK-002','🍰',true),
  ('p0000000-0000-0000-0000-000000000006','a1b2c3d4-e5f6-7890-abcd-ef1234567890','c1000000-0000-0000-0000-000000000003','โดนัทกลาเซ่',        40, 15, 18,'DON-001','🍩',true),
  ('p0000000-0000-0000-0000-000000000007','a1b2c3d4-e5f6-7890-abcd-ef1234567890','c1000000-0000-0000-0000-000000000004','คุกกี้ช็อกโกแลต',   25, 10, 30,'COO-001','🍪',true),
  ('p0000000-0000-0000-0000-000000000008','a1b2c3d4-e5f6-7890-abcd-ef1234567890','c1000000-0000-0000-0000-000000000005','กาแฟลาเต้',          65, 25, 50,'DRK-001','☕',true),
  ('p0000000-0000-0000-0000-000000000009','a1b2c3d4-e5f6-7890-abcd-ef1234567890','c1000000-0000-0000-0000-000000000005','ชานมไข่มุก',         70, 28, 50,'DRK-002','🧋',true),
  ('p0000000-0000-0000-0000-000000000010','a1b2c3d4-e5f6-7890-abcd-ef1234567890','c1000000-0000-0000-0000-000000000005','น้ำส้มคั้นสด',       55, 20,  0,'DRK-003','🍊',false),
  ('p0000000-0000-0000-0000-000000000011','a1b2c3d4-e5f6-7890-abcd-ef1234567890','c1000000-0000-0000-0000-000000000001','บราวนี่',            45, 18, 15,'BRW-001','🍫',true),
  ('p0000000-0000-0000-0000-000000000012','a1b2c3d4-e5f6-7890-abcd-ef1234567890','c1000000-0000-0000-0000-000000000006','แซนวิชทูน่า',        85, 40, 10,'SND-001','🥪',true),
  ('p0000000-0000-0000-0000-000000000013','a1b2c3d4-e5f6-7890-abcd-ef1234567890','c1000000-0000-0000-0000-000000000006','สลัดผัก',            90, 35,  8,'SLD-001','🥗',true),
  ('p0000000-0000-0000-0000-000000000014','a1b2c3d4-e5f6-7890-abcd-ef1234567890','c1000000-0000-0000-0000-000000000005','สตรอว์เบอร์รี่สมูทตี้',75,30,20,'SMT-001','🍓',true),
  ('p0000000-0000-0000-0000-000000000015','a1b2c3d4-e5f6-7890-abcd-ef1234567890','c1000000-0000-0000-0000-000000000001','พายแอปเปิ้ล',        55, 22, 10,'PIE-001','🥧',true),
  ('p0000000-0000-0000-0000-000000000016','a1b2c3d4-e5f6-7890-abcd-ef1234567890','c1000000-0000-0000-0000-000000000004','โดนัทช็อกโกแลต',    40, 15,  2,'DON-002','🍩',true)
ON CONFLICT (id) DO NOTHING;

-- ── Seed customers ────────────────────────────
INSERT INTO customers (id, store_id, name, phone, email, points) VALUES
  ('cu000000-0000-0000-0000-000000000001','a1b2c3d4-e5f6-7890-abcd-ef1234567890','สมชาย ใจดี',     '081-234-5678','somchai@gmail.com',  450),
  ('cu000000-0000-0000-0000-000000000002','a1b2c3d4-e5f6-7890-abcd-ef1234567890','นารี มีสุข',     '082-345-6789','naree@gmail.com',    280),
  ('cu000000-0000-0000-0000-000000000003','a1b2c3d4-e5f6-7890-abcd-ef1234567890','วิชัย ทองดี',    '083-456-7890',null,                  120),
  ('cu000000-0000-0000-0000-000000000004','a1b2c3d4-e5f6-7890-abcd-ef1234567890','ประภา จันทร์',   '084-567-8901','prapa@hotmail.com',  890),
  ('cu000000-0000-0000-0000-000000000005','a1b2c3d4-e5f6-7890-abcd-ef1234567890','ธีรพงษ์ แสงทอง','085-678-9012','thirapong@gmail.com',65),
  ('cu000000-0000-0000-0000-000000000006','a1b2c3d4-e5f6-7890-abcd-ef1234567890','สุภาพร ดีงาม',  '086-789-0123',null,                  320),
  ('cu000000-0000-0000-0000-000000000007','a1b2c3d4-e5f6-7890-abcd-ef1234567890','อนุชา พรหมดี',  '087-890-1234','anucha@gmail.com',   1200),
  ('cu000000-0000-0000-0000-000000000008','a1b2c3d4-e5f6-7890-abcd-ef1234567890','มาลี รักชาติ',  '088-901-2345','malee@gmail.com',    55)
ON CONFLICT (id) DO NOTHING;

-- ── Update + seed employees ───────────────────
UPDATE employees
SET phone = '081-111-1111', active = true
WHERE store_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

INSERT INTO employees (id, store_id, name, email, role, phone, active) VALUES
  ('e0000000-0000-0000-0000-000000000002','a1b2c3d4-e5f6-7890-abcd-ef1234567890','สมหมาย ดีงาม',  'sommai@bakery.com', 'manager','082-222-2222',true),
  ('e0000000-0000-0000-0000-000000000003','a1b2c3d4-e5f6-7890-abcd-ef1234567890','วันดี รักงาน',  'wandee@bakery.com', 'cashier','083-333-3333',true),
  ('e0000000-0000-0000-0000-000000000004','a1b2c3d4-e5f6-7890-abcd-ef1234567890','สุพรรณ มีผล',   'supan@bakery.com',  'cashier','084-444-4444',true),
  ('e0000000-0000-0000-0000-000000000005','a1b2c3d4-e5f6-7890-abcd-ef1234567890','กมลชนก ทองใส',  'kamol@bakery.com',  'staff',  '085-555-5555',false)
ON CONFLICT (id) DO NOTHING;
