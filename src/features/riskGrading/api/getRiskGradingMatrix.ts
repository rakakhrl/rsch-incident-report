import { useQuery } from "@tanstack/react-query";
import { axios } from "../../../config/axios";
import type { QueryConfig } from "../../../config/react-query";
import type { IRiskGradingMatrixParams } from "../types";

const getRiskGradingMatrix = ({
  SRClinicalImpact,
  SRIncidentProbabilityFrequency,
}: IRiskGradingMatrixParams) => {
  const payload = {
    SRClinicalImpact: SRClinicalImpact,
    SRIncidentProbabilityFrequency: SRIncidentProbabilityFrequency,
  };
  const res = axios.post(`RiskGradingMtxGet`, payload).catch((error: any) => {
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
  SRClinicalImpact: string;
  SRIncidentProbabilityFrequency: string;
  config?: QueryConfig<typeof getRiskGradingMatrix>;
};

export const useGetRiskGradingMatrix = ({
  config,
  SRClinicalImpact,
  SRIncidentProbabilityFrequency,
}: Options) => {
  return useQuery({
    ...config,
    queryKey: [
      "getRiskGradingMatrix",
      SRClinicalImpact,
      SRIncidentProbabilityFrequency,
    ],
    queryFn: () =>
      getRiskGradingMatrix({
        SRClinicalImpact,
        SRIncidentProbabilityFrequency,
      }),
    enabled: false,
    throwOnError: (error: any) => error.response?.status > 400,
  });
};
