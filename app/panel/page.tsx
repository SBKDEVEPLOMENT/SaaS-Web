"use client";

import { useEffect, useState } from "react";
import { RealtimePlansTable } from "../../components/RealtimePlansTable";
import { RevenueChart } from "../../components/RevenueChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faWallet, 
  faServer, 
  faUsers, 
  faBolt
} from "@fortawesome/free-solid-svg-icons";
import { supabaseClient } from "../../lib/supabaseClient";

type DashboardStats = {
  mrr_eur: number;
  active_vps: number;
  clientes_con_pedidos: number;
};

type RevenuePoint = {
  name: string;
  revenue: number;
};

export default function PanelPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [revenue, setRevenue] = useState<RevenuePoint[]>([]);
  const [revenueError, setRevenueError] = useState<string | null>(null);
  const [revenueLoading, setRevenueLoading] = useState(true);

  useEffect(() => {
    if (!supabaseClient) {
      setStatsError("Supabase no está configurado.");
      setStatsLoading(false);
      setRevenueLoading(false);
      return;
    }

    const loadStats = async () => {
      const { data, error } = await supabaseClient
        .from("dashboard_stats")
        .select("*")
        .single();

      if (error) {
        setStatsError("No se pudieron cargar las métricas del panel.");
      } else {
        setStats(data as DashboardStats);
      }
      setStatsLoading(false);
    };

    const loadRevenue = async () => {
      const { data, error } = await supabaseClient
        .from("dashboard_revenue_monthly")
        .select("month_label, revenue_eur, month_start")
        .order("month_start", { ascending: true });

      if (error) {
        setRevenueError("No se pudo cargar la evolución de ingresos.");
      } else if (data) {
        const mapped: RevenuePoint[] = data.map((row: any) => ({
          name: row.month_label,
          revenue: Number(row.revenue_eur) || 0
        }));
        setRevenue(mapped);
      }
      setRevenueLoading(false);
    };

    loadStats();
    loadRevenue();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Ejecutivo</h1>
        <p className="text-sm text-slate-500">Resumen de rendimiento y operaciones en tiempo real.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Ingresos Mensuales (MRR)</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {statsLoading ? "…" : `€ ${stats ? stats.mrr_eur.toFixed(2) : "0.00"}`}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-fylo-50 text-fylo-600">
              <FontAwesomeIcon icon={faWallet} className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-500">
            {statsError ? statsError : "Basado en las VPS registradas en hosting_plans."}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">VPS Activas</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {statsLoading ? "…" : stats ? stats.active_vps : 0}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <FontAwesomeIcon icon={faServer} className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-500">
            Conteo directo de filas activas en hosting_plans.
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Total Clientes</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {statsLoading ? "…" : stats ? stats.clientes_con_pedidos : 0}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FontAwesomeIcon icon={faUsers} className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-500">
            Correos únicos con al menos una orden registrada.
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Uptime Global</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">N/D</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <FontAwesomeIcon icon={faBolt} className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-500">
            Este dato requiere una fuente externa de monitorización.
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Evolución de Ingresos</h3>
              <p className="text-xs text-slate-500">Basado en los registros reales de hosting_plans.</p>
            </div>
          </div>
          {revenueLoading ? (
            <div className="flex h-[300px] items-center justify-center text-xs text-slate-500">
              Cargando datos de ingresos...
            </div>
          ) : revenueError ? (
            <div className="flex h-[300px] items-center justify-center text-xs text-red-600">
              {revenueError}
            </div>
          ) : revenue.length === 0 ? (
            <div className="flex h-[300px] items-center justify-center text-xs text-slate-500">
              Aún no hay datos de ingresos. Crea alguna VPS desde el configurador.
            </div>
          ) : (
            <RevenueChart data={revenue} />
          )}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Estado del Sistema</h3>
          <p className="mb-6 text-xs text-slate-500">Métricas de salud de la infraestructura global.</p>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-600">CPU Global (demo)</span>
                <span className="text-slate-900">N/D</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[40%] rounded-full bg-fylo-500" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-600">Memoria RAM (demo)</span>
                <span className="text-slate-900">N/D</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[30%] rounded-full bg-emerald-500" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-600">Almacenamiento NVMe (demo)</span>
                <span className="text-slate-900">N/D</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[20%] rounded-full bg-blue-500" />
              </div>
            </div>

            <div className="rounded-xl bg-fylo-50 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Indicadores técnicos</p>
                  <p className="text-xs text-slate-600">
                    Estos indicadores son de demostración. Los datos de negocio sí son reales.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="border-b border-slate-100 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">Órdenes Recientes</h3>
          <p className="text-xs text-slate-500">Monitoreo en tiempo real de nuevas provisiones de VPS.</p>
        </div>
        <div className="p-0">
          <RealtimePlansTable />
        </div>
      </div>
    </div>
  );
}
