import type { cookies } from "next/headers";

export type RouteContext = {
  request: Request;
  params: string[];
  cookies: Awaited<ReturnType<typeof cookies>>;
};

export type RouteHandler = (
  context: RouteContext
) => Promise<Response> | Response;

export type Route = {
  method: string;
  path: string;
  handler: RouteHandler;
};
