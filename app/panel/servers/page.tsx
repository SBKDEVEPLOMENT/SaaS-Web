import { RealtimePlansTable } from "../../../components/RealtimePlansTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faServer } from "@fortawesome/free-solid-svg-icons";

export default function ServersPage() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Servidores VPS</h1>
        <p className="text-sm text-slate-500">Gestión y monitoreo de todas las instancias VPS activas.</p>
      </div>

      {/* Stats Summary (Optional, can be added later) */}
      <div className="rounded-xl border border-fylo-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-fylo-50 text-fylo-600">
            <FontAwesomeIcon icon={faServer} className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Listado de Instancias</h3>
            <p className="text-xs text-slate-500">
              Aquí puedes ver en tiempo real las nuevas VPS creadas desde el configurador.
            </p>
          </div>
        </div>
      </div>

      {/* Realtime Table */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="p-0">
          <RealtimePlansTable />
        </div>
      </div>
    </div>
  );
}
