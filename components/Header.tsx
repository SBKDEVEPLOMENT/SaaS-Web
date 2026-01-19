"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabaseClient } from "../lib/supabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabaseClient) {
      setLoading(false);
      return;
    }

    const getUser = async () => {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);

      const { data: authListener } = supabaseClient.auth.onAuthStateChange(
        (event, session) => {
          setUser(session?.user ?? null);
        }
      );

      return () => {
        authListener.subscription.unsubscribe();
      };
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
      router.refresh();
      setUser(null);
    }
  };

  return (
    <header className="flex items-center justify-between py-6">
      <Link href="/" className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-fylo-500 text-xl font-bold text-white shadow-md shadow-fylo-500/40">
          F
        </div>
        <div>
          <p className="text-sm font-semibold tracking-wide text-slate-900">
            Fylo Cloud VPS
          </p>
          <p className="text-xs text-slate-500">
            Panel profesional para tus VPS y proyectos en la nube.
          </p>
        </div>
      </Link>
      <nav className="flex items-center gap-3 text-xs font-medium text-slate-700 sm:text-sm">
        <Link
          href="/"
          className="rounded-full px-3 py-1 hover:bg-fylo-50 hover:text-fylo-700"
        >
          Inicio
        </Link>
        {!loading && (
          <>
            {user ? (
              <>
                <Link
                  href="/panel"
                  className="hidden rounded-full border border-fylo-200 px-3 py-1 text-fylo-700 hover:bg-fylo-50 sm:inline-flex"
                >
                  <FontAwesomeIcon icon={faUserCircle} className="mr-2 h-3 w-3" />
                  Mi Panel
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 sm:text-sm"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 h-3 w-3" />
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="hidden rounded-full border border-fylo-200 px-3 py-1 text-fylo-700 hover:bg-fylo-50 sm:inline-flex"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center rounded-full bg-fylo-500 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-fylo-500/40 hover:bg-fylo-600 sm:text-sm"
                >
                  Crear cuenta
                </Link>
              </>
            )}
          </>
        )}
      </nav>
    </header>
  );
}
