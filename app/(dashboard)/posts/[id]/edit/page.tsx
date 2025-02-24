"use client";

import type React from "react";
import type { Tag } from "@/components/tag-combobox";

import { use, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import dynamic from "next/dynamic";
import axios from "@/lib/axios";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Switch } from "@/components/ui/switch";
import { TagCombobox } from "@/components/tag-combobox";
import { ImageUpload } from "@/components/image-upload";
import { toast } from "sonner";
import { handleApiError } from "@/lib/utils";

const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  { ssr: false }
);

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(
    "<h2>Full-featured rich text editing experience</h2><p>No matter what you're building, TinyMCE has got you covered.</p><p><strong>Kaka</strong></p>"
  );
  const [coverImage, setCoverImage] = useState("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [published, setPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { id } = use(params);

  const fetchPost = useCallback(async () => {
    try {
      const response = await axios.get(`/posts/${id}`);

      setTitle(response.data.title);
      setContent(response.data.content);
      setCoverImage(response.data.coverPhoto);
      setSelectedTags(response.data.tags);
      setPublished(response.data.published);
    } catch (error) {
      handleApiError(error, "Failed to fetch post");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  useEffect(() => {
    console.log("Fetched content:", content);
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("content: ", content);

    try {
      await axios.put(`/posts/${id}`, {
        title,
        content,
        published,
        coverPhoto: coverImage,
        tags: selectedTags.map((tag) => tag.name),
      });

      toast.success("Success", {
        description: "Post updated successfully",
      });

      router.push("/posts");
    } catch (error) {
      handleApiError(error, "Failed to update post");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Edit Post</h2>
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
            key={id}
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
          <Label htmlFor="published">Published</Label>
        </div>
        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/posts")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
