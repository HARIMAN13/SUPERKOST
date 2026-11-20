-- SUPERKOST: shared enums. Duplicate-safe for SQL Editor reruns.
DO $$ BEGIN CREATE TYPE public.user_role AS ENUM ('owner','manager','staff','tenant'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.room_type AS ENUM ('Deluxe','Standard','Superior'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.room_status AS ENUM ('paid','overdue','verify','vacant'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.invoice_status AS ENUM ('paid','verify','overdue','void'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.deposit_status AS ENUM ('locked','dispute','refunded'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.expense_category AS ENUM ('Listrik','Air','Kebersihan','Gaji','Servis AC','Internet','Perbaikan','Lainnya'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.expense_source AS ENUM ('Manual','Tiket Servis','Sistem'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.ticket_category AS ENUM ('AC','Pompa Air & Ledeng','Listrik','Bangunan & Lainnya'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.ticket_status AS ENUM ('open','done'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.wa_rule_id AS ENUM ('h3','h0','late','receipt'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.wa_msg_status AS ENUM ('sending','delivered','read','failed'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
