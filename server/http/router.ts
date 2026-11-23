import type { Route } from "./types";

export function createRouter(routes: Route[]) {
  const byKey = new Map<string, Route>();
  for (const route of routes) {
    byKey.set(`${route.method}:${route.path}`, route);
  }

  return function findRoute(method: string, path: string): Route | null {
    return byKey.get(`${method}:${path}`) ?? null;
  };
}

export function getPathSegments(pathname: string): string[] {
  return pathname.split("/").filter(Boolean);
}
