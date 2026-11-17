-- SUPERKOST: property authorization helpers and auth profile provisioning.
CREATE OR REPLACE FUNCTION public.is_property_member(p_property_id uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
 SELECT EXISTS (SELECT 1 FROM public.properties p WHERE p.id=p_property_id AND p.owner_id=auth.uid())
 OR EXISTS (SELECT 1 FROM public.property_members m WHERE m.property_id=p_property_id AND m.user_id=auth.uid());
$$;
CREATE OR REPLACE FUNCTION public.is_property_owner(p_property_id uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
 SELECT EXISTS (SELECT 1 FROM public.properties p WHERE p.id=p_property_id AND p.owner_id=auth.uid());
$$;
CREATE OR REPLACE FUNCTION public.get_user_role(p_property_id uuid) RETURNS public.user_role
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
 SELECT CASE WHEN EXISTS(SELECT 1 FROM public.properties p WHERE p.id=p_property_id AND p.owner_id=auth.uid()) THEN 'owner'::public.user_role
 ELSE (SELECT m.role FROM public.property_members m WHERE m.property_id=p_property_id AND m.user_id=auth.uid()) END;
$$;
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 INSERT INTO public.profiles(id,full_name,phone,role)
 VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(COALESCE(NEW.email,''),'@',1), 'Pengguna'),
 NULLIF(NEW.raw_user_meta_data->>'phone',''), 'owner')
 ON CONFLICT (id) DO NOTHING;
 RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
