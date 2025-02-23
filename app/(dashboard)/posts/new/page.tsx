"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  // const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Implement your API call here
      console.log("Creating post:", { title, content });

      toast.success("Success", {
        description: "Post created successfully",
      });

      router.push("/dashboard/posts");
    } catch (error) {
      console.log(error);
      toast.error("Error", {
        description: "Failed to create post",
      });
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
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[400px]"
            required
          />
        </div>
        <div className="flex gap-4">
          <Button type="submit">Create Post</Button>
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
