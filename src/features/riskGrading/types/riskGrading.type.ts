interface IRiskGradingMatrixParams {
  SRClinicalImpact: string;
  SRIncidentProbabilityFrequency: string;
}

interface IRiskGradingResponse {
  RiskGradingID: string;
  RiskGradingName: string;
  RiskGradingColor: string;
}

export type { IRiskGradingMatrixParams, IRiskGradingResponse };
