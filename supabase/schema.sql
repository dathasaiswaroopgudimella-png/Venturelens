-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  updated_at timestamp with time zone,
  full_name text,
  avatar_url text
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Create trigger for new user profile creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- Create projects table
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  status text default 'draft',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for projects
alter table public.projects enable row level security;

create policy "Users can view their own projects" on public.projects
  for select using (auth.uid() = user_id);

create policy "Users can create their own projects" on public.projects
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own projects" on public.projects
  for update using (auth.uid() = user_id);

create policy "Users can delete their own projects" on public.projects
  for delete using (auth.uid() = user_id);


-- Create questionnaires table
create table public.questionnaires (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  answers jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for questionnaires
alter table public.questionnaires enable row level security;

create policy "Users can view their project questionnaires" on public.questionnaires
  for select using (
    exists (
      select 1 from public.projects
      where projects.id = questionnaires.project_id
      and projects.user_id = auth.uid()
    )
  );

create policy "Users can create their project questionnaires" on public.questionnaires
  for insert with check (
    exists (
      select 1 from public.projects
      where projects.id = project_id
      and projects.user_id = auth.uid()
    )
  );


-- Create reports table
create table public.reports (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  overall_score numeric not null,
  scores jsonb not null,
  evidence jsonb not null,
  consistency jsonb not null,
  recommendations jsonb not null,
  ai_analysis jsonb not null,
  agreement jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for reports
alter table public.reports enable row level security;

create policy "Users can view their project reports" on public.reports
  for select using (
    exists (
      select 1 from public.projects
      where projects.id = reports.project_id
      and projects.user_id = auth.uid()
    )
  );

create policy "Users can create their project reports" on public.reports
  for insert with check (
    exists (
      select 1 from public.projects
      where projects.id = project_id
      and projects.user_id = auth.uid()
    )
  );
