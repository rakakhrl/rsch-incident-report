import PrivateRoute from "../../components/privateRoutes/privateRoutes";
import MainLayout from "../../layout/component/mainLayout";
import { lazyImport } from "../../utils/lazyImport";

const { Home } = lazyImport(() => import("../../features/home"), "Home");

const { PatientIncident } = lazyImport(
  () => import("../../features/patientIncident"),
  "PatientIncident",
);

const { EmployeeIncident } = lazyImport(
  () => import("../../features/employeeIncident"),
  "EmployeeIncident",
);

const { NCSF } = lazyImport(
  () => import("../../features/nonConformitySafetyCulture"),
  "NCSF",
);

const { CreatePatientIncident } = lazyImport(
  () => import("../../features/patientIncident"),
  "CreatePatientIncident",
);

const { CreateEmployeeIncident } = lazyImport(
  () => import("../../features/employeeIncident"),
  "CreateEmployeeIncident",
);

const { CreateNonConformitySafetyCulture } = lazyImport(
  () => import("../../features/nonConformitySafetyCulture"),
  "CreateNonConformitySafetyCulture",
);

export const protectedRoutes = [
  {
    path: "/",
    element: <PrivateRoute element={<MainLayout />} />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "patient-incident",
        element: <PatientIncident />,
      },
      {
        path: "employee-incident",
        element: <EmployeeIncident />,
      },
      {
        path: "non-conformity-safety-culture",
        element: <NCSF />,
      },
      {
        path: "patient-incident/create",
        element: <CreatePatientIncident />,
      },
      {
        path: "employee-incident/create",
        element: <CreateEmployeeIncident />,
      },
      {
        path: "non-conformity-safety-culture/create",
        element: <CreateNonConformitySafetyCulture />,
      },
    ],
  },
];
