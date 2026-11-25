import { useMutation } from "@tanstack/react-query";
import { axios } from "../../../config/axios";
import type { MutationConfig } from "../../../config/react-query";
import type { IPatientIncidentPayload } from "../types";

const createPatientIncident = ({
  payload,
}: {
  payload: IPatientIncidentPayload;
}) => {
  return axios.post("PatientIncidentSet", payload);
};

type Options = {
  config?: MutationConfig<typeof createPatientIncident>;
};

export const useCreatePatientIncident = ({ config }: Options) => {
  return useMutation({
    ...config,
    mutationFn: createPatientIncident,
  });
};
