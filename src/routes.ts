import {
  type RouteConfig,
  index,
  route,
} from "@react-router/dev/routes";

export const routes = [
  index('./pages/Home'),
  route("dashboard", "./pages/Dashboard"),
  route("friends", "./pages/Friends"),
  route("users/:id", "./pages/User"),
] satisfies RouteConfig;