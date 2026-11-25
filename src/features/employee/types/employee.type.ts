interface IEmployeeParams {
  TextToSearch: string;
}

interface IEmployeeResponse {
  PersonID: number;
  EmployeeNumber: string;
  EmployeeName: string;
  ServiceUnitID: string;
  PositionID: number;
  SRProfessionGroup: {
    ItemID: string | null;
    ItemName: string | null;
  };
  SREmploymentType: {
    ItemID: string | null;
    ItemName: string | null;
  };
}

export type { IEmployeeParams, IEmployeeResponse };
