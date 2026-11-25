interface IEmployeeIncidentPayload {
  EmployeeIncidentNo?: string;
  ReportingDateTime: string;
  SRFirstAidCenter: string;
  RegistrationNo: string;
  IsOutsourcing: boolean;
  PersonID: string;
  EmployeeName: string;
  PlaceOfBirth: string;
  BirthDate: string;
  SRGenderType: string;
  Address: string;
  PhoneNo: string;
  ServiceUnitID: string;
  PositionID: number;
  SREmploymentType: string;
  SREmployeeIncidentType: string;
}

interface IEmployeeIncidentPayload01 {
  EmployeeIncidentNo: string;
  ReportingDateTime: string;
  SRFirstAidCenter: string;
  RegistrationNo: string;
  IsOutsourcing: boolean;
  PersonID: number;
  EmployeeName: string;
  PlaceOfBirth: string;
  BirthDate: string;
  SRGenderType: string;
  Address: string;
  PhoneNo: string;
  ServiceUnitID: string;
  PositionID: number;
  SREmploymentType: string;
  SREmployeeIncidentType: string;

  AccidentScene: string;
  DateOfAccident: string;
  AccidentWitness: string;
  Chronology: string;
  ExplanationOfHowThingsCausedInjuryOrDeath: string;
  SRConsequencesSuffered: string;
  ExplanationOfInjuredBodyParts: string;
  LossesIncurred: string;
  SROutpatientTreatment: string;
  SRBeingTreatedIn: string;
}

interface IEmployeeIncidentPayload02 {
  EmployeeIncidentNo: string;
  ReportingDateTime: string;
  SRFirstAidCenter: string;
  RegistrationNo: string;
  IsOutsourcing: boolean;
  PersonID: number;
  EmployeeName: string;
  PlaceOfBirth: string;
  BirthDate: string;
  SRGenderType: string;
  Address: string;
  PhoneNo: string;
  ServiceUnitID: string;
  PositionID: number;
  SREmploymentType: string;
  SREmployeeIncidentType: string;

  IncidentScene: string;
  DateOfIncident: string;
  B3BL3Type: string;
  IncidentWitness: string;
  Chronology: string;
  SRConsequencesSuffered: string;
  ExplanationOfInjuredBodyParts: string;
  LossesIncurred: string;
  SROutpatientTreatment: string;
  SRBeingTreatedIn: string;
}

interface IEmployeeIncidentPayload03 {
  EmployeeIncidentNo: string;
  ReportingDateTime: string;
  SRFirstAidCenter: string;
  RegistrationNo: string;
  IsOutsourcing: boolean;
  PersonID: number;
  EmployeeName: string;
  PlaceOfBirth: string;
  BirthDate: string;
  SRGenderType: string;
  Address: string;
  PhoneNo: string;
  ServiceUnitID: string;
  PositionID: number;
  SREmploymentType: string;
  SREmployeeIncidentType: string;

  IncidentScene: string;
  DateOfIncident: string;
  ExposedBodyParts: string;
  IsUsedApd: boolean;
  ApdType: string;
  IsHandHygiene: boolean;
  IsGargle: boolean;
  IsEyeIrrigation: boolean;
  IsNassalIrrigation: boolean;
  IsOtherManagement: boolean;
  OtherManagementDesc: string;
}

interface IEmployeeIncidentPayload04 {
  EmployeeIncidentNo: string;
  ReportingDateTime: string;
  SRFirstAidCenter: string;
  RegistrationNo: string;
  IsOutsourcing: boolean;
  PersonID: number;
  EmployeeName: string;
  PlaceOfBirth: string;
  BirthDate: string;
  SRGenderType: string;
  Address: string;
  PhoneNo: string;
  ServiceUnitID: string;
  PositionID: number;
  SREmploymentType: string;
  SREmployeeIncidentType: string;

  SRPakPahkType: string;
  SRPakPahkClassification: string;
  SRPakPahkClassificationItem: string;
  PakPahkTypesOfExposure: string;
  SRConsequencesSuffered: string;
  ExplanationOfInjuredBodyParts: string;
  SROutpatientTreatment: string;
  SRBeingTreatedIn: string;
}

interface IEmployeeIncidentFormType {
  EmployeeIncidentNo?: string;
  ReportingDateTime: string | null;
  SRFirstAidCenter: string | null;
  RegistrationNo: string | null;
  IsOutsourcing: boolean;
  PersonID: string | null;
  EmployeeName: string;
  PlaceOfBirth: string;
  BirthDate: string | null;
  SRGenderType: string | null;
  Address: string;
  PhoneNo: string;
  ServiceUnitID: string | null;
  PositionID: string | null;
  SREmploymentType: string | null;
  SREmployeeIncidentType: string | null;
}

interface IEmployeeIncidentFormType01 {
  AccidentScene: string;
  DateOfAccident: string | null;
  AccidentWitness: string;
  Chronology: string;
  ExplanationOfHowThingsCausedInjuryOrDeath: string;
  SRConsequencesSuffered: string | null;
  ExplanationOfInjuredBodyParts: string;
  LossesIncurred: string;
  SROutpatientTreatment: string | null;
  SRBeingTreatedIn: string | null;
}

interface IEmployeeIncidentFormType02 {
  IncidentScene: string;
  DateOfIncident: string | null;
  B3BL3Type: string;
  IncidentWitness: string;
  Chronology: string;
  ExplanationOfHowThingsCausedInjuryOrDeath: string;
  SRConsequencesSuffered: string | null;
  ExplanationOfInjuredBodyParts: string;
  LossesIncurred: string;
  SROutpatientTreatment: string | null;
  SRBeingTreatedIn: string | null;
}

interface IEmployeeIncidentFormType03 {
  IncidentScene: string;
  DateOfIncident: string | null;
  ExposedBodyParts: string;
  IsUsedApd: string;
  ApdType: string | null;
  IsHandHygiene: boolean;
  IsGargle: boolean;
  IsEyeIrrigation: boolean;
  IsNassalIrrigation: boolean;
  IsOtherManagement: boolean;
  OtherManagementDesc: string;
}

interface IEmployeeIncidentFormType04 {
  SRPakPahkType: string | null;
  SRPakPahkClassification: string | null;
  SRPakPahkClassificationItem: string | null;
  PakPahkTypesOfExposure: string;
  SRConsequencesSuffered: string | null;
  ExplanationOfInjuredBodyParts: string;
  SROutpatientTreatment: string | null;
  SRBeingTreatedIn: string | null;
}

interface IApproveEmployeeIncidentPayload {
  EmployeeIncidentNo: string;
}

interface IEmployeeIncidentParams {
  ReportingDateFrom: string;
  ReportingDateTo: string;
}

interface IRefItem {
  ItemID: string | null;
  ItemName: string | null;
}

interface IEmployeeIncidentWorkAccident {
  AccidentScene: string;
  DateOfAccident: string;
  Chronology: string;
  ExplanationOfHowThingsCausedInjuryOrDeath: string;
  AccidentWitness: string;

  SRConsequencesSuffered: IRefItem;

  ExplanationOfInjuredBodyParts: string;
  LossesIncurred: string;

  SROutpatientTreatment: IRefItem;
  SRBeingTreatedIn: IRefItem;
}

interface IEmployeeIncidentResponse {
  EmployeeIncidentNo: string;
  ReportingDateTime: string;

  // Basic Info
  SRFirstAidCenter: IRefItem;
  RegistrationNo: string;
  IsOutsourcing: boolean;

  EmployeeName: string;
  PlaceOfBirth: string;
  DateOfBirth: string;

  SRGenderType: IRefItem;

  Address: string;
  PhoneNo: string;

  // Job Info
  ServiceUnitID: string;
  PositionID: number;

  SREmploymentType: IRefItem;
  SREmployeeIncidentType: IRefItem;
  SRIncidentReportRole: IRefItem;

  // Status
  IsApproved: boolean | null;

  // Incident Types
  EmployeeIncidentRptWorkAccident: IEmployeeIncidentWorkAccident | null;
  EmployeeIncidentRptB3ExposureIncident: any | null;
  EmployeeIncidentRptInfectiousExposure: any | null;
  EmployeeIncidentRptOccupationalDiseases: any | null;
}

export type {
  IEmployeeIncidentPayload,
  IEmployeeIncidentFormType,
  IApproveEmployeeIncidentPayload,
  IEmployeeIncidentParams,
  IEmployeeIncidentResponse,
  IEmployeeIncidentFormType01,
  IEmployeeIncidentFormType02,
  IEmployeeIncidentFormType03,
  IEmployeeIncidentFormType04,
  IEmployeeIncidentPayload01,
  IEmployeeIncidentPayload02,
  IEmployeeIncidentPayload03,
  IEmployeeIncidentPayload04,
};
