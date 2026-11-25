import { useQuery } from "@tanstack/react-query";
import { axios } from "../../../config/axios";
import type { QueryConfig } from "../../../config/react-query";
import type { IStandardReferenceParams } from "../types/standardReference.type";

const getStandardReference = ({
  NcComplaintClassification,
  StandardReferenceID,
}: IStandardReferenceParams) => {
  const payload: IStandardReferenceParams = {
    NcComplaintClassification: NcComplaintClassification,
    StandardReferenceID: StandardReferenceID,
  };
  const res = axios
    .post(`StandardReferenceGetList`, payload)
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
  StandardReferenceID: string;
  NcComplaintClassification: string;
  config?: QueryConfig<typeof getStandardReference>;
};

export const useGetStandardReference = ({
  config,
  NcComplaintClassification,
  StandardReferenceID,
}: Options) => {
  return useQuery({
    ...config,
    queryKey: [
      "getStandardReference",
      NcComplaintClassification,
      StandardReferenceID,
    ],
    queryFn: () =>
      getStandardReference({ NcComplaintClassification, StandardReferenceID }),
    enabled: false,
    throwOnError: (error: any) => error.response?.status > 400,
  });
};
