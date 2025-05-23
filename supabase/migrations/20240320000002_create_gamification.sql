-- Create user_levels table if not exists
create table if not exists user_levels (
  user_id uuid references auth.users on delete cascade not null primary key,
  level integer default 1 not null,
  current_xp integer default 0 not null,
  xp_to_next_level integer default 100 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_stats table if not exists
create table if not exists user_stats (
  user_id uuid references auth.users on delete cascade not null primary key,
  wisdom integer default 0 not null,
  charisma integer default 0 not null,
  resistance integer default 0 not null,
  strength integer default 0 not null,
  creativity integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security if not enabled
do $$ 
begin
  if not exists (select 1 from pg_tables where tablename = 'user_levels' and rowsecurity = true) then
    alter table user_levels enable row level security;
  end if;
  
  if not exists (select 1 from pg_tables where tablename = 'user_stats' and rowsecurity = true) then
    alter table user_stats enable row level security;
  end if;
end $$;

-- Drop existing policies if they exist
drop policy if exists "Users can view their own level." on user_levels;
drop policy if exists "Users can update their own level." on user_levels;
drop policy if exists "Users can insert their own level." on user_levels;
drop policy if exists "Users can view their own stats." on user_stats;
drop policy if exists "Users can update their own stats." on user_stats;
drop policy if exists "Users can insert their own stats." on user_stats;

-- Create policies for user_levels
create policy "Users can view their own level."
  on user_levels for select
  using ( auth.uid() = user_id );

create policy "Users can update their own level."
  on user_levels for update
  using ( auth.uid() = user_id );

create policy "Users can insert their own level."
  on user_levels for insert
  with check ( auth.uid() = user_id );

-- Create policies for user_stats
create policy "Users can view their own stats."
  on user_stats for select
  using ( auth.uid() = user_id );

create policy "Users can update their own stats."
  on user_stats for update
  using ( auth.uid() = user_id );

create policy "Users can insert their own stats."
  on user_stats for insert
  with check ( auth.uid() = user_id );

-- Create or replace triggers for updated_at
create or replace trigger on_user_levels_updated
  before update on user_levels
  for each row
  execute procedure public.handle_updated_at();

create or replace trigger on_user_stats_updated
  before update on user_stats
  for each row
  execute procedure public.handle_updated_at();

-- Create or replace trigger function for new users
create or replace function public.handle_new_user_gamification()
returns trigger as $$
begin
  insert into public.user_levels (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  
  insert into public.user_stats (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  
  return new;
end;
$$ language plpgsql security definer;

-- Drop existing trigger if exists
drop trigger if exists on_auth_user_created_gamification on auth.users;

-- Create trigger for new users
create trigger on_auth_user_created_gamification
  after insert on auth.users
  for each row execute procedure public.handle_new_user_gamification();

-- Insert initial data for existing users
do $$
declare
  user_record record;
begin
  for user_record in select id from auth.users
  loop
    -- Insert user level if not exists
    insert into user_levels (user_id)
    select user_record.id
    where not exists (
      select 1 from user_levels where user_id = user_record.id
    )
    on conflict (user_id) do nothing;

    -- Insert user stats if not exists
    insert into user_stats (user_id)
    select user_record.id
    where not exists (
      select 1 from user_stats where user_id = user_record.id
    )
    on conflict (user_id) do nothing;
  end loop;
end $$; 