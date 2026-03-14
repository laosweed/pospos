-- ─────────────────────────────────────────────
--  POSPOS Clone – Supabase Schema
-- ─────────────────────────────────────────────

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Stores ───────────────────────────────────
create table stores (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  image_url   text,
  pos_name    text default 'POS #1',
  vat_enabled boolean default true,
  demo        boolean default false,
  created_at  timestamptz default now()
);

-- ── Employees ────────────────────────────────
create table employees (
  id         uuid primary key default uuid_generate_v4(),
  store_id   uuid references stores(id) on delete cascade,
  name       text not null,
  email      text unique,
  role       text default 'cashier',  -- cashier | manager | admin
  avatar_url text,
  created_at timestamptz default now()
);

-- ── Categories ───────────────────────────────
create table categories (
  id       uuid primary key default uuid_generate_v4(),
  store_id uuid references stores(id) on delete cascade,
  name     text not null,
  sort_order int default 0
);

-- ── Products ─────────────────────────────────
create table products (
  id          uuid primary key default uuid_generate_v4(),
  store_id    uuid references stores(id) on delete cascade,
  category_id uuid references categories(id) on delete set null,
  name        text not null,
  price       numeric(12,2) not null default 0,
  cost        numeric(12,2) default 0,
  stock       int default 0,
  sku         text,
  image_url   text,
  active      boolean default true,
  created_at  timestamptz default now()
);

-- ── Customers ────────────────────────────────
create table customers (
  id         uuid primary key default uuid_generate_v4(),
  store_id   uuid references stores(id) on delete cascade,
  name       text not null,
  phone      text,
  email      text,
  points     int default 0,
  created_at timestamptz default now()
);

-- ── Sales ────────────────────────────────────
create table sales (
  id            uuid primary key default uuid_generate_v4(),
  store_id      uuid references stores(id) on delete cascade,
  employee_id   uuid references employees(id) on delete set null,
  customer_id   uuid references customers(id) on delete set null,
  receipt_no    text,
  total         numeric(12,2) not null default 0,
  discount      numeric(12,2) default 0,
  vat           numeric(12,2) default 0,
  payment_method text default 'cash',  -- cash | card | transfer | qr
  status        text default 'completed',  -- completed | cancelled | pending
  note          text,
  sold_at       timestamptz default now(),
  created_at    timestamptz default now()
);

-- ── Sale Items ───────────────────────────────
create table sale_items (
  id         uuid primary key default uuid_generate_v4(),
  sale_id    uuid references sales(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  name       text not null,  -- snapshot
  price      numeric(12,2) not null,
  cost       numeric(12,2) default 0,
  quantity   int not null default 1,
  subtotal   numeric(12,2) not null
);

-- ── Purchase Orders (รับซื้อ) ────────────────
create table purchases (
  id           uuid primary key default uuid_generate_v4(),
  store_id     uuid references stores(id) on delete cascade,
  employee_id  uuid references employees(id) on delete set null,
  supplier     text,
  total        numeric(12,2) not null default 0,
  status       text default 'completed',
  note         text,
  purchased_at timestamptz default now(),
  created_at   timestamptz default now()
);

create table purchase_items (
  id          uuid primary key default uuid_generate_v4(),
  purchase_id uuid references purchases(id) on delete cascade,
  product_id  uuid references products(id) on delete set null,
  name        text not null,
  cost        numeric(12,2) not null,
  quantity    int not null default 1,
  subtotal    numeric(12,2) not null
);

-- ── Dashboard stats view ─────────────────────
create or replace view daily_sales_summary as
select
  store_id,
  date_trunc('day', sold_at)::date as sale_date,
  count(*) filter (where status = 'completed') as total_bills,
  count(*) filter (where status = 'cancelled') as cancelled_bills,
  coalesce(sum(total) filter (where status = 'completed'), 0) as total_revenue,
  coalesce(avg(total) filter (where status = 'completed'), 0) as avg_per_bill
from sales
group by store_id, date_trunc('day', sold_at)::date;

-- ── Row Level Security ───────────────────────
alter table stores    enable row level security;
alter table employees enable row level security;
alter table products  enable row level security;
alter table customers enable row level security;
alter table sales     enable row level security;
alter table sale_items enable row level security;
alter table purchases enable row level security;
alter table purchase_items enable row level security;

-- Public read policy for demo (tighten for production)
create policy "public read" on stores    for select using (true);
create policy "public read" on employees for select using (true);
create policy "public read" on products  for select using (true);
create policy "public read" on customers for select using (true);
create policy "public read" on sales     for select using (true);
create policy "public read" on sale_items for select using (true);
create policy "public read" on purchases for select using (true);
create policy "public read" on purchase_items for select using (true);

-- ── Seed demo data ───────────────────────────
insert into stores (id, name, image_url, pos_name, vat_enabled, demo)
values (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'ร้านเบเกอรี่ (ตัวอย่าง)',
  null,
  'POS #1',
  true,
  true
);

insert into employees (store_id, name, email, role)
values (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'ชนิ่น เกษมทรัพย์',
  'demo01@pospos.co',
  'manager'
);
