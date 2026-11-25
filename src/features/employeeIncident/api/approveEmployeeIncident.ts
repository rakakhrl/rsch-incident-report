import { useMutation } from "@tanstack/react-query";
import { axios } from "../../../config/axios";
import type { MutationConfig } from "../../../config/react-query";
import type { IApproveEmployeeIncidentPayload } from "../types";

const approveEmployeeIncident = ({
  payload,
}: {
  payload: IApproveEmployeeIncidentPayload;
}) => {
  return axios.put("EmployeeIncidentApprove", payload);
};

type Options = {
  config?: MutationConfig<typeof approveEmployeeIncident>;
};

export const useApproveEmployeeIncident = ({ config }: Options) => {
  return useMutation({
    ...config,
    mutationFn: approveEmployeeIncident,
  });
};
