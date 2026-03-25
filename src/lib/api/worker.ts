import { CONFIG } from "../config"
import type { WorkerResponse, WorkerErrorResponse } from "@/types"

export async function extractKeywords(text: string): Promise<WorkerResponse> {
  const response = await fetch(`${CONFIG.workerUrl}/api/extract-keywords`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  })

  if (!response.ok) {
    const error = (await response.json()) as WorkerErrorResponse
    throw new Error(error.error || "Failed to extract keywords")
  }

  return response.json() as Promise<WorkerResponse>
}
