import { useRoutes } from "react-router";
import { protectedRoutes } from "./protected";
import { publicRoutes } from "./public";

export const AppRoutes = () => {
  const routes = [...publicRoutes, ...protectedRoutes];

  const element = useRoutes(routes);

  return <>{element}</>;
};
