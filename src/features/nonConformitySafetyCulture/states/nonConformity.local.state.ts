import { useForm } from "@mantine/form";
import type {
  EmployeeNonConformitySafetyCultureSubjectFormType,
  INonConformityPayloadFormType,
} from "../types";
import type { IEvidenceUploadPayload } from "../../whistleblowing/types";
import dayjs from "dayjs";

function useNonConformityForm() {
  const createForm = useForm<INonConformityPayloadFormType>({
    initialValues: {
      NonConformityNo: "",
      ReportingDateTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      SRNcComplaintClassification: "",
      ComplaintDescription: "",
      ReporterServiceUnitID: "",
      ReporterPhoneNo: "",
      ReportingRelationship: "",
      EmployeeNonConformitySafetyCultureSubject: [],
    },
  });

  const subject = useForm<EmployeeNonConformitySafetyCultureSubjectFormType>({
    initialValues: {
      IsMainSubject: false,
      SRSubjectProfessionGroup: null,
      SubjectName: null,
      SubjectPersonID: null,
      SubjectPositionID: null,
      SubjectServiceUnitID: null,
      PositionName: "",
      ProfessionName: "",
      UnitName: "",
    },
  });

  const fileStore = useForm<{
    store: IEvidenceUploadPayload[];
  }>({
    initialValues: {
      store: [],
    },
  });

  return {
    createForm,
    subject,
    fileStore,
  };
}

export { useNonConformityForm };
