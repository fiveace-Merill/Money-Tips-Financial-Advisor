import { NextResponse } from "next/server";
import { getFinanceReferenceData } from "@/features/insights/services/financeService";
import type { Route } from "@/server/http/types";

/** Reference data for the insights screens. Response shape is unchanged. */
const getFinance: Route = {
  method: "GET",
  path: "finance",
  handler: () => NextResponse.json(getFinanceReferenceData()),
};

export const financeRoutes: Route[] = [getFinance];
