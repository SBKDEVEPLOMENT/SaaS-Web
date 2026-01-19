import "./globals.css";
import type { ReactNode } from "react";
import { AiAssistant } from "../components/AiAssistant";
import { Header } from "../components/Header";

export const metadata = {
  title: "Fylo VPS | Cloud para tus proyectos",
  description: "Panel profesional para gestionar VPS en la nube de Fylo."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen text-slate-900">
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4">
          <Header />
          <main className="flex-1 pb-10">{children}</main>
          <footer className="border-t border-fylo-100 py-6 text-xs text-slate-500">
            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
              <p>© {new Date().getFullYear()} Fylo VPS. Todos los derechos reservados.</p>
              <p className="text-slate-500">
              </p>
            </div>
          </footer>
        </div>
        <AiAssistant />
      </body>
    </html>
  );
}
