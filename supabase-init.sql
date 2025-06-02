-- ### AUTH / USERS ###
-- (Supabase Auth menangani tabel auth.users)

-- ROLES & USER_ROLES
create table if not exists roles (
  id serial primary key,
  role_name text unique not null
);

create table if not exists user_roles (
  user_id uuid references auth.users(id) on delete cascade,
  role_id int references roles(id),
  primary key (user_id, role_id),
  unique (user_id, role_id)
);

-- PROFILES
create table if not exists profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  avatar_url text,
  bio text,
  phone text,
  created_at timestamptz default now()
);

-- CATEGORIES & GAMES
create table if not exists categories (
  id bigserial primary key,
  name text unique not null
);

create table if not exists games (
  id bigserial primary key,
  name text unique not null
);

-- LISTINGS
create table if not exists listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL,
  title TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INT,
  max_per_order INT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TRANSACTIONS
create table if not exists transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id),
  buyer_id UUID NOT NULL,
  seller_id UUID NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TRANSACTION_LOGS
create table if not exists transaction_logs (
  id bigserial primary key,
  transaction_id bigint references transactions(id),
  action text,
  performed_by uuid references auth.users(id),
  note text,
  created_at timestamptz default now()
);

-- DISPUTES (opsional fitur sengketa)
create table if not exists disputes (
  id bigserial primary key,
  transaction_id bigint references transactions(id),
  reported_by uuid references auth.users(id),
  reason text not null,
  status text default 'open' check (status in ('open','resolved','rejected')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- CHAT & MESSAGES
create table if not exists chats (
  id bigserial primary key,
  buyer_id uuid references auth.users(id),
  seller_id uuid references auth.users(id),
  listing_id bigint references listings(id),
  created_at timestamptz default now()
);

create table if not exists messages (
  id bigserial primary key,
  chat_id bigint references chats(id),
  sender_id uuid references auth.users(id),
  content text,
  created_at timestamptz default now()
);

-- REVIEWS
create table if not exists reviews (
  id bigserial primary key,
  reviewer_id uuid references auth.users(id),
  reviewee_id uuid references auth.users(id),
  transaction_id bigint references transactions(id),
  rating int check (rating >=1 and rating <=5),
  comment text,
  created_at timestamptz default now()
);

-- NOTIFICATIONS
create table if not exists notifications (
  id bigserial primary key,
  user_id uuid references auth.users(id),
  type text,
  content text,
  url_target text,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- WISHLIST / FAVORITES
create table if not exists wishlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  listing_id UUID NOT NULL REFERENCES listings(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  unique(user_id, listing_id)
);

create table if not exists wishlist_stats (
  listing_id UUID PRIMARY KEY REFERENCES listings(id),
  save_count INT NOT NULL DEFAULT 0
);

-- ENABLE RLS
alter table profiles enable row level security;
alter table listings enable row level security;
alter table transactions enable row level security;
alter table transaction_logs enable row level security;
alter table disputes enable row level security;
alter table chats enable row level security;
alter table messages enable row level security;
alter table reviews enable row level security;
alter table notifications enable row level security;

-- RLS POLICIES (contoh untuk user_roles & admin)
create policy "Only admins can manage user_roles"
  on user_roles
  for all
  using (
    exists (
      select 1 from user_roles ur
      join roles r on ur.role_id = r.id
      where ur.user_id = auth.uid() and r.role_name = 'admin'
    )
  );

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

-- INDEXES
create index idx_user_roles_user_id on user_roles (user_id);
create index idx_user_roles_role_id on user_roles (role_id);

create index idx_listings_seller_id on listings (seller_id);
create index idx_listings_category_id on listings (category_id);
create index idx_listings_game_id on listings (game_id);

create index idx_transactions_buyer_id on transactions (buyer_id);
create index idx_transactions_seller_id on transactions (seller_id);
create index idx_transactions_listing_id on transactions (listing_id);

create index idx_transaction_logs_transaction_id on transaction_logs (transaction_id);

create index idx_chats_buyer_id on chats (buyer_id);
create index idx_chats_seller_id on chats (seller_id);
create index idx_chats_listing_id on chats (listing_id);

create index idx_messages_chat_id on messages (chat_id);
create index idx_messages_sender_id on messages (sender_id);

create index idx_reviews_reviewer_id on reviews (reviewer_id);
create index idx_reviews_reviewee_id on reviews (reviewee_id);
create index idx_reviews_transaction_id on reviews (transaction_id);

create index idx_notifications_user_id on notifications (user_id);

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create function to check and update stock during transaction
CREATE OR REPLACE FUNCTION create_transaction_with_stock_check(
    p_listing_id UUID,
    p_buyer_id UUID,
    p_seller_id UUID,
    p_amount DECIMAL,
    p_quantity INT DEFAULT 1
) RETURNS TABLE (
    id UUID,
    status TEXT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_stock INT;
    v_transaction_id UUID;
BEGIN
    -- Lock the listing row for update
    SELECT stock INTO v_stock
    FROM listings
    WHERE id = p_listing_id
    FOR UPDATE;
    
    -- Check if we have enough stock
    IF v_stock IS NOT NULL AND v_stock < p_quantity THEN
        RAISE EXCEPTION 'insufficient_stock';
    END IF;
    
    -- Update stock if it's tracked
    IF v_stock IS NOT NULL THEN
        UPDATE listings
        SET stock = stock - p_quantity,
            updated_at = NOW()
        WHERE id = p_listing_id;
    END IF;
    
    -- Create transaction
    INSERT INTO transactions (
        listing_id,
        buyer_id,
        seller_id,
        quantity,
        amount,
        status
    ) VALUES (
        p_listing_id,
        p_buyer_id,
        p_seller_id,
        p_quantity,
        p_amount,
        'pending'
    ) RETURNING id INTO v_transaction_id;
    
    RETURN QUERY
    SELECT v_transaction_id AS id,
           'pending'::TEXT AS status;
END;
$$;

-- Create RLS policies
CREATE POLICY "Enable read access for all active listings"
ON listings FOR SELECT
TO authenticated
USING (status = 'active');

CREATE POLICY "Enable read/write access for seller's own listings"
ON listings FOR ALL
TO authenticated
USING (seller_id = auth.uid());

CREATE POLICY "Enable read access for users' own transactions"
ON transactions FOR SELECT
TO authenticated
USING (buyer_id = auth.uid() OR seller_id = auth.uid());

CREATE POLICY "Enable insert access for buyers"
ON transactions FOR INSERT
TO authenticated
WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Enable wishlist management for authenticated users"
ON wishlist FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Enable read access for wishlist stats"
ON wishlist_stats FOR SELECT
TO authenticated
USING (true);

-- Create triggers for statistics
CREATE OR REPLACE FUNCTION update_wishlist_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO wishlist_stats (listing_id, save_count)
        VALUES (NEW.listing_id, 1)
        ON CONFLICT (listing_id)
        DO UPDATE SET save_count = wishlist_stats.save_count + 1;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE wishlist_stats
        SET save_count = save_count - 1
        WHERE listing_id = OLD.listing_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER wishlist_stats_trigger
AFTER INSERT OR DELETE ON wishlist
FOR EACH ROW
EXECUTE FUNCTION update_wishlist_stats();