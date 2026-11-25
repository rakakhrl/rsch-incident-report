import { useQuery } from "@tanstack/react-query";
import { axios } from "../../../config/axios";
import type { QueryConfig } from "../../../config/react-query";
import type { IPositionParams } from "../types";

const getPositionList = ({ TextToSearch }: IPositionParams) => {
  const payload = {
    TextToSearch: TextToSearch,
  };
  const res = axios.post(`PositionGetList`, payload).catch((error: any) => {
    if (error.response) {
      return Promise.reject(error.response);
    } else if (error.request) {
      return Promise.reject(error.request);
    } else {
      return Promise.reject(error.message);
    }
  });

  return res;
};

type Options = {
  TextToSearch: string;
  config?: QueryConfig<typeof getPositionList>;
};

export const useGetPositionList = ({ config, TextToSearch }: Options) => {
  return useQuery({
    ...config,
    queryKey: ["getPositionList", TextToSearch],
    queryFn: () => getPositionList({ TextToSearch }),
    enabled: false,
    throwOnError: (error: any) => error.response?.status > 400,
  });
};
