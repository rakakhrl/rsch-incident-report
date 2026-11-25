import { useForm } from "@mantine/form";
import type { IEvidenceUploadPayload, IWhistleblowingFormType } from "../types";
import dayjs from "dayjs";

function useWhistleblowingForm() {
  const createForm = useForm<IWhistleblowingFormType>({
    initialValues: {
      Chronology: "",
      DateOfIncident: null,
      IncidentLocation: "",
      NominalAmount: 0,
      ReporterEmailAddress: "",
      ReporterName: "",
      ReporterPhoneNo: "",
      ReportingDateTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      SRWhistleblowingType: null,
      SubjectPersonID: null,
      SubjectPositionID: null,
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

export { useWhistleblowingForm };
