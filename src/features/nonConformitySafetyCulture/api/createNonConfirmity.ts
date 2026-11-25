import { useMutation } from "@tanstack/react-query";
import { axios } from "../../../config/axios";
import type { MutationConfig } from "../../../config/react-query";
import type { INonConformityPayload } from "../types";

const createNonConformity = ({
  payload,
}: {
  payload: INonConformityPayload;
}) => {
  return axios.post("EmployeeNonConformitySafetyCultureSet", payload);
};

type Options = {
  config?: MutationConfig<typeof createNonConformity>;
};

export const useCreateNonConformity = ({ config }: Options) => {
  return useMutation({
    ...config,
    mutationFn: createNonConformity,
  });
};
