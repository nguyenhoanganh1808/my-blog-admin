"use client";

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Search } from "lucide-react";
import Link from "next/link";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useData } from "@/hooks/useData";

type Author = {
  id: number;
  name: string;
};

export type Post = {
  id: number;
  title: string;
  published: boolean;
  createdAt: string;
  author: Author;
  _count: {
    comments: number;
  };
};

export default function PostsPage() {
  const {
    data: posts,
    currentPage,
    fetchData: fetchPosts,
    isLoading,
    searchQuery,
    setSearchQuery,
    setCurrentPage,
    totalPages,
  } = useData<Post>("posts");

  const togglePublish = async (postId: number) => {
    try {
      await axios.patch(`/posts/${postId}/publish`);
      fetchPosts();
      toast.success("Success", {
        description: "Post status updated successfully",
      });
    } catch (error) {
      console.log(error);
      toast("Error", {
        description: "Failed to update post status",
      });
    }
  };

  const deletePost = async (postId: number) => {
    try {
      await axios.delete(`/posts/${postId}`);
      fetchPosts();
      toast.success("Success", {
        description: "Post deleted successfully",
      });
    } catch (error) {
      console.log(error);
      toast.error("Error", {
        description: "Failed to delete post",
      });
    }
  };

  return (
    <div className="space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Posts</h2>
        <Link href="/posts/new">
          <Button>New Post</Button>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>{post.author.name}</TableCell>
                  <TableCell>
                    <Button
                      variant={post.published ? "default" : "secondary"}
                      size="sm"
                      onClick={() => togglePublish(post.id)}
                    >
                      {post.published ? "Published" : "Draft"}
                    </Button>
                  </TableCell>
                  <TableCell>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{post._count.comments}</TableCell>
                  <TableCell>
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
                        <DropdownMenuItem asChild>
                          <Link href={`/posts/${post.id}/edit`}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => deletePost(post.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
          </div>
        </>
      )}
    </div>
  );
}
