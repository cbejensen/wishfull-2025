import {
  type RouteConfig,
  index,
  route,
} from "@react-router/dev/routes";

const routes = [
  index('./routes/Home.tsx'),
  route("auth", "./routes/Auth.tsx"),
  route("dashboard", "./routes/Dashboard.tsx"),
  route("friends", "./routes/Friends.tsx"),
  route("users/:id", "./routes/User.tsx"),
] satisfies RouteConfig;

export default routes;