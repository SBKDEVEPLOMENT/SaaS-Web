"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faServer,
  faRobot,
  faCircleCheck,
  faCircleXmark,
  faShieldHalved,
  faUserShield,
  faGlobe,
  faToggleOn,
  faToggleOff,
  faDatabase
} from "@fortawesome/free-solid-svg-icons";
import { supabaseClient } from "../../../lib/supabaseClient";

type Tab = "general" | "security" | "integrations";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [user, setUser] = useState<any>(null);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  
  // Status states
  const [dbStatus, setDbStatus] = useState<"checking" | "ok" | "error">("checking");
  const [aiStatus, setAiStatus] = useState<"checking" | "ok" | "error">("checking");

  useEffect(() => {
    const checkSystem = async () => {
      // Check Supabase
      if (supabaseClient) {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session) {
            setUser(session.user);
            setDbStatus("ok");
        } else {
            // Even if no session, client might be ok, but we need session for admin panel
            setDbStatus("ok"); 
        }
      } else {
        setDbStatus("error");
      }

      // Check AI
      try {
        const response = await fetch("/api/ai-assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: "Ping" })
        });
        if (response.ok) setAiStatus("ok");
        else setAiStatus("error");
      } catch (e) {
        setAiStatus("error");
      }
    };

    checkSystem();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Ajustes del Sistema</h1>
        <p className="text-sm text-slate-500">
          Configuración global de la plataforma Fylo SaaS.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "general", label: "General" },
            { id: "security", label: "Seguridad y Accesos" },
            { id: "integrations", label: "Integraciones" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                activeTab === tab.id
                  ? "border-fylo-500 text-fylo-600"
                  : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === "general" && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h3 className="text-base font-semibold text-slate-900">Estado de la Plataforma</h3>
              <p className="mt-1 text-sm text-slate-500">Controla la disponibilidad del servicio para los usuarios.</p>
              
              <div className="mt-6 flex items-center justify-between py-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                        <FontAwesomeIcon icon={faGlobe} />
                    </div>
                    <div>
                        <p className="font-medium text-slate-900">Sitio Público</p>
                        <p className="text-xs text-slate-500">Visible para todos los visitantes</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                        Operativo
                    </span>
                </div>
              </div>

              <div className="flex items-center justify-between py-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                        <FontAwesomeIcon icon={maintenanceMode ? faToggleOn : faToggleOff} className={maintenanceMode ? "text-fylo-600" : "text-slate-400"} />
                    </div>
                    <div>
                        <p className="font-medium text-slate-900">Modo Mantenimiento</p>
                        <p className="text-xs text-slate-500">Desactiva el acceso a usuarios no administradores</p>
                    </div>
                </div>
                <button 
                    onClick={() => setMaintenanceMode(!maintenanceMode)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-fylo-600 focus:ring-offset-2 ${maintenanceMode ? 'bg-fylo-600' : 'bg-slate-200'}`}
                >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${maintenanceMode ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h3 className="text-base font-semibold text-slate-900">Tu Sesión Actual</h3>
              <div className="mt-6 flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-fylo-100 text-fylo-600">
                    <FontAwesomeIcon icon={faUserShield} className="h-6 w-6" />
                </div>
                <div>
                    <p className="font-medium text-slate-900">Administrador</p>
                    <p className="text-sm text-slate-500">{user?.email}</p>
                    <p className="mt-1 text-xs text-slate-400">ID: {user?.id}</p>
                    <div className="mt-2 inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                        <FontAwesomeIcon icon={faShieldHalved} className="h-3 w-3" />
                        Acceso Total
                    </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "integrations" && (
            <div className="grid gap-6 md:grid-cols-2">
                {/* Supabase Status */}
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <FontAwesomeIcon icon={faDatabase} />
                            </div>
                            <div>
                                <h4 className="font-medium text-slate-900">Base de Datos</h4>
                                <p className="text-xs text-slate-500">Supabase PostgreSQL</p>
                            </div>
                        </div>
                        {dbStatus === "ok" ? (
                             <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-500" />
                        ) : (
                             <FontAwesomeIcon icon={faCircleXmark} className="text-red-500" />
                        )}
                    </div>
                    <div className="text-xs text-slate-500 space-y-2">
                        <div className="flex justify-between">
                            <span>Conexión</span>
                            <span className="font-mono text-slate-900">{dbStatus === "ok" ? "Activa" : "Inactiva"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>URL</span>
                            <span className="font-mono text-slate-900">
                                {process.env.NEXT_PUBLIC_SUPABASE_URL ? "Configurada" : "Faltante"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* AI Status */}
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                                <FontAwesomeIcon icon={faRobot} />
                            </div>
                            <div>
                                <h4 className="font-medium text-slate-900">Inteligencia Artificial</h4>
                                <p className="text-xs text-slate-500">Google Gemini Flash</p>
                            </div>
                        </div>
                        {aiStatus === "ok" ? (
                             <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-500" />
                        ) : (
                             <FontAwesomeIcon icon={faCircleXmark} className="text-red-500" />
                        )}
                    </div>
                    <div className="text-xs text-slate-500 space-y-2">
                        <div className="flex justify-between">
                            <span>API Status</span>
                            <span className="font-mono text-slate-900">{aiStatus === "ok" ? "Online" : "Offline"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Modelo</span>
                            <span className="font-mono text-slate-900">gemini-1.5-flash</span>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
