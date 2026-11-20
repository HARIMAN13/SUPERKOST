-- SUPERKOST: identity, property, room and tenant records.
CREATE TABLE IF NOT EXISTS public.profiles (
 id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 full_name varchar(150) NOT NULL DEFAULT 'Pengguna', phone varchar(30), role public.user_role NOT NULL DEFAULT 'owner',
 avatar_url text, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.properties (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), slug varchar(50) UNIQUE NOT NULL, name varchar(150) NOT NULL,
 area varchar(100), address text, default_deposit numeric(12,2) NOT NULL DEFAULT 1000000 CHECK(default_deposit >= 0),
 owner_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL, bank_account_info text, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.property_members (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
 user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE, role public.user_role NOT NULL DEFAULT 'staff',
 assigned_at timestamptz NOT NULL DEFAULT now(), UNIQUE(property_id,user_id)
);
CREATE TABLE IF NOT EXISTS public.rooms (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
 room_no int NOT NULL, floor int NOT NULL, type public.room_type NOT NULL DEFAULT 'Standard', price numeric(12,2) NOT NULL CHECK(price >= 0),
 is_vip boolean NOT NULL DEFAULT false, current_status public.room_status NOT NULL DEFAULT 'vacant', UNIQUE(property_id,room_no)
);
CREATE TABLE IF NOT EXISTS public.tenants (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
 current_room_id uuid REFERENCES public.rooms(id) ON DELETE SET NULL, name varchar(150) NOT NULL, phone varchar(30) NOT NULL,
 bank_name varchar(50), bank_account varchar(50), ktp_url text, start_date date NOT NULL,
 due_day int NOT NULL CHECK(due_day BETWEEN 1 AND 28), is_active boolean NOT NULL DEFAULT true, end_date date
);
CREATE TABLE IF NOT EXISTS public.emergency_contacts (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
 name varchar(150) NOT NULL, relation varchar(80), phone varchar(30) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_rooms_property ON public.rooms(property_id);
CREATE INDEX IF NOT EXISTS idx_tenants_property ON public.tenants(property_id);
