import { useQuery } from "@tanstack/react-query";
import { axios } from "../../../config/axios";
import type { QueryConfig } from "../../../config/react-query";

const getRiskGradingList = () => {
  const res = axios.post(`RiskGradingGetList`).catch((error: any) => {
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
  config?: QueryConfig<typeof getRiskGradingList>;
};

export const useGetRiskGradingList = ({ config }: Options) => {
  return useQuery({
    ...config,
    queryKey: ["getRiskGradingList"],
    queryFn: () => getRiskGradingList(),
    enabled: false,
    throwOnError: (error: any) => error.response?.status > 400,
  });
};
