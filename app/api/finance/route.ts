import { NextResponse } from "next/server"
import { getFinanceReferenceData } from "@/features/insights/services/financeService"

/**
 * Reference data for the insights screens.
 *
 * The UI currently calls the shared calculation service directly for instant
 * feedback. When the backend is implemented, this route becomes the source of
 * truth for investment options and return assumptions while the response
 * shape stays the same.
 */
export async function GET() {
  return NextResponse.json(getFinanceReferenceData())
}
