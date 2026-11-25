import { useMutation } from "@tanstack/react-query";
import { axios } from "../../../config/axios";
import type { MutationConfig } from "../../../config/react-query";
import type { IEvidenceUploadPayload } from "../types";

const evidenceUpload = ({ payload }: { payload: IEvidenceUploadPayload }) => {
  return axios.post("EvidenceUploadBase64", payload);
};

type Options = {
  config?: MutationConfig<typeof evidenceUpload>;
};

export const useEvidenceUpload = ({ config }: Options) => {
  return useMutation({
    ...config,
    mutationFn: evidenceUpload,
  });
};
