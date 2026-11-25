import { useLocation, useNavigate, useParams, useRoutes } from "react-router";
import { protectedRoutes } from "./routes/protected";
import { publicRoutes } from "./routes/public";

function useAppRoute() {
  const element = useRoutes([...publicRoutes, ...protectedRoutes]);
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  function Routes() {
    return element;
  }

  function go(path: string, option?: { state: any }): void {
    navigate(path, option);
  }

  function back(): void {
    navigate(-1);
  }

  function replace(path: string): void {
    navigate(path, { replace: true });
  }

  return { Routes, go, back, replace, params, location };
}

export default useAppRoute;
