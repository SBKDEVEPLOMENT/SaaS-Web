"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightToBracket, faSpinner } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "../../../lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!supabaseClient) {
      setError("Error de configuración: Supabase no está inicializado.");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      const user = data.user;
      const metadata = (user as any)?.user_metadata || {};
      const role = (metadata.role ?? "").toString().toLowerCase();
      const isAdminFlag =
        metadata.is_admin === true ||
        metadata.is_admin === "true" ||
        metadata.is_admin === 1;
      const isAdmin = isAdminFlag || role === "admin";

      if (isAdmin) {
        router.push("/panel");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center py-10">
      <div className="grid w-full max-w-3xl gap-8 rounded-3xl bg-white/90 p-6 shadow-xl shadow-fylo-500/10 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] sm:p-8">
        <div className="space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full bg-fylo-50 px-3 py-1 text-xs font-medium text-fylo-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Acceso seguro al panel de Fylo
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Inicia sesión en tu cuenta Fylo
          </h1>
          <p className="text-sm text-slate-600">
            Gestiona tus servidores, facturación y planes VPS desde un panel
            profesional. Usa tu correo corporativo para entrar.
          </p>
          
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-xs text-red-600 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                Correo electrónico
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-fylo-100 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-fylo-500/10 placeholder:text-slate-400 focus:border-fylo-400 focus:ring-2"
                placeholder="tucorreo@empresa.com"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-700">
                  Contraseña
                </label>
                <a
                  href="#"
                  className="text-[10px] font-medium text-fylo-600 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-fylo-100 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-fylo-500/10 placeholder:text-slate-400 focus:border-fylo-400 focus:ring-2"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-fylo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-fylo-500/40 hover:bg-fylo-600 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <FontAwesomeIcon icon={faArrowRightToBracket} className="h-4 w-4" />
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>
          <p className="pt-2 text-xs text-slate-600">
            ¿Aún no tienes cuenta?{" "}
            <Link
              href="/auth/register"
              className="font-semibold text-fylo-700 hover:text-fylo-800"
            >
              Crea una cuenta en Fylo
            </Link>
            .
          </p>
        </div>
        <div className="hidden flex-col justify-between rounded-2xl bg-gradient-to-br from-fylo-500 to-emerald-500 p-5 text-white sm:flex">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wide text-fylo-50/80">
              Panel ejecutivo de VPS
            </p>
            <p className="text-lg font-semibold">
              Controla tu infraestructura cloud con un panel moderno y seguro.
            </p>
            <p className="text-xs text-fylo-50/90">
              Visualiza planes en tiempo real, supervisa consumos y colabora con
              tu equipo técnico desde un único lugar.
            </p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
            <div className="rounded-xl bg-white/10 p-3">
              <p className="text-fylo-50/80">Accesos internos</p>
              <p className="text-xl font-semibold">SAML / SSO</p>
            </div>
            <div className="rounded-xl bg-white/10 p-3">
              <p className="text-fylo-50/80">Seguridad</p>
              <p className="text-xl font-semibold">2FA</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
