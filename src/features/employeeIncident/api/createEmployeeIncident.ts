import { useMutation } from "@tanstack/react-query";
import { axios } from "../../../config/axios";
import type { MutationConfig } from "../../../config/react-query";
import type {
  IEmployeeIncidentPayload01,
  IEmployeeIncidentPayload02,
  IEmployeeIncidentPayload03,
  IEmployeeIncidentPayload04,
} from "../types/employeeIncident.type";

const createEmployeeIncident = ({
  payload,
}: {
  payload:
    | IEmployeeIncidentPayload01
    | IEmployeeIncidentPayload02
    | IEmployeeIncidentPayload03
    | IEmployeeIncidentPayload04;
}) => {
  return axios.post("EmployeeIncidentSet", payload);
};

type Options = {
  config?: MutationConfig<typeof createEmployeeIncident>;
};

export const useCreateEmployeeIncident = ({ config }: Options) => {
  return useMutation({
    ...config,
    mutationFn: createEmployeeIncident,
  });
};
