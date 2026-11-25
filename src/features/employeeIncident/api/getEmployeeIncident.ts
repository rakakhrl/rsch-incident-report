import { useQuery } from "@tanstack/react-query";
import { axios } from "../../../config/axios";
import type { QueryConfig } from "../../../config/react-query";
import type { IEmployeeIncidentParams } from "../types";

const getEmployeeIncidentList = ({
  ReportingDateFrom,
  ReportingDateTo,
}: IEmployeeIncidentParams) => {
  const payload = {
    ReportingDateFrom: ReportingDateFrom,
    ReportingDateTo: ReportingDateTo,
  };
  const res = axios
    .post(`EmployeeIncidentGetList`, payload)
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
  config?: QueryConfig<typeof getEmployeeIncidentList>;
};

export const usegetEmployeeIncidentList = ({
  config,
  ReportingDateFrom,
  ReportingDateTo,
}: Options) => {
  return useQuery({
    ...config,
    queryKey: ["getEmployeeIncidentList", ReportingDateFrom, ReportingDateTo],
    queryFn: () =>
      getEmployeeIncidentList({ ReportingDateFrom, ReportingDateTo }),
    enabled: false,
    throwOnError: (error: any) => error.response?.status > 400,
  });
};
