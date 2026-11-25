import { useQuery } from "@tanstack/react-query";
import { axios } from "../../../config/axios";
import type { QueryConfig } from "../../../config/react-query";
import type { IPatientIncidentParams } from "../types";

const getPatientIncidentList = ({
  DateOfIncidentFrom,
  DateOfIncidentTo,
}: IPatientIncidentParams) => {
  const payload = {
    DateOfIncidentFrom: DateOfIncidentFrom,
    DateOfIncidentTo: DateOfIncidentTo,
  };
  const res = axios
    .post(`PatientIncidentGetList`, payload)
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
  DateOfIncidentFrom: string;
  DateOfIncidentTo: string;
  config?: QueryConfig<typeof getPatientIncidentList>;
};

export const useGetPatientIncidentList = ({
  config,
  DateOfIncidentFrom,
  DateOfIncidentTo,
}: Options) => {
  return useQuery({
    ...config,
    queryKey: ["getPatientIncidentList", DateOfIncidentFrom, DateOfIncidentTo],
    queryFn: () =>
      getPatientIncidentList({ DateOfIncidentFrom, DateOfIncidentTo }),
    enabled: false,
    throwOnError: (error: any) => error.response?.status > 400,
  });
};
