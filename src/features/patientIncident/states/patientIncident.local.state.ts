import { useForm } from "@mantine/form";
import type { IPatientIncidentFormType } from "../types";
import type { IEvidenceUploadPayload } from "../../whistleblowing/types";
import dayjs from "dayjs";

function usePatientIncidentForm() {
  const createForm = useForm<IPatientIncidentFormType>({
    initialValues: {
      RegistrationNo: null,
      FirstName: "",
      MiddleName: "",
      LastName: "",
      DateOfBirth: null,
      Sex: null,
      ReportedByServiceUnitID: null,
      IncidentLocationID: null,
      IncidentLocationOther: "",
      IncidentDateTime: null,
      ReportingDateTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      SRIncidentOccurredOn: null,
      IncidentOccurredOnName: "",
      SRIncidentOccurredInPatientsWith: null,
      IncidentOccurredInPatientsWithName: "",
      IncidentName: "",
      Chronology: "",
      SRIncidentGroup: null,
      SRClinicalImpact: null,
      SRIncidentProbabilityFrequency: null,
      SRIncidentFollowUp: null,
      Handling: "",
      SRIncidentHandledBy: null,
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
    fileStore,
  };
}

export { usePatientIncidentForm };
