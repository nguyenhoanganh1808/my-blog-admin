"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { handleApiError } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      onChange(response.data.fileUrl);
      toast.success("Success", {
        description: "Image uploaded successfully",
      });
    } catch (error) {
      handleApiError(error, "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Error", {
          description: "File size must be less than 5MB",
        });
        return;
      }
      handleUpload(file);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      {value ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
          <Image
            src={value || "/placeholder.svg"}
            alt="Cover image"
            fill
            className="object-cover"
          />
          <Button
            size="icon"
            variant="destructive"
            className="absolute right-2 top-2"
            onClick={() => onChange("")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          className="aspect-video w-full"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
        >
          <ImagePlus className="mr-2 h-4 w-4" />
          {isUploading ? "Uploading..." : "Upload Cover Image"}
        </Button>
      )}
    </div>
  );
}
