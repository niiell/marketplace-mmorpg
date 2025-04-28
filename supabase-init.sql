-- USERS: Dikelola oleh Supabase Auth

-- PROFILES
create table if not exists profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  avatar_url text,
  bio text,
  phone text,
  created_at timestamp with time zone default now()
);

-- CATEGORIES
create table if not exists categories (
  id bigserial primary key,
  name text unique not null
);

-- GAMES
create table if not exists games (
  id bigserial primary key,
  name text unique not null
);

-- LISTINGS
create table if not exists listings (
  id bigserial primary key,
  seller_id uuid references auth.users(id) on delete cascade,
  title text not null,
  description text,
  category_id bigint references categories(id),
  game_id bigint references games(id),
  type text check (type in ('item', 'gold', 'jasa')),
  price numeric not null,
  stock integer,
  status text default 'aktif',
  image_url text,
  created_at timestamp with time zone default now()
);

-- TRANSACTIONS
create table if not exists transactions (
  id bigserial primary key,
  buyer_id uuid references auth.users(id),
  seller_id uuid references auth.users(id),
  listing_id bigint references listings(id),
  amount numeric not null,
  status_order text,
  status_payment text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- TRANSACTION_LOGS
create table if not exists transaction_logs (
  id bigserial primary key,
  transaction_id bigint references transactions(id),
  action text,
  performed_by uuid references auth.users(id),
  note text,
  created_at timestamp with time zone default now()
);

-- CHATS
create table if not exists chats (
  id bigserial primary key,
  buyer_id uuid references auth.users(id),
  seller_id uuid references auth.users(id),
  listing_id bigint references listings(id),
  created_at timestamp with time zone default now()
);

-- MESSAGES
create table if not exists messages (
  id bigserial primary key,
  chat_id bigint references chats(id) on delete cascade,
  sender_id uuid references auth.users(id),
  content text,
  created_at timestamp with time zone default now()
);

-- REVIEWS
create table if not exists reviews (
  id bigserial primary key,
  reviewer_id uuid references auth.users(id),
  reviewee_id uuid references auth.users(id),
  transaction_id bigint references transactions(id),
  rating integer check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default now()
);

-- NOTIFICATIONS
create table if not exists notifications (
  id bigserial primary key,
  user_id uuid references auth.users(id),
  type text,
  content text,
  url_target text,
  is_read boolean default false,
  created_at timestamp with time zone default now()
);

-- CMS_POSTS
create table if not exists cms_posts (
  id bigserial primary key,
  title text not null,
  slug text unique not null,
  content text,
  metadata jsonb,
  created_at timestamp with time zone default now()
);

-- ENABLE RLS
alter table profiles enable row level security;
alter table listings enable row level security;
alter table transactions enable row level security;
alter table transaction_logs enable row level security;
alter table chats enable row level security;
alter table messages enable row level security;
alter table reviews enable row level security;
alter table notifications enable row level security;

-- RLS POLICIES
create policy "Users can view and edit their own profile"
  on profiles
  for all
  using (auth.uid() = user_id);

create policy "Sellers can manage their own listings"
  on listings
  for all
  using (auth.uid() = seller_id);

create policy "Anyone can view active listings"
  on listings
  for select
  using (status = 'aktif');

create policy "Buyer or seller can access their transactions"
  on transactions
  for all
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

create policy "Related users can access transaction logs"
  on transaction_logs
  for select
  using (
    exists (
      select 1 from transactions t
      where t.id = transaction_id
      and (t.buyer_id = auth.uid() or t.seller_id = auth.uid())
    )
  );

create policy "Chat participants can access chat"
  on chats
  for all
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

create policy "Chat participants can access messages"
  on messages
  for all
  using (
    exists (
      select 1 from chats c
      where c.id = chat_id
      and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
    )
  );

create policy "Reviewer can insert review"
  on reviews
  for insert
  with check (reviewer_id = auth.uid());

create policy "Reviewer or reviewee can view review"
  on reviews
  for select
  using (reviewer_id = auth.uid() or reviewee_id = auth.uid());

create policy "User can access their notifications"
  on notifications
  for all
  using (user_id = auth.uid());
