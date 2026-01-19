"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faSpinner } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "../../../lib/supabaseClient";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    if (!supabaseClient) {
      setError("Error de configuración: Supabase no está inicializado.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        throw error;
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Error al crear cuenta");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section className="flex items-center justify-center py-10">
        <div className="w-full max-w-md rounded-3xl bg-white/90 p-8 shadow-xl shadow-fylo-500/10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <FontAwesomeIcon icon={faUserPlus} className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">¡Cuenta creada!</h1>
          <p className="mt-2 text-sm text-slate-600">
            Hemos enviado un enlace de confirmación a <span className="font-semibold text-slate-900">{email}</span>.
            Por favor verifica tu bandeja de entrada.
          </p>
          <Link
            href="/auth/login"
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-fylo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-fylo-500/40 hover:bg-fylo-600"
          >
            Ir a Iniciar Sesión
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="flex items-center justify-center py-10">
      <div className="grid w-full max-w-3xl gap-8 rounded-3xl bg-white/90 p-6 shadow-xl shadow-fylo-500/10 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] sm:p-8">
        <div className="space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full bg-fylo-50 px-3 py-1 text-xs font-medium text-fylo-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Crea tu cuenta Fylo
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Empieza a gestionar tu VPS con Fylo
          </h1>
          <p className="text-sm text-slate-600">
            Regístrate para acceder al panel de compra, ver tu facturación y
            aprovechar el asistente de Fylo en todas tus decisiones.
          </p>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-xs text-red-600 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                Nombre completo
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-fylo-100 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-fylo-500/10 placeholder:text-slate-400 focus:border-fylo-400 focus:ring-2"
                placeholder="Nombre y apellidos"
              />
            </div>
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
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Contraseña
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-fylo-100 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-fylo-500/10 placeholder:text-slate-400 focus:border-fylo-400 focus:ring-2"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Repetir contraseña
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-fylo-100 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-fylo-500/10 placeholder:text-slate-400 focus:border-fylo-400 focus:ring-2"
                  placeholder="Confirma tu contraseña"
                />
              </div>
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
                  <FontAwesomeIcon icon={faUserPlus} className="h-4 w-4" />
                  Crear cuenta en Fylo
                </>
              )}
            </button>
          </form>
          <p className="pt-2 text-xs text-slate-600">
            ¿Ya tienes una cuenta?{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-fylo-700 hover:text-fylo-800"
            >
              Inicia sesión aquí
            </Link>
            .
          </p>
        </div>
        <div className="hidden flex-col justify-between rounded-2xl bg-gradient-to-br from-fylo-500 to-emerald-500 p-5 text-white sm:flex">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wide text-fylo-50/80">
              Cuentas de cliente
            </p>
            <p className="text-lg font-semibold">
              Diseñado para la experiencia de tus clientes finales.
            </p>
            <p className="text-xs text-fylo-50/90">
              Integra este flujo con tu sistema de autenticación para convertirlo
              en el acceso principal al panel de compra de tu VPS.
            </p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
            <div className="rounded-xl bg-white/10 p-3">
              <p className="text-fylo-50/80">Clientes VPS</p>
              <p className="text-xl font-semibold">5.2K+</p>
            </div>
            <div className="rounded-xl bg-white/10 p-3">
              <p className="text-fylo-50/80">Retención</p>
              <p className="text-xl font-semibold">98%</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
