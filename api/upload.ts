import { axiosInstance as axios } from "@/lib/axios";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";



interface PresignedUrl {
  key: string;
  uploadUrl: string;
  objectUrl: string;
  contentType: string;
}



const preSignedUrlFn = async (filename: string): Promise<PresignedUrl> => {
  return (await axios.post("/api/upload/presigned-url", { filename })).data
}


const Upload = {
  getPresignedUrl: {
    useMutation: (options?: UseMutationOptions<PresignedUrl, Error, string>) =>
      useMutation({
        mutationFn: (filename: string) => preSignedUrlFn(filename),
        ...options,
      }),
  },
}

export default Upload;
