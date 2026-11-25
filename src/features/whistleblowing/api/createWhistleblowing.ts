import { useMutation } from "@tanstack/react-query";
import { axios } from "../../../config/axios";
import type { MutationConfig } from "../../../config/react-query";
import type { IWhistleblowingPayload } from "../types";

const createWhistleblowing = ({
  payload,
}: {
  payload: IWhistleblowingPayload;
}) => {
  return axios.post("WhistleblowingSet", payload);
};

type Options = {
  config?: MutationConfig<typeof createWhistleblowing>;
};

export const useCreateWhistleblowing = ({ config }: Options) => {
  return useMutation({
    ...config,
    mutationFn: createWhistleblowing,
  });
};
