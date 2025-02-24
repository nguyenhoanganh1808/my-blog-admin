"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "@/lib/axios";
import { handleApiError } from "@/lib/utils";
import { toast } from "sonner";

interface AvatarUploadProps {
  value?: string;
  onChange: (value: string) => void;
  name: string;
}

export function AvatarUpload({ value, onChange, name }: AvatarUploadProps) {
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
        description: "Avatar uploaded successfully",
      });
    } catch (error) {
      handleApiError(error, "Failed to upload avatar");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Error", {
          description: "File size must be less than 2MB",
        });
        return;
      }
      handleUpload(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={value} alt={name} />
          <AvatarFallback>{name[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        {value && (
          <Button
            size="icon"
            variant="destructive"
            className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
            onClick={() => onChange("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
      >
        <ImagePlus className="mr-2 h-4 w-4" />
        {isUploading ? "Uploading..." : "Change Avatar"}
      </Button>
    </div>
  );
}
