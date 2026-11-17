-- SUPERKOST: completion, payment-receipt and tenant-checkout automation.
CREATE OR REPLACE FUNCTION public.handle_ticket_completed() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 IF NEW.status='done' AND OLD.status IS DISTINCT FROM 'done' THEN
   NEW.completed_at := COALESCE(NEW.completed_at, now());
   IF NEW.cost > 0 THEN
     INSERT INTO public.expenses(property_id,date,category,description,amount,source,ticket_id)
     VALUES(NEW.property_id,NEW.scheduled_date,CASE WHEN NEW.category='AC' THEN 'Servis AC'::public.expense_category ELSE 'Perbaikan'::public.expense_category END,
       NEW.job_title,NEW.cost,'Tiket Servis',NEW.id)
     ON CONFLICT DO NOTHING;
   END IF;
   IF NEW.category='AC' AND NEW.room_id IS NOT NULL THEN
     UPDATE public.ac_units SET last_service_date=CURRENT_DATE WHERE room_id=NEW.room_id;
   END IF;
 END IF;
 RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_ticket_completed ON public.service_tickets;
CREATE TRIGGER trg_ticket_completed BEFORE UPDATE ON public.service_tickets FOR EACH ROW EXECUTE FUNCTION public.handle_ticket_completed();

CREATE OR REPLACE FUNCTION public.handle_invoice_paid() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_template text; v_name text; v_phone text; v_room int;
BEGIN
 IF NEW.status='paid' AND OLD.status IS DISTINCT FROM 'paid' THEN
   UPDATE public.rooms SET current_status='paid' WHERE id=NEW.room_id;
   IF NEW.tenant_id IS NOT NULL THEN
     SELECT t.name,t.phone,r.room_no INTO v_name,v_phone,v_room FROM public.tenants t LEFT JOIN public.rooms r ON r.id=t.current_room_id WHERE t.id=NEW.tenant_id;
     SELECT wr.template_body INTO v_template FROM public.wa_rules wr WHERE wr.property_id=NEW.property_id AND wr.id='receipt' AND wr.is_active LIMIT 1;
     IF v_template IS NOT NULL AND v_phone IS NOT NULL THEN
       v_template := replace(replace(replace(v_template,'{nama_penghuni}',COALESCE(v_name,'')),'{nominal_tagihan}',to_char(NEW.amount,'FM999G999G999G990')),'{nomor_kamar}',COALESCE(v_room::text,''));
       INSERT INTO public.wa_outbox(property_id,room_no,recipient_name,recipient_phone,template_used,message_body)
       VALUES(NEW.property_id,v_room,v_name,v_phone,'receipt',v_template);
     END IF;
   END IF;
 END IF;
 RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_invoice_paid ON public.invoices;
CREATE TRIGGER trg_invoice_paid AFTER UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.handle_invoice_paid();

CREATE OR REPLACE FUNCTION public.handle_tenant_checkout() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 IF OLD.is_active IS DISTINCT FROM false AND NEW.is_active=false THEN
   NEW.end_date := COALESCE(NEW.end_date,CURRENT_DATE);
   UPDATE public.rooms SET current_status='vacant' WHERE id=NEW.current_room_id;
   UPDATE public.invoices SET status='void' WHERE tenant_id=NEW.id AND status IN ('overdue','verify');
 END IF;
 RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_tenant_checkout ON public.tenants;
CREATE TRIGGER trg_tenant_checkout BEFORE UPDATE ON public.tenants FOR EACH ROW EXECUTE FUNCTION public.handle_tenant_checkout();
