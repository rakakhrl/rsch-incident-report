interface IStandardReferenceParams {
  StandardReferenceID: string;
  NcComplaintClassification: string;
}

interface IStandardReferenceResponse {
  ItemID: string;
  ItemName: string;
  Note: string | null;
}

export type { IStandardReferenceParams, IStandardReferenceResponse };
