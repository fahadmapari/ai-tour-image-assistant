import { GoogleGenerativeAI } from "@google/generative-ai"
import { SYSTEM_PROMPT } from "./prompt"

interface Env {
  GEMINI_API_KEY: string
  ALLOWED_ORIGIN: string
}

function corsHeaders(origin: string, allowedOrigin: string): HeadersInit {
  return {
    "Access-Control-Allow-Origin": allowedOrigin === "*" ? "*" : origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin") || ""
    const headers = corsHeaders(origin, env.ALLOWED_ORIGIN)

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers })
    }

    if (request.method !== "POST") {
      return Response.json(
        { error: "Method not allowed" },
        { status: 405, headers }
      )
    }

    const url = new URL(request.url)
    if (url.pathname !== "/api/extract-keywords") {
      return Response.json(
        { error: "Not found" },
        { status: 404, headers }
      )
    }

    try {
      const body = await request.json<{ text?: string }>()

      if (!body.text || body.text.trim().length === 0) {
        return Response.json(
          { error: "Text is required" },
          { status: 400, headers }
        )
      }

      const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

      const result = await model.generateContent({
        contents: [
          { role: "user", parts: [{ text: body.text }] },
        ],
        systemInstruction: { role: "model", parts: [{ text: SYSTEM_PROMPT }] },
      })

      const responseText = result.response.text()

      // Parse and validate the JSON response
      const cleaned = responseText.replace(/```json\n?|```\n?/g, "").trim()
      const parsed = JSON.parse(cleaned)

      if (!parsed.keywords?.tier1 || !parsed.keywords?.tier2) {
        throw new Error("Invalid response structure from AI")
      }

      return Response.json(parsed, { status: 200, headers })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to extract keywords"
      return Response.json(
        { error: message },
        { status: 500, headers }
      )
    }
  },
}
