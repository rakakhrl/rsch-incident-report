import { useMutation } from "@tanstack/react-query";
import { axios } from "../../../config/axios";
import type { MutationConfig } from "../../../config/react-query";
import type { IApprovePatientIncidentPayload } from "../types";

const approvePatientIncident = ({
  payload,
}: {
  payload: IApprovePatientIncidentPayload;
}) => {
  return axios.put("PatientIncidentApprove", payload);
};

type Options = {
  config?: MutationConfig<typeof approvePatientIncident>;
};

export const useApprovePatientIncident = ({ config }: Options) => {
  return useMutation({
    ...config,
    mutationFn: approvePatientIncident,
  });
};
