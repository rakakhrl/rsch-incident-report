import { useQuery } from "@tanstack/react-query";
import { axios } from "../../../config/axios";
import type { QueryConfig } from "../../../config/react-query";

const getServiceUnitList = ({ TextToSearch }: { TextToSearch: string }) => {
  const payload = {
    TextToSearch: TextToSearch,
  };
  const res = axios
    .post(`OrganizationUnitGetList`, payload)
    .catch((error: any) => {
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
  config?: QueryConfig<typeof getServiceUnitList>;
};

export const useGetServiceUnitList = ({ TextToSearch, config }: Options) => {
  return useQuery({
    ...config,
    queryKey: ["getServiceUnitList", TextToSearch],
    queryFn: () => getServiceUnitList({ TextToSearch }),
    enabled: false,
    throwOnError: (error: any) => error.response?.status > 400,
  });
};
