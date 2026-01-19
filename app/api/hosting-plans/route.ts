import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(req: NextRequest) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      {
        error:
          "Supabase no está configurado. Define NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY."
      },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const body = (await req.json()) as {
    config?: {
      location?: string;
      operatingSystem?: string;
      cores?: number;
      ramGb?: number;
      storageGb?: number;
      billingPeriod?: "mensual" | "anual";
    };
    price?: number;
    clientName?: string;
    clientEmail?: string;
  };

  if (!body.config || typeof body.price !== "number") {
    return NextResponse.json(
      {
        error: "Faltan datos de configuración o precio para registrar la VPS."
      },
      { status: 400 }
    );
  }

  const ipHeader =
    req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "";
  const clientIp =
    ipHeader.split(",")[0]?.trim() || undefined;

  const monthlyPrice =
    body.config.billingPeriod === "anual" ? body.price / 12 : body.price;

  const name =
    body.clientName ??
    `VPS ${body.config.cores ?? 0} vCPU / ${body.config.ramGb ?? 0}GB RAM`;

  const { error } = await supabase.from("hosting_plans").insert({
    name,
    location: body.config.location ?? "Miami",
    cores: body.config.cores ?? 0,
    ram_gb: body.config.ramGb ?? 0,
    storage_gb: body.config.storageGb ?? 0,
    price_eur: monthlyPrice,
    monthly_revenue_eur: monthlyPrice,
    status: "active",
    client_name: body.clientName ?? null,
    client_email: body.clientEmail ?? null,
    client_ip: clientIp ?? null,
    operating_system: body.config.operatingSystem ?? null,
    billing_period: body.config.billingPeriod ?? null
  });

  if (error) {
    return NextResponse.json(
      {
        error: "Error al insertar la VPS en hosting_plans.",
        details: error.message
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true
  });
}

