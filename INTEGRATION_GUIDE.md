# SUPERKOST Supabase Integration Guide

This guide connects the existing frontend to the backend in `supabase/`. The database uses UUIDs for records; frontend property slugs such as `mulyorejo` are lookup keys only.

## Client setup

Install/update `@supabase/supabase-js` and create a browser client from `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (the provided `sb_publishable_*` key can be used as the anon/publishable key). For cookie-based SSR auth, use a current `@supabase/ssr` release. If that package rejects the new-format key, use `@supabase/supabase-js` directly for browser calls or upgrade the SDK. Never put the service role key in frontend code or any `NEXT_PUBLIC_` variable.

On app boot, fetch the signed-in user's accessible properties, resolve the selected slug to its UUID, and cache both in React context:

```ts
const { data: properties, error } = await supabase
  .from('properties').select('id,slug,name').order('name');
const property = properties?.find((p) => p.slug === activePropId);
// Keep property.id as activePropertyUuid in app context; use UUID for every query.
```

## Replace mock store functions in this order

1. Auth: replace mock session/profile with Supabase Auth and `profiles`.
2. Rooms and tenants: load `rooms`, `tenants`, and occupancy relationships.
3. Dashboard metrics: use the examples below or add a secured SQL view/RPC.
4. Invoices and payment proof uploads.
5. Deposits and deductions.
6. Finance: expenses and service ticket completion.
7. WhatsApp rules and outbox status (read only for client users).

Keep UI model adapters in the frontend so database enum casing, nullable foreign keys, and date strings do not leak into display components.

## Query examples

### Room list

```ts
const { data, error } = await supabase.from('rooms')
  .select('id,room_no,floor,type,price,is_vip,current_status,tenants(id,name,phone,is_active)')
  .eq('property_id', propertyUuid).order('room_no');
```

### Occupancy metrics

Because `rooms` is the authoritative inventory, count non-vacant rooms (include `verify` and `overdue` as occupied):

```ts
const { data: rooms, error } = await supabase.from('rooms')
  .select('id,current_status').eq('property_id', propertyUuid);
const total = rooms?.length ?? 0;
const occupied = rooms?.filter((r) => r.current_status !== 'vacant').length ?? 0;
const occupancyRate = total ? occupied / total : 0;
```

For larger datasets, expose an owner/member-scoped RPC or view returning total, occupied, vacant, overdue, verify, and paid counts. Do not use a client-provided property UUID as authorization; RLS checks it against the authenticated user.

### Invoice list with tenant and room

```ts
const { data, error } = await supabase.from('invoices')
  .select('id,period,due_date,amount,status,paid_on,payment_method,tenants(name,phone),rooms(room_no)')
  .eq('property_id', propertyUuid).order('due_date', { ascending: false });
```

### Dashboard stats

```ts
const [roomsResult, invoicesResult, expensesResult] = await Promise.all([
  supabase.from('rooms').select('id,current_status').eq('property_id', propertyUuid),
  supabase.from('invoices').select('amount,status').eq('property_id', propertyUuid),
  supabase.from('expenses').select('amount,date').eq('property_id', propertyUuid),
]);
// Derive occupied / vacant from rooms; paid / overdue totals from invoices;
// sum expenses after selecting the desired date range.
```

Handle each `error` and loading state. For aggregate counts/sums at scale, add a `SECURITY INVOKER` RPC or a view with explicit property membership checks; avoid exposing unrestricted aggregate views.

## Payments, uploads, and automation

Upload a payment proof to the private `payment-proofs` bucket under a path beginning with the property UUID, for example `{propertyUuid}/{invoiceId}/{filename}`. Store the returned object path or signed URL in `payment_proofs.image_url`. A manager verifies payment by updating the invoice status to `paid`; the database trigger updates the room status and queues a receipt message when the tenant and active receipt rule exist:

```ts
await supabase.from('invoices').update({ status: 'paid', paid_on: new Date().toISOString().slice(0, 10) })
  .eq('id', invoiceId);
```

The RLS policy allows property members to write invoices; enforce the intended manager/owner verification workflow in the UI or tighten the policy if staff must not approve payments. The WA outbox deliberately has no client insert/update policy. Read its status only.

Ticket completion creates an expense only when cost is positive, because expenses require `amount > 0`. Repeated updates after a ticket is done do not create another expense. Tenant checkout vacates the assigned room and voids unpaid invoices.

## RLS and storage notes

All application tables have RLS enabled. The authenticated user must own a property or have a `property_members` row. Property media storage paths must start with the property's UUID for the supplied storage policies to validate access. The `property-assets` bucket is public for reads; only a property owner may upload/update/delete objects. Private bucket objects require an authenticated property member. Never expose `service_role` or `SUPABASE_SERVICE_ROLE_KEY` to the browser.

## Migration sequence

Run the ten SQL files in `supabase/migrations/` in timestamp order in the Supabase SQL Editor. Extensions `pg_cron`, `pg_net`, and `pgcrypto` must be available; migration 09 enables `pg_cron` and `pg_net`, while `gen_random_uuid()` is built in on supported Postgres versions. Create the demo owner Auth user before migration 10. The seed deliberately raises a clear error if it is absent.

## MANUAL DASHBOARD STEPS

1. **Enable/confirm extensions** — Supabase Dashboard → **Database → Extensions**. Ensure `pg_cron`, `pg_net`, and `pgcrypto` are enabled. If the project does not allow enabling one in SQL, toggle it here. Success: all appear enabled. If `pg_net` is unavailable, check project plan/region support and enable it before the cron migration.
2. **Create owner Auth user** — **Authentication → Users → Add user**. Enter `maulana@superkost.id`, password `Superkost2026!`, enable **Auto Confirm**, and create. Success: the user appears with a UID; `handle_new_user` creates the profile. If email is already registered, use that existing user and verify a matching profile exists.
3. **Run ten migrations in order** — **SQL Editor → New query**. Paste/run each file from `20250101000001_enums.sql` through `20250101000010_seed_data.sql`, one at a time, checking the result before moving on. Success: each query completes without an error. Common fixes: run in order; create the Auth user before step 10; enable the extensions before step 9; if rerunning, note that table/enum changes are idempotent but do not manually remove objects.
4. **Verify schema and seed** — **SQL Editor → New query** and run:

   ```sql
   SELECT count(*) AS app_tables FROM information_schema.tables
   WHERE table_schema='public' AND table_name = ANY(ARRAY['profiles','properties','property_members','rooms','tenants','emergency_contacts','invoices','payment_proofs','deposits','deposit_deductions','expenses','ac_units','room_assets','service_tickets','staff_daily_tasks','wa_rules','wa_outbox','vendors']);
   SELECT count(*) AS tables_without_rls FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
   WHERE n.nspname='public' AND c.relname = ANY(ARRAY['profiles','properties','property_members','rooms','tenants','emergency_contacts','invoices','payment_proofs','deposits','deposit_deductions','expenses','ac_units','room_assets','service_tickets','staff_daily_tasks','wa_rules','wa_outbox','vendors']) AND NOT c.relrowsecurity;
   SELECT jobname, schedule, active FROM cron.job WHERE jobname LIKE 'wa-%' ORDER BY jobname;
   SELECT (SELECT count(*) FROM public.properties WHERE slug='mulyorejo') AS properties,
          (SELECT count(*) FROM public.rooms r JOIN public.properties p ON p.id=r.property_id WHERE p.slug='mulyorejo') AS rooms,
          (SELECT count(*) FROM public.wa_rules w JOIN public.properties p ON p.id=w.property_id WHERE p.slug='mulyorejo') AS wa_rules,
          (SELECT count(*) FROM public.ac_units a JOIN public.properties p ON p.id=a.property_id WHERE p.slug='mulyorejo') AS ac_units;
   ```

   Success: 18 app tables, 0 tables without RLS, four active jobs, then counts `1, 30, 4, 30`. If the cron jobs are missing, inspect migration 09 and extension status; if seed counts are short, inspect the migration result and rerun seed after resolving the reported issue.
5. **Set Edge Function secret** — **Project Settings → Edge Functions → Secrets** (or **Edge Functions → Secrets**, depending on dashboard version). Add `FONNTE_TOKEN` from Fonnte; a dummy token is sufficient for deployment but sends will fail. Success: secret is listed (value remains hidden). `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are supplied automatically in Supabase Edge Functions; verify these environment variables exist if deploying elsewhere.
6. **Deploy `wa-dispatcher`** — preferred: from the project root, run `supabase functions deploy wa-dispatcher` after `supabase login` and linking this project; alternatively **Edge Functions → Deploy a new function**, create `wa-dispatcher`, paste `supabase/functions/wa-dispatcher/index.ts`, and deploy. Success: deployment is active and its URL is shown. If CLI reports project mismatch, link the project ref `nizmjjbpnhcgbogmbzow` first.
7. **Update the dispatcher cron** — copy the function URL. In **Project Settings → API**, copy the service_role secret (never put it in frontend config). In **SQL Editor**, replace both placeholders in and run:

   ```sql
   SELECT cron.unschedule(jobid) FROM cron.job WHERE jobname='wa-dispatcher-cron';
   SELECT cron.schedule('wa-dispatcher-cron','*/5 * * * *',
     $job$SELECT net.http_post(url := '<FUNCTION_URL>',
       headers := jsonb_build_object('Authorization','Bearer <SERVICE_ROLE_KEY>','Content-Type','application/json'),
       body := '{}'::jsonb);$job$);
   ```

   Success: `cron.job` shows the dispatcher URL job active and no placeholders remain. If HTTP calls fail, verify the URL and key, then inspect `net._http_response` and Edge Function logs. The key is stored in the database cron command; restrict dashboard/database access accordingly and rotate it if exposed.
8. **Configure Auth redirect URLs** — **Authentication → URL Configuration**. Set Site URL to `http://localhost:3000`; add Redirect URLs `http://localhost:3000/**`, `http://localhost:3000/auth/callback`, and `<production-domain>/**` (replace with the real HTTPS origin). Success: saved URL list includes each exact origin/path. Remove the production placeholder before saving.
9. **Verify Storage buckets** — **Storage → Buckets**. Confirm `payment-proofs`, `tenant-documents`, and `damage-evidence` are private, and `property-assets` is public; size/MIME limits are 5 MB / configured images/PDF for private buckets and 10 MB / JPEG, PNG, SVG for assets. If a preexisting bucket has different settings, the migration updates them.
10. **Configure frontend `.env.local`** — in the local Next.js app set `NEXT_PUBLIC_SUPABASE_URL=https://nizmjjbpnhcgbogmbzow.supabase.co` and `NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_TSufZC1q2wap9DpxN2kfEQ_SY427Pk5`. Restart the dev server. Do not add the service role key. Success: browser client initializes without a missing-env error.
11. **Smoke test** — sign in as `maulana@superkost.id` through Supabase Auth, then query `properties.select('*')` and `rooms.select('*').eq('property_id', propertyUuid)` from the authenticated client. Success: one seeded property and 30 rooms. If empty, verify login, that profile/property owner IDs match, and RLS policies from step 4; never test by placing the service key in browser code.
