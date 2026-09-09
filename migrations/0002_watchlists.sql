create table if not exists watchlists (
  id text primary key,
  user_id text not null,
  name text not null,
  items text not null default '[]',
  selected text,
  updated_at timestamptz not null default now()
);
create index if not exists watchlists_user_id_idx on watchlists (user_id);
