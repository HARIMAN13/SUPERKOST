import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const FONNTE_API_URL = "https://api.fonnte.com/send";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const fonnteToken = Deno.env.get("FONNTE_TOKEN");

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: "Missing Supabase configuration" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { data: outboxRows, error: fetchError } = await supabase
    .from("wa_outbox")
    .select("id, recipient_phone, recipient_name, message_body")
    .eq("status", "sending")
    .order("sent_at", { ascending: true })
    .limit(20);

  if (fetchError) {
    return new Response(JSON.stringify({ error: fetchError.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!outboxRows || outboxRows.length === 0) {
    return new Response(JSON.stringify({ message: "No messages to dispatch" }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const results = [];

  for (const item of outboxRows) {
    if (!fonnteToken) {
      await supabase
        .from("wa_outbox")
        .update({ status: "sent" })
        .eq("id", item.id);

      results.push({ id: item.id, status: "mock_sent" });
      continue;
    }

    try {
      const response = await fetch(FONNTE_API_URL, {
        method: "POST",
        headers: {
          Authorization: fonnteToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          target: item.recipient_phone,
          message: item.message_body,
        }),
      });

      const resJson = await response.json();
      const isSuccess = response.ok && resJson.status !== false;

      await supabase
        .from("wa_outbox")
        .update({ status: isSuccess ? "sent" : "failed" })
        .eq("id", item.id);

      results.push({ id: item.id, status: isSuccess ? "sent" : "failed" });
    } catch {
      await supabase
        .from("wa_outbox")
        .update({ status: "failed" })
        .eq("id", item.id);

      results.push({ id: item.id, status: "failed" });
    }
  }

  return new Response(JSON.stringify({ processed: results.length, results }), {
    headers: { "Content-Type": "application/json" },
  });
});
