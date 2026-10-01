-- Encomendas REJENDARI: suporte ao checkout multi-gateway.
-- Escrita apenas via service_role (server functions); leitura pelo próprio utilizador.
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  email text,
  status text not null default 'pending'
    check (status in ('pending', 'requires_payment', 'paid', 'failed', 'expired', 'canceled')),
  provider text not null default 'stripe'
    check (provider in ('stripe', 'ifthenpay', 'coinbase')),
  provider_intent_id text,
  total_amount numeric(12,2) not null check (total_amount >= 0),
  total_currency text not null default 'EUR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  variant_gid text not null,
  product_handle text,
  product_title text not null,
  variant_title text,
  image_url text,
  unit_price numeric(12,2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  line_total numeric(12,2) not null check (line_total >= 0)
);

create index if not exists orders_user_created_idx on public.orders (user_id, created_at desc);
create index if not exists orders_intent_idx on public.orders (provider_intent_id);

grant select on public.orders to authenticated;
grant usage, select on sequence pg_catalog.gen_random_uuid to service_role;

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own"
  on public.orders for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "order_items_select_own" on public.order_items;
create policy "order_items_select_own"
  on public.order_items for select
  to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

-- Sem INSERT/UPDATE públicos: apenas o server (service_role) escreve encomendas.
revoke all on public.orders from anon, authenticated;
revoke all on public.order_items from anon, authenticated;
grant select on public.orders to authenticated;
grant select on public.order_items to authenticated;

create or replace function public.touch_order_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.touch_order_updated_at() from public, anon, authenticated;
grant execute on function public.touch_order_updated_at() to service_role;

drop trigger if exists orders_touch_updated_at on public.orders;
create trigger orders_touch_updated_at
  before update on public.orders
  for each row execute function public.touch_order_updated_at();
