import { useMutation } from "@tanstack/react-query";
import { axios } from "../../../config/axios";
import type { MutationConfig } from "../../../config/react-query";
import type { IApproveWhistleblowingPayload } from "../types";

const approveWhistleblowing = ({
  payload,
}: {
  payload: IApproveWhistleblowingPayload;
}) => {
  return axios.put("WhistleblowingApprove", payload);
};

type Options = {
  config?: MutationConfig<typeof approveWhistleblowing>;
};

export const useApproveWhistleblowing = ({ config }: Options) => {
  return useMutation({
    ...config,
    mutationFn: approveWhistleblowing,
  });
};
