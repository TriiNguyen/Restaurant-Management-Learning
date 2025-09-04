import { useMutation } from "@tanstack/react-query";
import { mediaApiRequest } from "@/apiRequest/media";

export const useUploadMediaMutation = () => {
  return useMutation({
    mutationFn: mediaApiRequest.upload,
  });
};
