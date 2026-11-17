-- SUPERKOST: storage buckets and access policies. Private objects are partitioned by property UUID as first path segment.
INSERT INTO storage.buckets(id,name,public,file_size_limit,allowed_mime_types) VALUES
 ('payment-proofs','payment-proofs',false,5242880,ARRAY['image/jpeg','image/png','image/webp']),
 ('tenant-documents','tenant-documents',false,5242880,ARRAY['image/jpeg','image/png','application/pdf']),
 ('damage-evidence','damage-evidence',false,5242880,ARRAY['image/jpeg','image/png']),
 ('property-assets','property-assets',true,10485760,ARRAY['image/jpeg','image/png','image/svg+xml'])
ON CONFLICT(id) DO UPDATE SET public=EXCLUDED.public,file_size_limit=EXCLUDED.file_size_limit,allowed_mime_types=EXCLUDED.allowed_mime_types;
DROP POLICY IF EXISTS "Private property media access" ON storage.objects;
CREATE POLICY "Private property media access" ON storage.objects FOR ALL TO authenticated
 USING(bucket_id IN ('payment-proofs','tenant-documents','damage-evidence') AND EXISTS(SELECT 1 FROM public.properties p WHERE p.id=(storage.foldername(name))[1]::uuid AND public.is_property_member(p.id)))
 WITH CHECK(bucket_id IN ('payment-proofs','tenant-documents','damage-evidence') AND EXISTS(SELECT 1 FROM public.properties p WHERE p.id=(storage.foldername(name))[1]::uuid AND public.is_property_member(p.id)));
DROP POLICY IF EXISTS "Public property assets read" ON storage.objects;
CREATE POLICY "Public property assets read" ON storage.objects FOR SELECT TO anon,authenticated USING(bucket_id='property-assets');
DROP POLICY IF EXISTS "Property assets owner write" ON storage.objects;
CREATE POLICY "Property assets owner write" ON storage.objects FOR ALL TO authenticated
 USING(bucket_id='property-assets' AND EXISTS(SELECT 1 FROM public.properties p WHERE p.id=(storage.foldername(name))[1]::uuid AND public.is_property_owner(p.id)))
 WITH CHECK(bucket_id='property-assets' AND EXISTS(SELECT 1 FROM public.properties p WHERE p.id=(storage.foldername(name))[1]::uuid AND public.is_property_owner(p.id)));
