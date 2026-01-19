import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";

export default function UsersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Clientes</h1>
        <p className="text-sm text-slate-500">Gestión de usuarios y clientes registrados.</p>
      </div>

      <div className="rounded-xl border border-dashed border-fylo-200 bg-white/50 p-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-fylo-50 text-fylo-300">
          <FontAwesomeIcon icon={faUsers} className="h-8 w-8" />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-slate-900">Módulo de Clientes en construcción</h3>
        <p className="mt-1 text-sm text-slate-500">
          Próximamente podrás gestionar los datos de facturación y perfiles de usuarios aquí.
        </p>
      </div>
    </div>
  );
}
