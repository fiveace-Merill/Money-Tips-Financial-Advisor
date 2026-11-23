import { createApiHandler } from "@/server/http/handler";
import { routes } from "@/server/routes";

const handler = createApiHandler(routes);

export const GET = handler;
export const POST = handler;

export const dynamic = "force-dynamic";
