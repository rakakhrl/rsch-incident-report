import { useMutation } from "@tanstack/react-query";
import { axios } from "../../../config/axios";
import type { MutationConfig } from "../../../config/react-query";
import type { ILoginPayload } from "../types";

const login = ({ payload }: { payload: ILoginPayload }) => {
  return axios.post(`Login`, payload);
};

type Options = {
  config?: MutationConfig<typeof login>;
};

export const useLogin = ({ config }: Options) => {
  return useMutation({
    ...config,
    mutationFn: login,
  });
};
