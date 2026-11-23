import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { toErrorResponse } from "./errors";
import { createRouter } from "./router";
import type { Route, RouteContext } from "./types";

/**
 * Single entry point for every API request. Feature routes register here and
 * remain the only place that needs to know about request/response contracts.
 */
export function createApiHandler(routes: Route[]) {
  const findRoute = createRouter(routes);

  return async function handleApiRequest(
    request: Request,
    context: { params: Promise<{ path?: string[] }> }
  ) {
    const { path = [] } = await context.params;
    const route = findRoute(request.method, path.join("/"));

    if (!route) {
      return NextResponse.json(
        { error: "Endpoint not found." },
        { status: 404 }
      );
    }

    const routeContext: RouteContext = {
      request,
      params: path,
      cookies: await cookies(),
    };

    try {
      return await route.handler(routeContext);
    } catch (error) {
      const { status, body } = toErrorResponse(error);
      return NextResponse.json(body, { status });
    }
  };
}
