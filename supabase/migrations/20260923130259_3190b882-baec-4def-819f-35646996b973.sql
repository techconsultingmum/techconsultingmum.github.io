
create type public.app_role as enum ('admin', 'moderator', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Users can view their own roles"
on public.user_roles for select to authenticated
using (auth.uid() = user_id);

create policy "Admins can manage roles"
on public.user_roles for all to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create table public.webhook_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text not null,
  url text not null,
  method text not null default 'POST',
  is_active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint webhook_settings_method_check check (method in ('GET','POST')),
  constraint webhook_settings_url_check check (url ~* '^https://')
);

grant select, insert, update, delete on public.webhook_settings to authenticated;
grant all on public.webhook_settings to service_role;
alter table public.webhook_settings enable row level security;

create policy "Admins can read webhook settings"
on public.webhook_settings for select to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can insert webhook settings"
on public.webhook_settings for insert to authenticated
with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update webhook settings"
on public.webhook_settings for update to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete webhook settings"
on public.webhook_settings for delete to authenticated
using (public.has_role(auth.uid(), 'admin'));

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger webhook_settings_updated_at
before update on public.webhook_settings
for each row execute function public.set_updated_at();

insert into public.webhook_settings (key, label, url, method, notes) values
  ('lead', 'Lead / Consultation form', 'https://viwepar.app.n8n.cloud/webhook/agenticai-lead', 'POST', 'Contact & consultation submissions'),
  ('newsletter', 'Newsletter subscribe', 'https://weworo.app.n8n.cloud/webhook/Newsletter', 'POST', 'Subscribe & unsubscribe'),
  ('feedback', 'Feedback form', 'https://xacade.app.n8n.cloud/webhook/feedback', 'POST', 'Footer feedback popup'),
  ('feedback_fallback', 'Feedback fallback form link', 'https://xacade.app.n8n.cloud/form/cfcf4fd4-dba8-417c-ba04-19438a58409a', 'GET', 'Shown to users when the feedback webhook fails');
