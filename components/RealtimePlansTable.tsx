'use client';

import { useEffect, useState } from "react";
import { supabaseClient } from "../lib/supabaseClient";

type HostingPlanRow = {
  id: string;
  name: string;
  location: string;
  cores: number;
  ram_gb: number;
  storage_gb: number;
  price_eur: number;
  status: string | null;
  created_at?: string;
  client_name?: string;
  client_email?: string;
  client_ip?: string;
  monthly_revenue_eur?: number;
  operating_system?: string;
  billing_period?: string;
};

export function RealtimePlansTable() {
  const [plans, setPlans] = useState<HostingPlanRow[]>([]);
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    const client = supabaseClient;
    if (!client) {
      setReady(true);
      return;
    }

    client
      .from("hosting_plans")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          setPlans(data as HostingPlanRow[]);
        }
        setReady(true);
      });

    const channel = client
      .channel("hosting_plans_realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "hosting_plans"
        },
        (payload) => {
          setPlans((current) => {
            if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
              const row = payload.new as HostingPlanRow;
              const without = current.filter((p) => p.id !== row.id);
              return [row, ...without];
            }
            if (payload.eventType === "DELETE") {
              const row = payload.old as HostingPlanRow;
              return current.filter((p) => p.id !== row.id);
            }
            return current;
          });
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, []);

  if (!supabaseClient) {
    return (
      <div className="rounded-xl border border-dashed border-fylo-200 bg-white/80 p-4 text-xs text-slate-600">
        Conecta tu base de datos en tiempo real configurando{" "}
        <span className="font-mono text-slate-900">
          NEXT_PUBLIC_SUPABASE_URL
        </span>{" "}
        y{" "}
        <span className="font-mono text-slate-900">
          NEXT_PUBLIC_SUPABASE_ANON_KEY
        </span>{" "}
        en Vercel. La tabla esperada es{" "}
        <span className="font-mono text-slate-900">public.hosting_plans</span>{" "}
        con columnas como{" "}
        <span className="font-mono text-slate-900">
          client_name, client_email, client_ip, operating_system, ram_gb, price_eur
        </span>
        .
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="rounded-xl border border-fylo-100 bg-white/80 p-4 text-xs text-slate-600">
        Cargando planes en tiempo real desde la base de datos...
      </div>
    );
  }

  if (!plans.length) {
    return (
      <div className="rounded-xl border border-fylo-100 bg-white/80 p-4 text-xs text-slate-600">
        No hay planes registrados aún. Inserta filas en{" "}
        <span className="font-mono text-slate-900">public.hosting_plans</span> y
        verás los cambios aquí en tiempo real.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-fylo-100 bg-white">
      <div className="border-b border-fylo-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-700">
        Clientes y planes activos (tiempo real)
      </div>
      <div className="max-h-80 overflow-y-auto overflow-x-auto text-xs sm:text-sm">
        <table className="min-w-full divide-y divide-fylo-100">
          <thead className="bg-fylo-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-slate-400">
                Cliente
              </th>
              <th className="hidden px-4 py-2 text-left font-medium text-slate-400 md:table-cell">
                Correo
              </th>
              <th className="hidden px-4 py-2 text-left font-medium text-slate-400 lg:table-cell">
                IP
              </th>
              <th className="hidden px-4 py-2 text-left font-medium text-slate-400 xl:table-cell">
                SO
              </th>
              <th className="px-4 py-2 text-left font-medium text-slate-400">
                Ubicación
              </th>
              <th className="px-4 py-2 text-left font-medium text-slate-400">
                Cores
              </th>
              <th className="px-4 py-2 text-left font-medium text-slate-400">
                RAM
              </th>
              <th className="px-4 py-2 text-left font-medium text-slate-400">
                NVMe
              </th>
              <th className="px-4 py-2 text-left font-medium text-slate-400">
                Importe mensual
              </th>
              <th className="px-4 py-2 text-left font-medium text-slate-400">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-fylo-50">
            {plans.map((plan) => (
              <tr key={plan.id} className="hover:bg-fylo-50/60">
                <td className="px-4 py-2 text-slate-900">
                  {plan.client_name ?? plan.name}
                </td>
                <td className="px-4 py-2 text-slate-700">
                  {plan.client_email ?? "N/D"}
                </td>
                <td className="px-4 py-2 text-slate-700">
                  {plan.client_ip ?? "N/D"}
                </td>
                <td className="hidden px-4 py-2 text-slate-700 xl:table-cell">
                  {plan.operating_system ?? "N/D"}
                </td>
                <td className="px-4 py-2 text-slate-700">{plan.location}</td>
                <td className="px-4 py-2 text-slate-700">{plan.cores}</td>
                <td className="px-4 py-2 text-slate-700">
                  {plan.ram_gb} GB
                </td>
                <td className="px-4 py-2 text-slate-700">
                  {plan.storage_gb} GB
                </td>
                <td className="px-4 py-2 text-fylo-700">
                  €
                  {" "}
                  {(plan.monthly_revenue_eur ?? plan.price_eur).toFixed(2)}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      plan.status === "active"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : "bg-slate-100 text-slate-700 border border-slate-200"
                    }`}
                  >
                    {plan.status ?? "pendiente"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
