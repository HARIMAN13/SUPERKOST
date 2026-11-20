-- SUPERKOST: repeatable Mulyorejo demo property. Create the owner auth user first.
DO $$
DECLARE v_owner uuid; v_property uuid; v_room uuid; i int; v_floor int; v_room_type public.room_type; v_price numeric;
BEGIN
 SELECT id INTO v_owner FROM auth.users WHERE email='maulana@superkost.id' LIMIT 1;
 IF v_owner IS NULL THEN RAISE EXCEPTION 'Create auth user maulana@superkost.id in Supabase Dashboard before running seed_data.'; END IF;
 INSERT INTO public.profiles(id,full_name,phone,role) VALUES(v_owner,'Muhamad Maulana',NULL,'owner') ON CONFLICT(id) DO NOTHING;
 INSERT INTO public.properties(slug,name,area,bank_account_info,owner_id)
 VALUES('mulyorejo','Kost Mulyorejo Asri','Surabaya Timur','BCA 1234567890 a/n Muhamad Maulana',v_owner)
 ON CONFLICT(slug) DO UPDATE SET owner_id=EXCLUDED.owner_id RETURNING id INTO v_property;
 INSERT INTO public.property_members(property_id,user_id,role) VALUES(v_property,v_owner,'owner') ON CONFLICT(property_id,user_id) DO NOTHING;
 FOR i IN 1..30 LOOP
   v_floor := ((i-1)/10)+1;
   v_room_type := CASE WHEN i%7=0 THEN 'Deluxe'::public.room_type ELSE 'Standard'::public.room_type END;
   v_price := CASE WHEN v_room_type='Deluxe' THEN 1800000 ELSE 1200000 END;
   INSERT INTO public.rooms(property_id,room_no,floor,type,price,is_vip,current_status)
   VALUES(v_property,i,v_floor,v_room_type,v_price,i IN (7,14,21,28),'vacant')
   ON CONFLICT(property_id,room_no) DO NOTHING;
   SELECT id INTO v_room FROM public.rooms WHERE property_id=v_property AND room_no=i;
   INSERT INTO public.ac_units(property_id,room_id,brand,pk,last_service_date)
   VALUES(v_property,v_room,CASE i%5 WHEN 0 THEN 'Daikin' WHEN 1 THEN 'Panasonic' WHEN 2 THEN 'Sharp' WHEN 3 THEN 'LG' ELSE 'Gree' END,
     CASE WHEN i%3=0 THEN '1.5 PK' ELSE '1 PK' END, CASE WHEN i<=6 THEN CURRENT_DATE-INTERVAL '7 months' WHEN i<=12 THEN CURRENT_DATE-INTERVAL '4 months' ELSE CURRENT_DATE-INTERVAL '2 months' END)
   ON CONFLICT(room_id) DO NOTHING;
 END LOOP;
 INSERT INTO public.wa_rules(property_id,id,rule_name,scheduled_time,is_active,template_tag,template_body) VALUES
 (v_property,'h3','Pengingat H-3','08:00',true,'h3','Halo {nama_penghuni}, tagihan kamar {nomor_kamar} sebesar Rp{nominal_tagihan} jatuh tempo pada {tanggal_jatuh_tempo}. Pembayaran ke {rekening_bank}. Terima kasih.'),
 (v_property,'h0','Pengingat jatuh tempo','09:00',true,'h0','Halo {nama_penghuni}, hari ini jatuh tempo tagihan kamar {nomor_kamar} sebesar Rp{nominal_tagihan}. Pembayaran ke {rekening_bank}. Terima kasih.'),
 (v_property,'late','Pengingat keterlambatan','10:00',true,'late','Halo {nama_penghuni}, tagihan kamar {nomor_kamar} sebesar Rp{nominal_tagihan} telah melewati jatuh tempo {tanggal_jatuh_tempo}. Mohon konfirmasi pembayaran. Rekening: {rekening_bank}.'),
 (v_property,'receipt','Bukti pembayaran','10:00',true,'receipt','Halo {nama_penghuni}, pembayaran Rp{nominal_tagihan} untuk kamar {nomor_kamar} telah kami terima. Terima kasih.')
 ON CONFLICT(property_id,id) DO NOTHING;
 INSERT INTO public.vendors(property_id,name,specialty,phone,categories,tags) VALUES
 (v_property,'CV Sejuk Abadi','AC','081234567801',ARRAY['AC']::public.ticket_category[],ARRAY['AC','Service']),
 (v_property,'Pak Slamet','Ledeng','081234567802',ARRAY['Pompa Air & Ledeng']::public.ticket_category[],ARRAY['Ledeng']),
 (v_property,'Toko Listrik Terang Jaya','Listrik','081234567803',ARRAY['Listrik']::public.ticket_category[],ARRAY['Listrik'])
 ON CONFLICT DO NOTHING;
END $$;
