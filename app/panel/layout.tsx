"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faChartPie, 
  faServer, 
  faUsers, 
  faCog, 
  faSignOutAlt,
  faBars,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "../../lib/supabaseClient";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      if (!supabaseClient) {
        setConfigError(
          "Error de configuración: Supabase no está inicializado. Revisa NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY."
        );
        setLoading(false);
        return;
      }

      const {
        data: { session }
      } = await supabaseClient.auth.getSession();

      if (!session) {
        router.push("/auth/login");
        return;
      }

      const metadata = (session.user as any).user_metadata || {};
      const role = (metadata.role ?? "").toString().toLowerCase();
      const isAdminFlag =
        metadata.is_admin === true ||
        metadata.is_admin === "true" ||
        metadata.is_admin === 1;
      const isAdmin = isAdminFlag || role === "admin";

      if (!isAdmin) {
        router.push("/auth/login");
        return;
      }

      setUserEmail(session.user.email ?? "admin@fylo.com");
      setLoading(false);
    };

    checkSession();
  }, [router]);

  const handleLogout = async () => {
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
      router.push("/auth/login");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} className="h-8 w-8 animate-spin text-fylo-600" />
          <p className="mt-4 text-sm font-medium text-slate-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  if (configError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="max-w-md rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-semibold text-red-600">{configError}</p>
          <p className="mt-2 text-xs text-slate-600">
            Configura correctamente tu proyecto de Supabase para habilitar el panel administrativo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar Desktop */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-slate-200 bg-white shadow-sm lg:flex">
        <div className="flex h-16 items-center px-6 border-b border-slate-100">
          <div className="flex items-center gap-2 text-fylo-700">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-fylo-600 text-white font-bold">
              F
            </div>
            <span className="text-lg font-bold tracking-tight">Fylo Admin</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-6">
          <Link href="/panel" className="group flex items-center gap-3 rounded-lg bg-fylo-50 px-3 py-2 text-sm font-medium text-fylo-700">
            <FontAwesomeIcon icon={faChartPie} className="h-4 w-4 text-fylo-600" />
            Dashboard
          </Link>
          <Link href="/panel/servers" className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900">
            <FontAwesomeIcon icon={faServer} className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
            Servidores VPS
          </Link>
          <Link href="/panel/users" className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900">
            <FontAwesomeIcon icon={faUsers} className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
            Clientes
          </Link>
          <div className="pt-4">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Configuración
            </p>
            <Link href="/panel/settings" className="mt-2 group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900">
              <FontAwesomeIcon icon={faCog} className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
              Ajustes del Sistema
            </Link>
          </div>
        </nav>

        <div className="border-t border-slate-100 p-4">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="h-4 w-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:pl-64 transition-all duration-300">
        {/* Top Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md">
          <div className="flex items-center gap-4 lg:hidden">
            <button className="text-slate-500 hover:text-slate-700">
              <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
            </button>
            <span className="font-semibold text-slate-900">Fylo Admin</span>
          </div>
          
          <div className="hidden lg:block">
            <h2 className="text-sm font-medium text-slate-500">
              Vista General
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
              <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-fylo-500 to-emerald-400" />
              <div className="text-xs">
                <p className="font-medium text-slate-700">Admin Ejecutivo</p>
                <p className="text-[10px] text-slate-500">{userEmail}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
