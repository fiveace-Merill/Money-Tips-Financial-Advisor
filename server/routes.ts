import { authRoutes } from "./auth/routes";
import { chatRoutes } from "./chat/routes";
import { financeRoutes } from "./finance/routes";
import type { Route } from "./http/types";

export const routes: Route[] = [...authRoutes, ...chatRoutes, ...financeRoutes];
