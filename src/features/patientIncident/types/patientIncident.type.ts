interface IPatientIncidentParams {
  DateOfIncidentFrom: string;
  DateOfIncidentTo: string;
}

interface IPatientIncidentPayload {
  PatientIncidentNo?: string;
  RegistrationNo: string;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  DateOfBirth: string;
  Sex: string;
  ReportedByServiceUnitID: number;
  IncidentLocationID: string;
  IncidentLocationOther: string;
  IncidentDateTime: string;
  ReportingDateTime: string;
  SRIncidentOccurredOn: string;
  IncidentOccurredOnName: string;
  SRIncidentOccurredInPatientsWith: string;
  IncidentOccurredInPatientsWithName: string;
  IncidentName: string;
  Chronology: string;
  SRIncidentGroup: string;
  SRClinicalImpact: string;
  SRIncidentProbabilityFrequency: string;
  SRIncidentFollowUp: string;
  Handling: string;
  SRIncidentHandledBy: string;
}

interface IPatientIncidentFormType {
  PatientIncidentNo?: string;
  RegistrationNo: string | null;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  DateOfBirth: string | null;
  Sex: string | null;
  ReportedByServiceUnitID: string | null;
  IncidentLocationID: string | null;
  IncidentLocationOther: string;
  IncidentDateTime: string | null;
  ReportingDateTime: string | null;
  SRIncidentOccurredOn: string | null;
  IncidentOccurredOnName: string;
  SRIncidentOccurredInPatientsWith: string | null;
  IncidentOccurredInPatientsWithName: string;
  IncidentName: string;
  Chronology: string;
  SRIncidentGroup: string | null;
  SRClinicalImpact: string | null;
  SRIncidentProbabilityFrequency: string | null;
  SRIncidentFollowUp: string | null;
  Handling: string;
  SRIncidentHandledBy: string | null;
}

interface IApprovePatientIncidentPayload {
  PatientIncidentNo: string;
}

interface IRefItem {
  ItemID: string | null;
  ItemName: string | null;
}

interface IPatientIncidentResponse {
  PatientIncidentNo: string;
  RegistrationNo: string;

  // Patient Info
  FirstName: string;
  MiddleName: string;
  LastName: string;
  DateOfBirth: string | null;
  Sex: string;

  // Reporter
  ReportedByUserID: string;
  ReportedByServiceUnitID: string;

  // Location
  IncidentLocationID: string;
  IncidentLocationOther: string;

  // Date
  IncidentDateTime: string;
  ReportingDateTime: string;

  // Incident Detail
  SRIncidentOccurredOn: IRefItem;
  IncidentOccurredOnName: string;

  SRIncidentOccurredInPatientsWith: IRefItem;
  IncidentOccurredInPatientsWithName: string;

  IncidentName: string;
  Chronology: string;

  // Risk & Classification
  SRIncidentGroup: IRefItem;
  SRClinicalImpact: IRefItem;
  SRIncidentProbabilityFrequency: IRefItem;
  SRIncidentFollowUp: IRefItem;

  // Handling
  Handling: string;
  SRIncidentHandledBy: IRefItem;

  // Status
  IsApproved: boolean;
}

export type {
  IPatientIncidentParams,
  IPatientIncidentPayload,
  IPatientIncidentFormType,
  IApprovePatientIncidentPayload,
  IPatientIncidentResponse,
};
