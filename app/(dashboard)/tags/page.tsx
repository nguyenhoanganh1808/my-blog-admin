"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Plus } from "lucide-react";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/loading-spinner";
import { handleApiError } from "@/lib/utils";

type Tag = {
  id: string;
  name: string;
  _count: {
    posts: number;
  };
};

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [tagName, setTagName] = useState("");

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await axios.get("/tags");
      setTags(response.data.data);
    } catch (error) {
      handleApiError(error, "Failed to fetch tags");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingTag) {
        await axios.put(`/tags/${editingTag.id}`, { name: tagName });

        toast.success("Success", {
          description: "Tag updated successfully",
        });
      } else {
        await axios.post("/tags", { name: tagName });
        toast.success("Success", {
          description: "Tag created successfully",
        });
      }

      fetchTags();
      handleCloseDialog();
    } catch (error) {
      handleApiError(error, "Failed to save tag");
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this tag? This will remove it from all associated posts."
      )
    ) {
      return;
    }

    try {
      await axios.delete(`/tags/${tagId}`);
      fetchTags();
      toast.success("Success", {
        description: "Tag deleted successfully",
      });
    } catch (error) {
      handleApiError(error, "Failed to delete tag");
    }
  };

  const handleOpenDialog = (tag?: Tag) => {
    setEditingTag(tag || null);
    setTagName(tag?.name || "");
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingTag(null);
    setTagName("");
    setDialogOpen(false);
  };

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Tags</h2>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          New Tag
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tags..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Posts</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTags.map((tag) => (
            <TableRow key={tag.id}>
              <TableCell>
                <Badge variant="secondary">{tag.name}</Badge>
              </TableCell>
              <TableCell>{tag._count.posts}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  className="mr-2"
                  onClick={() => handleOpenDialog(tag)}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDeleteTag(tag.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {filteredTags.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={3}
                className="text-center text-muted-foreground"
              >
                No tags found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTag ? "Edit Tag" : "Create New Tag"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                placeholder="Enter tag name"
                required
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!tagName.trim()}>
                {editingTag ? "Save Changes" : "Create Tag"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
