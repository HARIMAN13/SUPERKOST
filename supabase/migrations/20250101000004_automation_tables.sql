-- SUPERKOST: maintenance, messaging and supplier tables; complete expense-ticket relation.
CREATE TABLE IF NOT EXISTS public.ac_units (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
 room_id uuid NOT NULL UNIQUE REFERENCES public.rooms(id) ON DELETE CASCADE, brand varchar(50) NOT NULL,
 pk varchar(20) NOT NULL, last_service_date date NOT NULL
);
CREATE TABLE IF NOT EXISTS public.room_assets (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), room_id uuid NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
 name varchar(100) NOT NULL, asset_code varchar(50), condition varchar(20) NOT NULL DEFAULT 'ok' CHECK(condition IN ('ok','warn','na')),
 notes text, last_checked_date date
);
CREATE TABLE IF NOT EXISTS public.service_tickets (
 id varchar(50) PRIMARY KEY, property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
 room_id uuid REFERENCES public.rooms(id) ON DELETE SET NULL, category public.ticket_category NOT NULL,
 job_title varchar(200) NOT NULL, vendor_name varchar(150) NOT NULL, scheduled_date date NOT NULL,
 cost numeric(12,2) NOT NULL DEFAULT 0 CHECK(cost >= 0), notes text, photo_url text,
 status public.ticket_status NOT NULL DEFAULT 'open', created_at timestamptz NOT NULL DEFAULT now(), completed_at timestamptz
);
DO $$ BEGIN ALTER TABLE public.expenses ADD CONSTRAINT fk_expenses_ticket FOREIGN KEY(ticket_id) REFERENCES public.service_tickets(id) ON DELETE SET NULL; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE TABLE IF NOT EXISTS public.staff_daily_tasks (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
 task_date date NOT NULL, task_key varchar(50) NOT NULL, task_label varchar(150), area_schedule varchar(100),
 is_done boolean NOT NULL DEFAULT false, completed_at_time varchar(10), completed_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
 UNIQUE(property_id,task_date,task_key)
);
CREATE TABLE IF NOT EXISTS public.wa_rules (
 id public.wa_rule_id NOT NULL, property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
 rule_name varchar(150) NOT NULL, scheduled_time time, is_active boolean NOT NULL DEFAULT true,
 template_tag varchar(100), template_body text NOT NULL, PRIMARY KEY(property_id,id)
);
CREATE TABLE IF NOT EXISTS public.wa_outbox (
 id bigserial PRIMARY KEY, property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
 room_no int, recipient_name varchar(150) NOT NULL, recipient_phone varchar(30) NOT NULL,
 template_used varchar(100), message_body text NOT NULL, status public.wa_msg_status NOT NULL DEFAULT 'sending', sent_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_wa_outbox_sending ON public.wa_outbox(status) WHERE status='sending';
CREATE TABLE IF NOT EXISTS public.vendors (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
 name varchar(150) NOT NULL, specialty varchar(150) NOT NULL, phone varchar(30) NOT NULL, contact_person varchar(100),
 rating numeric(2,1) NOT NULL DEFAULT 5.0 CHECK(rating BETWEEN 0 AND 5), total_jobs int NOT NULL DEFAULT 0,
 tags text[], categories public.ticket_category[]
);
