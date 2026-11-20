-- SUPERKOST: billing and finance tables. Ticket FK is added after service_tickets exists.
CREATE TABLE IF NOT EXISTS public.invoices (
 id varchar(50) PRIMARY KEY, property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
 room_id uuid REFERENCES public.rooms(id) ON DELETE SET NULL, tenant_id uuid REFERENCES public.tenants(id) ON DELETE SET NULL,
 period varchar(50) NOT NULL, due_date date NOT NULL, amount numeric(12,2) NOT NULL CHECK(amount >= 0),
 status public.invoice_status NOT NULL DEFAULT 'overdue', paid_on date, payment_method varchar(50), overdue_days int NOT NULL DEFAULT 0 CHECK(overdue_days >= 0), created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.payment_proofs (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), invoice_id varchar(50) NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
 image_url text NOT NULL, uploaded_at timestamptz NOT NULL DEFAULT now(), tx_time varchar(20), bank_ref_no varchar(100),
 verified_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL, verified_at timestamptz, rejection_reason text
);
CREATE TABLE IF NOT EXISTS public.deposits (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
 room_id uuid REFERENCES public.rooms(id) ON DELETE SET NULL, tenant_id uuid REFERENCES public.tenants(id) ON DELETE SET NULL,
 amount numeric(12,2) NOT NULL CHECK(amount >= 0), received_date date NOT NULL, status public.deposit_status NOT NULL DEFAULT 'locked',
 refund_amount numeric(12,2) CHECK(refund_amount >= 0), refund_bank_info text, refund_date date
);
CREATE TABLE IF NOT EXISTS public.deposit_deductions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), deposit_id uuid NOT NULL REFERENCES public.deposits(id) ON DELETE CASCADE,
 item_name varchar(150) NOT NULL, amount numeric(12,2) NOT NULL CHECK(amount >= 0), evidence_photo_url text
);
CREATE TABLE IF NOT EXISTS public.expenses (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
 date date NOT NULL, category public.expense_category NOT NULL, description text NOT NULL, amount numeric(12,2) NOT NULL CHECK(amount > 0),
 source public.expense_source NOT NULL DEFAULT 'Manual', ticket_id varchar(50), created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_invoices_property_status ON public.invoices(property_id,status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_unpaid ON public.invoices(due_date) WHERE status IN ('overdue','verify');
CREATE INDEX IF NOT EXISTS idx_invoices_tenant ON public.invoices(tenant_id);
