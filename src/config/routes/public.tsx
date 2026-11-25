import { lazyImport } from "../../utils/lazyImport";

const { Landing } = lazyImport(() => import("../../features/misc"), "Landing");

const { Whistleblowing } = lazyImport(
  () => import("../../features/whistleblowing"),
  "Whistleblowing",
);

const { Login } = lazyImport(() => import("../../features/login"), "Login");

export const publicRoutes = [
  {
    path: "",
    element: <Landing />,
  },
  {
    path: "whistleblowing",
    element: <Whistleblowing />,
  },
  {
    path: "login",
    element: <Login />,
  },
];
