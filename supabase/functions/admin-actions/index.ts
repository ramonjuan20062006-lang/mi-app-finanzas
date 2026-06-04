import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.107.0";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: CORS });

  try {
    const db = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const url  = new URL(req.url);
    const path = url.pathname.split("/").pop();

    if (req.method === "GET" && path === "users") {
      const { data, error } = await db.from("profiles").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return new Response(JSON.stringify({ data }), { headers: { ...CORS, "Content-Type": "application/json" } });
    }

    if (req.method === "POST" && path === "update-plan") {
      const { userId, plan } = await req.json();
      if (!userId || !plan) return new Response(JSON.stringify({ error: "Missing params" }), { status: 400, headers: { ...CORS, "Content-Type": "application/json" } });
      const { error } = await db.from("profiles").update({ plan }).eq("id", userId);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), { headers: { ...CORS, "Content-Type": "application/json" } });
    }

    if (req.method === "POST" && path === "veto-user") {
      const { userId } = await req.json();
      if (!userId) return new Response(JSON.stringify({ error: "Missing userId" }), { status: 400, headers: { ...CORS, "Content-Type": "application/json" } });
      const { error } = await db.from("profiles").update({ is_vetted: true }).eq("id", userId);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), { headers: { ...CORS, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: { ...CORS, "Content-Type": "application/json" } });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers: { ...CORS, "Content-Type": "application/json" } });
  }
});
