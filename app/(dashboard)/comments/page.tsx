"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { MoreHorizontal, Search } from "lucide-react";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useData } from "@/hooks/useData";
import { handleApiError } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Comment = {
  id: number;
  post: {
    title: string;
    id: string;
  };
  username: string;
  text: string;
  createdAt: string;
};

export default function CommentsPage() {
  const {
    data: comments,
    currentPage,
    totalPages,
    isLoading,
    fetchData: fetchComments,
    searchQuery,
    setSearchQuery,
    setCurrentPage,
  } = useData<Comment>("/comments");
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [editContent, setEditContent] = useState("");

  const deleteComment = async (commentId: number) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      await axios.delete(`/comments/${commentId}`);
      fetchComments();
      toast.success("Success", {
        description: "Comment deleted successfully",
      });
    } catch (error) {
      handleApiError(error, "Failed to delete comment");
    }
  };

  const startEditingComment = (comment: Comment) => {
    setEditingComment(comment);
    setEditContent(comment.text);
  };

  const handleEditComment = async () => {
    if (!editingComment) return;

    try {
      await axios.put(`/comments/${editingComment.id}`, {
        text: editContent,
      });
      fetchComments();
      setEditingComment(null);
      toast.success("Success", {
        description: "Comment updated successfully",
      });
    } catch (error) {
      handleApiError(error, "Failed to update comment");
    }
  };

  return (
    <div className="space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Comments</h2>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search comments..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {" "}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Post</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell className="font-medium">
                    {comment.post.title}
                  </TableCell>
                  <TableCell>{comment.username}</TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {comment.text}
                  </TableCell>
                  <TableCell>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => startEditingComment(comment)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => deleteComment(comment.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {/* <Button
                      variant="ghost"
                      className="mr-2"
                      onClick={() => startEditingComment(comment)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => deleteComment(comment.id)}
                    >
                      Delete
                    </Button> */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>{" "}
        </>
      )}

      <Dialog
        open={!!editingComment}
        onOpenChange={() => setEditingComment(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Comment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Author</Label>
              <div className="text-sm text-muted-foreground">
                {editingComment?.username}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Post</Label>
              <div className="text-sm text-muted-foreground">
                {editingComment?.post.title}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditingComment(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleEditComment}
              disabled={!editContent.trim()}
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
