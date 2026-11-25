import { useQuery } from "@tanstack/react-query";
import { axios } from "../../../config/axios";
import type { QueryConfig } from "../../../config/react-query";
import type { INonConformityParams } from "../types";

const getNonConformityList = ({
  ReportingDateFrom,
  ReportingDateTo,
}: INonConformityParams) => {
  const payload = {
    ReportingDateFrom: ReportingDateFrom,
    ReportingDateTo: ReportingDateTo,
  };
  const res = axios
    .post(`EmployeeNonConformitySafetyCultureGetList`, payload)
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
  ReportingDateFrom: string;
  ReportingDateTo: string;
  config?: QueryConfig<typeof getNonConformityList>;
};

export const useGetNonConformityList = ({
  config,
  ReportingDateFrom,
  ReportingDateTo,
}: Options) => {
  return useQuery({
    ...config,
    queryKey: ["getNonConformityList", ReportingDateFrom, ReportingDateTo],
    queryFn: () => getNonConformityList({ ReportingDateFrom, ReportingDateTo }),
    enabled: false,
    throwOnError: (error: any) => error.response?.status > 400,
  });
};
