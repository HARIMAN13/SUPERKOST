-- SUPERKOST: tenant isolation across all application tables.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposit_deductions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ac_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wa_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wa_outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

DO $$ DECLARE t text; BEGIN
 FOREACH t IN ARRAY ARRAY['profiles','properties','property_members','rooms','tenants','emergency_contacts','invoices','payment_proofs','deposits','deposit_deductions','expenses','ac_units','room_assets','service_tickets','staff_daily_tasks','wa_rules','wa_outbox','vendors'] LOOP
   EXECUTE format('DROP POLICY IF EXISTS %I_select ON public.%I',t,t);
   EXECUTE format('DROP POLICY IF EXISTS %I_update ON public.%I',t,t);
   EXECUTE format('DROP POLICY IF EXISTS %I_insert ON public.%I',t,t);
   EXECUTE format('DROP POLICY IF EXISTS %I_delete ON public.%I',t,t);
   EXECUTE format('DROP POLICY IF EXISTS %I_write ON public.%I',t,t);
 END LOOP;
END $$;
CREATE POLICY profiles_select ON public.profiles FOR SELECT TO authenticated USING(id=auth.uid());
DROP POLICY IF EXISTS profiles_update ON public.profiles;
CREATE POLICY profiles_update ON public.profiles FOR UPDATE TO authenticated USING(id=auth.uid()) WITH CHECK(id=auth.uid());

CREATE POLICY properties_select ON public.properties FOR SELECT TO authenticated USING(public.is_property_member(id));
DROP POLICY IF EXISTS properties_insert ON public.properties;
CREATE POLICY properties_insert ON public.properties FOR INSERT TO authenticated WITH CHECK(owner_id=auth.uid());
DROP POLICY IF EXISTS properties_update ON public.properties;
CREATE POLICY properties_update ON public.properties FOR UPDATE TO authenticated USING(public.is_property_owner(id)) WITH CHECK(public.is_property_owner(id));
DROP POLICY IF EXISTS properties_delete ON public.properties;
CREATE POLICY properties_delete ON public.properties FOR DELETE TO authenticated USING(public.is_property_owner(id));

CREATE POLICY property_members_select ON public.property_members FOR SELECT TO authenticated USING(public.is_property_member(property_id));
DROP POLICY IF EXISTS property_members_insert ON public.property_members;
CREATE POLICY property_members_insert ON public.property_members FOR INSERT TO authenticated WITH CHECK(public.is_property_owner(property_id));
DROP POLICY IF EXISTS property_members_delete ON public.property_members;
CREATE POLICY property_members_delete ON public.property_members FOR DELETE TO authenticated USING(public.is_property_owner(property_id));

DO $$ DECLARE t text; BEGIN
 FOREACH t IN ARRAY ARRAY['deposits','expenses','wa_rules','ac_units','vendors'] LOOP
   EXECUTE format('CREATE POLICY %I_select ON public.%I FOR SELECT TO authenticated USING(public.is_property_member(property_id))',t,t);
   EXECUTE format('DROP POLICY IF EXISTS %I_write ON public.%I',t,t);
   EXECUTE format('CREATE POLICY %I_write ON public.%I FOR ALL TO authenticated USING(public.is_property_owner(property_id)) WITH CHECK(public.is_property_owner(property_id))',t,t);
 END LOOP;
 FOREACH t IN ARRAY ARRAY['rooms','tenants','invoices','staff_daily_tasks','service_tickets'] LOOP
   EXECUTE format('CREATE POLICY %I_select ON public.%I FOR SELECT TO authenticated USING(public.is_property_member(property_id))',t,t);
   EXECUTE format('DROP POLICY IF EXISTS %I_write ON public.%I',t,t);
   EXECUTE format('CREATE POLICY %I_write ON public.%I FOR ALL TO authenticated USING(public.is_property_member(property_id)) WITH CHECK(public.is_property_member(property_id))',t,t);
 END LOOP;
END $$;
-- Parent-derived authorization prevents foreign keys being used to cross properties.
DROP POLICY IF EXISTS emergency_contacts_select ON public.emergency_contacts;
CREATE POLICY emergency_contacts_select ON public.emergency_contacts FOR SELECT TO authenticated USING(EXISTS(SELECT 1 FROM public.tenants t WHERE t.id=tenant_id AND public.is_property_member(t.property_id)));
DROP POLICY IF EXISTS emergency_contacts_write ON public.emergency_contacts;
CREATE POLICY emergency_contacts_write ON public.emergency_contacts FOR ALL TO authenticated
 USING(EXISTS(SELECT 1 FROM public.tenants t WHERE t.id=tenant_id AND public.is_property_member(t.property_id)))
 WITH CHECK(EXISTS(SELECT 1 FROM public.tenants t WHERE t.id=tenant_id AND public.is_property_member(t.property_id)));
DROP POLICY IF EXISTS payment_proofs_select ON public.payment_proofs;
CREATE POLICY payment_proofs_select ON public.payment_proofs FOR SELECT TO authenticated USING(EXISTS(SELECT 1 FROM public.invoices i WHERE i.id=invoice_id AND public.is_property_member(i.property_id)));
DROP POLICY IF EXISTS payment_proofs_write ON public.payment_proofs;
CREATE POLICY payment_proofs_write ON public.payment_proofs FOR ALL TO authenticated
 USING(EXISTS(SELECT 1 FROM public.invoices i WHERE i.id=invoice_id AND public.is_property_member(i.property_id)))
 WITH CHECK(EXISTS(SELECT 1 FROM public.invoices i WHERE i.id=invoice_id AND public.is_property_member(i.property_id)));
DROP POLICY IF EXISTS deposit_deductions_select ON public.deposit_deductions;
CREATE POLICY deposit_deductions_select ON public.deposit_deductions FOR SELECT TO authenticated USING(EXISTS(SELECT 1 FROM public.deposits d WHERE d.id=deposit_id AND public.is_property_member(d.property_id)));
DROP POLICY IF EXISTS deposit_deductions_write ON public.deposit_deductions;
CREATE POLICY deposit_deductions_write ON public.deposit_deductions FOR ALL TO authenticated
 USING(EXISTS(SELECT 1 FROM public.deposits d WHERE d.id=deposit_id AND public.is_property_owner(d.property_id)))
 WITH CHECK(EXISTS(SELECT 1 FROM public.deposits d WHERE d.id=deposit_id AND public.is_property_owner(d.property_id)));
DROP POLICY IF EXISTS room_assets_select ON public.room_assets;
CREATE POLICY room_assets_select ON public.room_assets FOR SELECT TO authenticated
 USING(EXISTS(SELECT 1 FROM public.rooms r WHERE r.id=room_id AND public.is_property_member(r.property_id)));
DROP POLICY IF EXISTS room_assets_write ON public.room_assets;
CREATE POLICY room_assets_write ON public.room_assets FOR ALL TO authenticated
 USING(EXISTS(SELECT 1 FROM public.rooms r WHERE r.id=room_id AND public.is_property_owner(r.property_id)))
 WITH CHECK(EXISTS(SELECT 1 FROM public.rooms r WHERE r.id=room_id AND public.is_property_owner(r.property_id)));
DROP POLICY IF EXISTS wa_outbox_select ON public.wa_outbox;
CREATE POLICY wa_outbox_select ON public.wa_outbox FOR SELECT TO authenticated USING(public.is_property_member(property_id));
