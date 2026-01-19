'use client';

import { useMemo, useState } from "react";

type Location = "Miami" | "Francia";

type OperatingSystem = "Ubuntu 22.04 LTS" | "Debian 12" | "Windows Server 2022";

export type PlanConfig = {
  location: Location;
  operatingSystem: OperatingSystem;
  cores: number;
  ramGb: number;
  storageGb: number;
  billingPeriod: "mensual" | "anual";
};

type Props = {
  onConfigChange?: (config: PlanConfig, price: number) => void;
};

function calculatePrice(config: PlanConfig): number {
  const basePerCore = 3;
  const basePerRamGb = 1;
  const basePerStorageGb = 0.15;
  const locationMultiplier = config.location === "Miami" ? 1.05 : 1.0;
  const osLicense =
    config.operatingSystem === "Windows Server 2022" ? 15 : 0;
  const raw =
    config.cores * basePerCore +
    config.ramGb * basePerRamGb +
    config.storageGb * basePerStorageGb;
  const monthly = raw * locationMultiplier + osLicense;
  if (config.billingPeriod === "anual") {
    return monthly * 12 * 0.9;
  }
  return monthly;
}

export function PlanConfigurator({ onConfigChange }: Props) {
  const [config, setConfig] = useState<PlanConfig>({
    location: "Miami",
    operatingSystem: "Ubuntu 22.04 LTS",
    cores: 4,
    ramGb: 8,
    storageGb: 200,
    billingPeriod: "mensual"
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const price = useMemo(() => calculatePrice(config), [config]);

  const updateConfig = <K extends keyof PlanConfig>(key: K, value: PlanConfig[K]) => {
    const next = { ...config, [key]: value };
    setConfig(next);
    if (onConfigChange) {
      onConfigChange(next, calculatePrice(next));
    }
  };

  const handleOrder = async () => {
    if (saving) {
      return;
    }
    setSaving(true);
    setSaveError(null);
    setSaved(false);

    try {
      const response = await fetch("/api/hosting-plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          config,
          price
        })
      });

      if (!response.ok) {
        throw new Error("No se pudo registrar la VPS en el panel administrativo.");
      }

      setSaved(true);
      setTimeout(() => {
        setSaved(false);
      }, 4000);
    } catch (e) {
      setSaveError(
        e instanceof Error
          ? e.message
          : "Ha ocurrido un error al registrar la VPS."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
            Configurador de VPS Fylo
          </h2>
          <p className="text-xs text-slate-500 sm:text-sm">
            Ajusta recursos, sistema operativo y periodo de facturación en tiempo real.
          </p>
        </div>
        <span className="rounded-full border border-fylo-100 bg-fylo-50 px-3 py-1 text-[11px] font-medium text-fylo-700">
          Precio dinámico
        </span>
      </div>

      <div className="grid gap-4 text-xs sm:grid-cols-2 sm:text-sm">
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-800">
            Ubicación del servidor
          </label>
          <select
            className="w-full rounded-xl border border-fylo-100 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-fylo-400 focus:ring-2 focus:ring-fylo-100"
            value={config.location}
            onChange={(e) => updateConfig("location", e.target.value as Location)}
          >
            <option value="Miami">Miami, USA</option>
            <option value="Francia">Francia, EU</option>
          </select>
          <p className="text-[11px] text-slate-500">
            Miami ideal para Latinoamérica, Francia para Europa.
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-800">
            Sistema operativo de la VPS
          </label>
          <select
            className="w-full rounded-xl border border-fylo-100 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-fylo-400 focus:ring-2 focus:ring-fylo-100"
            value={config.operatingSystem}
            onChange={(e) =>
              updateConfig("operatingSystem", e.target.value as OperatingSystem)
            }
          >
            <option value="Ubuntu 22.04 LTS">Ubuntu 22.04 LTS (recomendado)</option>
            <option value="Debian 12">Debian 12</option>
            <option value="Windows Server 2022">Windows Server 2022 (+licencia)</option>
          </select>
          <p className="text-[11px] text-slate-500">
            Linux ideal para la mayoría de APIs y webs; Windows para cargas específicas.
          </p>
        </div>
      </div>

      <div className="grid gap-4 text-xs sm:grid-cols-2 sm:text-sm">
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-800">
            Periodo de facturación
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => updateConfig("billingPeriod", "mensual")}
              className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium ${
                config.billingPeriod === "mensual"
                  ? "border-fylo-400 bg-fylo-50 text-fylo-700"
                  : "border-fylo-100 bg-white text-slate-700 hover:border-fylo-300"
              }`}
            >
              Mensual
            </button>
            <button
              type="button"
              onClick={() => updateConfig("billingPeriod", "anual")}
              className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium ${
                config.billingPeriod === "anual"
                  ? "border-fylo-400 bg-fylo-50 text-fylo-700"
                  : "border-fylo-100 bg-white text-slate-700 hover:border-fylo-300"
              }`}
            >
              Anual (-10%)
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 text-xs sm:grid-cols-3 sm:text-sm">
        <div className="space-y-2">
          <label className="flex items-center justify-between text-xs font-semibold text-slate-800">
            Cores dedicados
            <span className="text-[11px] text-slate-500">{config.cores} vCPU</span>
          </label>
          <input
            type="range"
            min={2}
            max={32}
            step={2}
            value={config.cores}
            onChange={(e) => updateConfig("cores", Number(e.target.value))}
            className="w-full accent-fylo-500"
          />
          <p className="text-[11px] text-slate-500">
            3 €/mes por core dedicado.
          </p>
        </div>
        <div className="space-y-2">
          <label className="flex items-center justify-between text-xs font-semibold text-slate-800">
            RAM
            <span className="text-[11px] text-slate-500">{config.ramGb} GB</span>
          </label>
          <input
            type="range"
            min={4}
            max={256}
            step={4}
            value={config.ramGb}
            onChange={(e) => updateConfig("ramGb", Number(e.target.value))}
            className="w-full accent-fylo-500"
          />
          <p className="text-[11px] text-slate-500">
            1 €/mes por GB de RAM asignado.
          </p>
        </div>
        <div className="space-y-2">
          <label className="flex items-center justify-between text-xs font-semibold text-slate-800">
            Almacenamiento NVMe
            <span className="text-[11px] text-slate-500">{config.storageGb} GB</span>
          </label>
          <input
            type="range"
            min={100}
            max={4000}
            step={100}
            value={config.storageGb}
            onChange={(e) => updateConfig("storageGb", Number(e.target.value))}
            className="w-full accent-fylo-500"
          />
          <p className="text-[11px] text-slate-500">
            0.15 €/mes por GB NVMe.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="mt-2 flex flex-col gap-3 rounded-xl border border-fylo-100 bg-fylo-50 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-600">
              Total estimado {config.billingPeriod === "mensual" ? "mensual" : "anual"}
            </p>
            <p className="text-lg font-semibold text-fylo-700">
              € {price.toFixed(2)}{" "}
              <span className="text-xs font-normal text-slate-600">
                {config.billingPeriod === "mensual" ? "/mes" : "/año"}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={handleOrder}
            disabled={saving}
            className="inline-flex items-center justify-center rounded-lg bg-fylo-500 px-4 py-2 text-xs font-medium text-white shadow-md shadow-fylo-500/40 hover:bg-fylo-600 disabled:opacity-60"
          >
            {saving ? "Creando VPS..." : "Crear VPS en Fylo"}
          </button>
        </div>
        {saved && (
          <p className="text-[11px] text-emerald-600">
            VPS registrada correctamente. Verás el movimiento en el panel administrativo en tiempo real.
          </p>
        )}
        {saveError && (
          <p className="text-[11px] text-red-600">
            {saveError}
          </p>
        )}
      </div>
    </div>
  );
}
