import { useMutation } from "@tanstack/react-query";
import { axios } from "../../../config/axios";
import type { MutationConfig } from "../../../config/react-query";
import type { IApproveNonConformityPayload } from "../types";

const approveNonConformity = ({
  payload,
}: {
  payload: IApproveNonConformityPayload;
}) => {
  return axios.put("EmployeeNonConformitySafetyCultureApprove", payload);
};

type Options = {
  config?: MutationConfig<typeof approveNonConformity>;
};

export const useApproveNonConformity = ({ config }: Options) => {
  return useMutation({
    ...config,
    mutationFn: approveNonConformity,
  });
};
