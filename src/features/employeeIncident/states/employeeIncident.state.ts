import { useForm } from "@mantine/form";
import type { IEmployeeIncidentFormType } from "../types";
import type {
  IEmployeeIncidentFormType01,
  IEmployeeIncidentFormType02,
  IEmployeeIncidentFormType03,
  IEmployeeIncidentFormType04,
} from "../types/employeeIncident.type";
import type { IEvidenceUploadPayload } from "../../whistleblowing/types";
import dayjs from "dayjs";

function useEmployeeIncidentForm() {
  const employeeForm = useForm<IEmployeeIncidentFormType>({
    initialValues: {
      ReportingDateTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      SRFirstAidCenter: null,
      RegistrationNo: null,
      IsOutsourcing: false,
      PersonID: null,
      EmployeeName: "",
      PlaceOfBirth: "",
      BirthDate: null,
      SRGenderType: null,
      Address: "",
      PhoneNo: "",
      ServiceUnitID: null,
      PositionID: null,
      SREmploymentType: null,
      SREmployeeIncidentType: null,
    },
  });
  const type01Form = useForm<IEmployeeIncidentFormType01>({});
  const type02Form = useForm<IEmployeeIncidentFormType02>({});
  const type03Form = useForm<IEmployeeIncidentFormType03>({});
  const type04Form = useForm<IEmployeeIncidentFormType04>({});

  const fileStore = useForm<{
    store: IEvidenceUploadPayload[];
  }>({
    initialValues: {
      store: [],
    },
  });

  return {
    employeeForm,
    type01Form,
    type02Form,
    type03Form,
    type04Form,
    fileStore,
  };
}

export { useEmployeeIncidentForm };
