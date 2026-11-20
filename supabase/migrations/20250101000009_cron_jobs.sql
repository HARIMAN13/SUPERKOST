-- SUPERKOST: daily WIB reminder queue and 5-minute dispatcher. Requires pg_cron and pg_net.
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
CREATE OR REPLACE FUNCTION public.queue_wa_reminders(p_rule public.wa_rule_id, p_target_date date, p_overdue_only boolean DEFAULT false) RETURNS integer
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE n integer;
BEGIN
 INSERT INTO public.wa_outbox(property_id,room_no,recipient_name,recipient_phone,template_used,message_body)
 SELECT i.property_id,r.room_no,t.name,t.phone,wr.template_tag,
   replace(replace(replace(replace(replace(wr.template_body,'{nama_penghuni}',t.name),'{nomor_kamar}',COALESCE(r.room_no::text,'')),
     '{nominal_tagihan}',to_char(i.amount,'FM999G999G999G990')),'{tanggal_jatuh_tempo}',to_char(i.due_date,'DD/MM/YYYY')),
     '{rekening_bank}',COALESCE(p.bank_account_info,''))
 FROM public.invoices i JOIN public.tenants t ON t.id=i.tenant_id JOIN public.rooms r ON r.id=i.room_id
 JOIN public.properties p ON p.id=i.property_id JOIN public.wa_rules wr ON wr.property_id=i.property_id AND wr.id=p_rule AND wr.is_active
 WHERE i.due_date=p_target_date AND i.status='overdue' AND t.is_active;
 GET DIAGNOSTICS n=ROW_COUNT; RETURN n;
END; $$;
CREATE OR REPLACE FUNCTION public.run_wa_h3() RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path=public AS $$ SELECT public.queue_wa_reminders('h3',CURRENT_DATE+3,true); $$;
CREATE OR REPLACE FUNCTION public.run_wa_h0() RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path=public AS $$ SELECT public.queue_wa_reminders('h0',CURRENT_DATE,true); $$;
CREATE OR REPLACE FUNCTION public.run_wa_late() RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE rec record;
BEGIN
 INSERT INTO public.wa_outbox(property_id,room_no,recipient_name,recipient_phone,template_used,message_body)
 SELECT i.property_id,r.room_no,t.name,t.phone,wr.template_tag,
 replace(replace(replace(replace(replace(wr.template_body,'{nama_penghuni}',t.name),'{nomor_kamar}',COALESCE(r.room_no::text,'')),
 '{nominal_tagihan}',to_char(i.amount,'FM999G999G999G990')),'{tanggal_jatuh_tempo}',to_char(i.due_date,'DD/MM/YYYY')),'{rekening_bank}',COALESCE(p.bank_account_info,''))
 FROM public.invoices i JOIN public.tenants t ON t.id=i.tenant_id JOIN public.rooms r ON r.id=i.room_id
 JOIN public.properties p ON p.id=i.property_id JOIN public.wa_rules wr ON wr.property_id=i.property_id AND wr.id='late' AND wr.is_active
 WHERE i.due_date<CURRENT_DATE AND i.status='overdue' AND t.is_active;
END; $$;
DO $$ BEGIN
 PERFORM cron.unschedule(jobid) FROM cron.job WHERE jobname IN ('wa-reminder-h3','wa-reminder-h0','wa-reminder-late','wa-dispatcher-cron');
 PERFORM cron.schedule('wa-reminder-h3','0 1 * * *',$cmd$SELECT public.run_wa_h3();$cmd$);
 PERFORM cron.schedule('wa-reminder-h0','0 2 * * *',$cmd$SELECT public.run_wa_h0();$cmd$);
 PERFORM cron.schedule('wa-reminder-late','0 3 * * *',$cmd$SELECT public.run_wa_late();$cmd$);
 -- Replace both placeholders after deploying wa-dispatcher; see MANUAL DASHBOARD STEPS.
 PERFORM cron.schedule('wa-dispatcher-cron','*/5 * * * *',$cmd$SELECT net.http_post(url := '<FUNCTION_URL>', headers := jsonb_build_object('Authorization','Bearer <SERVICE_ROLE_KEY>','Content-Type','application/json'), body := '{}'::jsonb);$cmd$);
END $$;
