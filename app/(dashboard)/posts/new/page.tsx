"use client";

import type React from "react";
import type { Tag } from "@/components/tag-combobox";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Editor } from "@tinymce/tinymce-react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { AxiosError } from "axios";
import { TagCombobox } from "@/components/tag-combobox";
import { ImageUpload } from "@/components/image-upload";

export interface ErrorResponse {
  errors?: { msg: string }[];
  message?: string;
}

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [published, setPublished] = useState(false);
  const [coverImage, setCoverImage] = useState("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const router = useRouter();
  const { user } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("/posts", {
        title,
        content,
        published,
        authorId: user?.id,
        coverPhoto: coverImage,
        tags: selectedTags.map((tag) => tag.name),
      });
      console.log("Creating post:", { title, content });

      toast.success("Success", {
        description: "Post created successfully",
      });

      router.push("/posts");
    } catch (error) {
      const err = error as AxiosError;
      let errorMessage = "Failed to create post";
      const data = err.response?.data as ErrorResponse;

      errorMessage = data.errors?.[0]?.msg || data.message || errorMessage;

      toast.error("Error", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">New Post</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Cover Image</Label>
          <ImageUpload value={coverImage} onChange={setCoverImage} />
        </div>
        <div className="space-y-2">
          <Label>Tags</Label>
          <TagCombobox
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Editor
            apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
            value={content}
            onEditorChange={(content) => setContent(content)}
            init={{
              height: 500,
              menubar: true,
              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount",
              ],
              toolbar:
                "undo redo | blocks | " +
                "bold italic forecolor | alignleft aligncenter " +
                "alignright alignjustify | bullist numlist outdent indent | " +
                "removeformat | help",
            }}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="published"
            checked={published}
            onCheckedChange={setPublished}
          />
          <Label htmlFor="published">Publish immediately</Label>
        </div>
        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Post"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/posts")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
