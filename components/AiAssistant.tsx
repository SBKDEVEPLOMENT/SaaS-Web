'use client';

import { useEffect, useRef, useState } from "react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export function AiAssistant() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen || messages.length > 0) {
      return;
    }
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hola, soy el asistente virtual de Fylo. Cuéntame qué proyecto tienes y te ayudo a elegir el plan de hosting adecuado."
      }
    ]);
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim()
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const resp = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!resp.ok) {
        let backendError = "Error al consultar al asistente de Fylo";
        try {
          const data = (await resp.json()) as { error?: string };
          if (data && data.error) {
            backendError = data.error;
          }
        } catch {
        }
        throw new Error(backendError);
      }

      const data = (await resp.json()) as { answer: string };

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.answer
      };

      setMessages((current) => [...current, assistantMessage]);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Ha ocurrido un error inesperado con el asistente de Fylo"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-fylo-500 text-xl font-semibold text-white shadow-lg shadow-fylo-500/40 hover:bg-fylo-600"
        aria-label="Abrir asistente de Fylo"
      >
        {isOpen ? (
          "×"
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
            <span className="relative flex h-5 w-5 items-center justify-center rounded-md border border-white/70 bg-fylo-500/40">
              <span className="absolute -top-1 h-1 w-3 rounded-full bg-white/70" />
              <span className="flex h-full w-full items-center justify-center gap-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </span>
            </span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 z-40 flex w-80 flex-col overflow-hidden rounded-2xl border border-fylo-100 bg-white/95 text-xs text-slate-800 shadow-2xl shadow-fylo-500/20 sm:w-96">
          <div className="flex items-center justify-between border-b border-fylo-100 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Asistente de Fylo
              </p>
              <p className="text-[11px] text-slate-500">
                Pregunta lo que necesites sobre tus VPS y recursos.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              En línea
            </span>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto bg-fylo-50 px-4 py-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={
                  m.role === "assistant"
                    ? "flex justify-start"
                    : "flex justify-end"
                }
              >
                <div
                  className={
                    m.role === "assistant"
                      ? "max-w-[85%] rounded-2xl rounded-bl-sm bg-white px-3 py-2 text-[11px] text-slate-900 shadow-sm"
                      : "max-w-[85%] rounded-2xl rounded-br-sm bg-fylo-500 px-3 py-2 text-[11px] text-white shadow-sm"
                  }
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-white px-3 py-2 text-[11px] text-slate-500 shadow-sm">
                  El asistente de Fylo está escribiendo...
                </div>
              </div>
            )}
            {error && (
              <div className="rounded-lg border border-red-500/40 bg-red-50 px-3 py-2 text-[11px] text-red-600">
                {error}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-fylo-100 bg-white px-3 py-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Escribe tu duda sobre VPS o infraestructura..."
                className="flex-1 rounded-lg border border-fylo-200 bg-white px-3 py-1.5 text-[11px] text-slate-900 outline-none focus:border-fylo-500"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={loading}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-fylo-500 text-xs font-semibold text-white hover:bg-fylo-600 disabled:opacity-60"
              >
                ▶
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
