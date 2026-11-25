interface EmployeeNonConformitySafetyCultureSubject {
  SubjectPersonID: string;
  SubjectPositionID: string;
  SRSubjectProfessionGroup: string;
  SubjectServiceUnitID: string;
  IsMainSubject: boolean;
}

interface INonConformityPayload {
  NonConformityNo: string;
  ReportingDateTime: string;
  SRNcComplaintClassification: string;
  ComplaintDescription: string;
  ReporterServiceUnitID: string;
  ReporterPhoneNo: string;
  ReportingRelationship: string;
  EmployeeNonConformitySafetyCultureSubject: EmployeeNonConformitySafetyCultureSubject[];
}

interface EmployeeNonConformitySafetyCultureSubjectFormType {
  SubjectPersonID: string | null;
  SubjectPositionID: string | null;
  SRSubjectProfessionGroup: string | null;
  SubjectServiceUnitID: string | null;
  IsMainSubject: boolean;
  SubjectName: string | null;
  PositionName: string;
  ProfessionName: string;
  UnitName: string;
}

interface INonConformityPayloadFormType {
  NonConformityNo: string;
  ReportingDateTime: string | null;
  SRNcComplaintClassification: string;
  ComplaintDescription: string;
  ReporterServiceUnitID: string;
  ReporterPhoneNo: string;
  ReportingRelationship: string;
  EmployeeNonConformitySafetyCultureSubject: EmployeeNonConformitySafetyCultureSubjectFormType[];
}

interface IApproveNonConformityPayload {
  NonConformityNo: string;
}

interface IRefItem {
  ItemID: string | null;
  ItemName: string | null;
}

interface NonConformitySubject {
  NonConformityNo: string;
  SubjectPersonID: number;
  SubjectPositionID: number;
  SRSubjectProfessionGroup: IRefItem;
  SubjectServiceUnitID: string;
  IsMainSubject: boolean;
}

interface INonConformityResponse {
  NonConformityNo: string;
  ReportingDateTime: string;

  // Classification
  SRNcComplaintClassification: IRefItem;

  // Description
  ComplaintDescription: string;

  // Reporter
  ReporterPersonID: number;
  ReporterServiceUnitID: string;
  ReporterPhoneNo: string;
  ReportingRelationship: string;

  // Status
  IsApproved: boolean;

  // Subjects
  EmployeeNonConformitySafetyCultureSubject: NonConformitySubject[];
}

interface INonConformityParams {
  ReportingDateFrom: string;
  ReportingDateTo: string;
}

export type {
  EmployeeNonConformitySafetyCultureSubject,
  INonConformityPayload,
  EmployeeNonConformitySafetyCultureSubjectFormType,
  INonConformityPayloadFormType,
  IApproveNonConformityPayload,
  INonConformityResponse,
  INonConformityParams,
};
