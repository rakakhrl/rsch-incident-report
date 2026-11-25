import { useQuery } from "@tanstack/react-query";
import { axios } from "../../../config/axios";
import type { QueryConfig } from "../../../config/react-query";
import type { IEmployeeParams } from "../types";

const getEmployeeList = ({ TextToSearch }: IEmployeeParams) => {
  const payload = {
    TextToSearch: TextToSearch,
  };
  const res = axios.post(`PersonalGetList`, payload).catch((error: any) => {
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
  config?: QueryConfig<typeof getEmployeeList>;
};

export const usegetEmployeeList = ({ config, TextToSearch }: Options) => {
  return useQuery({
    ...config,
    queryKey: ["getEmployeeList", TextToSearch],
    queryFn: () => getEmployeeList({ TextToSearch }),
    enabled: false,
    throwOnError: (error: any) => error.response?.status > 400,
  });
};
