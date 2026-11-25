interface IWhistleblowingPayload {
  WhistleblowingNo?: string;
  ReportingDateTime: string;
  SRWhistleblowingType: string;
  DateOfIncident: string;
  IncidentLocation: string;
  Chronology: string;
  NominalAmount: number;
  ReporterName: string;
  ReporterPhoneNo: string;
  ReporterEmailAddress: string;
  SubjectPersonID: number;
  SubjectPositionID: number;
}

interface IWhistleblowingFormType {
  WhistleblowingNo?: string;
  ReportingDateTime: string | null;
  SRWhistleblowingType: string | null;
  DateOfIncident: string | null;
  IncidentLocation: string;
  Chronology: string;
  NominalAmount: number;
  ReporterName: string;
  ReporterPhoneNo: string;
  ReporterEmailAddress: string;
  SubjectPersonID: string | null;
  SubjectPositionID: string | null;
}

interface IApproveWhistleblowingPayload {
  WhistleblowingNo: string;
}

interface IEvidenceUploadPayload {
  TransactionNo: string;
  IncidentType: string | null;
  DocumentName: string;
  DocumentDate: string;
  Notes: string;
  OriFileName: string;
  Base64File: string;
}

export type {
  IWhistleblowingFormType,
  IWhistleblowingPayload,
  IApproveWhistleblowingPayload,
  IEvidenceUploadPayload,
};
