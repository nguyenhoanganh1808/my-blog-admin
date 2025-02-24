import { useState, useEffect, useCallback } from "react";
import axios from "@/lib/axios";
import { toast } from "sonner";

export function useData<T>(endpoint: string) {
  const [data, setData] = useState<T[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const pageSize = 10;

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(endpoint, {
        params: {
          page: currentPage,
          limit: pageSize,
          search: searchQuery,
        },
      });

      setData(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Error", {
        description: "Failed to fetch data",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, endpoint]);

  // Fetch posts on mount and when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    fetchData,
  };
}
