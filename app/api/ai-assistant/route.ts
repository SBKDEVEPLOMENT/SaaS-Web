import { NextRequest, NextResponse } from "next/server";
// Vercel Build Fix v5 - Force Gemini 1.5 Flash Update
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(req: NextRequest) {
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "GEMINI_API_KEY no está configurada en el entorno del servidor. Añádela en Vercel para usar la IA."
      },
      { status: 500 }
    );
  }

  const ai = new GoogleGenAI({
    apiKey
  });

  // Force API version via client config if possible or needed by SDK
  // but @google/genai usually handles it.
  
  const body = (await req.json()) as {
    messages?: ChatMessage[];
  };

  const messages = Array.isArray(body.messages) ? body.messages : [];

  const trimmedMessages =
    messages.length > 10 ? messages.slice(messages.length - 10) : messages;

  const conversationText =
    trimmedMessages.length > 0
      ? trimmedMessages
          .map((m) =>
            m.role === "user"
              ? `Cliente: ${m.content}`
              : `Asistente Fylo: ${m.content}`
          )
          .join("\n")
      : "Cliente: Hola, necesito ayuda para elegir una VPS en Fylo.\n";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text:
                "Eres el asistente virtual de Fylo, una empresa de VPS cloud. " +
                "Hablas siempre como Fylo (por ejemplo: \"te recomiendo esta VPS\", \"en Fylo hacemos...\"). " +
                "No menciones que eres un modelo de lenguaje ni nombres de proveedores externos. " +
                "Responde en español, con un tono profesional pero cercano. " +
                "Usa euros, explica de forma corta por qué recomiendas cada recurso (ubicación, cores, RAM, almacenamiento, sistema operativo) " +
                "y, cuando sea útil, sugiere configuraciones escalables para distintos tipos de proyectos (SaaS, APIs, e‑commerce, juegos, etc.).\n\n" +
                "Historial de la conversación hasta ahora:\n" +
                conversationText +
                "\n\nResponde ahora como asistente de Fylo al último mensaje del cliente."
            }
          ]
        }
      ]
    });

    const text = response.text || "Lo siento, no pude generar una respuesta.";

    // Force Vercel rebuild - Return the response as JSON
    return NextResponse.json({
      answer: text
    });
  } catch (error) {
    console.error("Error en el asistente de Fylo:", error);
    
    // Attempt to list available models for debugging
    let availableModels = "No se pudieron listar los modelos.";
    try {
      const modelsResponse = await ai.models.list();
      // The new SDK returns a paginated list or similar, let's try to map it safely
      // Inspecting the type of modelsResponse might be needed, but let's assume it's iterable or has 'models'
      // For now, just stringify it to see what we get if possible, or skip if complex
       availableModels = JSON.stringify(modelsResponse).slice(0, 200); 
    } catch (listError) {
       availableModels = "Error al listar modelos: " + String(listError);
    }

    const message =
      error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        error:
          "No se pudo obtener respuesta de la IA. Error: " +
          message + 
          " | Modelos disponibles (debug): " + availableModels
      },
      { status: 500 }
    );
  }
}
