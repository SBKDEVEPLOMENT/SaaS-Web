import Image from "next/image";
import { PlanConfigurator } from "../components/PlanConfigurator";

export default function HomePage() {
  return (
    <section className="grid gap-8 py-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1.1fr)] md:items-start lg:gap-10">
      <div className="space-y-6 lg:space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-fylo-100 bg-fylo-50 px-3 py-1 text-xs font-medium text-fylo-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Plataforma de compra de VPS Fylo
        </div>
        <div className="space-y-4">
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            VPS rápidas y listas para cualquier proyecto.
          </h1>
          <p className="max-w-xl text-sm text-slate-600 sm:text-base">
            Elige ubicación, sistema operativo y recursos y deja que Fylo se encargue
            del resto. Diseñado para proyectos web, profesionales y listos para producción.
          </p>
        </div>
        <dl
          id="caracteristicas"
          className="grid gap-6 text-xs text-slate-600 sm:grid-cols-3 sm:text-sm"
        >
          <div>
            <dt className="mb-1 text-sm font-semibold text-slate-900">
              Centros de datos premium
            </dt>
            <dd>
              Miami y Francia para ofrecer baja latencia a tus usuarios en
              América y Europa.
            </dd>
          </div>
          <div>
            <dt className="mb-1 text-sm font-semibold text-slate-900">
              Precios transparentes
            </dt>
            <dd>1 €/GB de RAM y precios proporcionales para CPU y NVMe.</dd>
          </div>
          <div>
            <dt className="mb-1 text-sm font-semibold text-slate-900">
              Asistente de Fylo
            </dt>
            <dd>
              Un asistente dedicado guía a tus clientes en tiempo real para
              elegir el mejor plan.
            </dd>
          </div>
        </dl>
      </div>
      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-3xl border border-fylo-100 bg-white shadow-xl shadow-fylo-500/10">
          <div className="absolute inset-0 bg-gradient-to-tr from-fylo-50 via-white to-fylo-100" />
          <div className="relative space-y-4 p-5 sm:p-6">
            <div className="relative h-32 w-full overflow-hidden rounded-2xl sm:h-40">
              <Image
                src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80"
                alt="Panel de control de servidores Fylo"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-fylo-600">
                Configurador en tiempo real
              </p>
              <p className="text-sm font-semibold text-slate-900 sm:text-base">
                Define el plan ideal y calcula el precio al instante.
              </p>
              <p className="text-xs text-slate-600 sm:text-sm">
                Ajusta cores, RAM y almacenamiento NVMe para ver cómo evoluciona
                tu factura mensual o anual.
              </p>
            </div>
            <div className="border-t border-fylo-100 pt-4">
              <PlanConfigurator />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
