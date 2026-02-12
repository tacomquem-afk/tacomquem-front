import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api/client";

type UploadedImage = {
  key: string;
  url: string;
  sizeBytes: number;
};

type UploadImagesResponse = {
  images: UploadedImage[];
};

export function useUploadImages() {
  return useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      for (const file of files) {
        formData.append("images", file);
      }
      const data = await api.upload<UploadImagesResponse>(
        "/api/upload/images",
        formData
      );
      return data.images;
    },
  });
}
