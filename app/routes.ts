import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("terminal", "routes/terminal.tsx"),
] satisfies RouteConfig;
