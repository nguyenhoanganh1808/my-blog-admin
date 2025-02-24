import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { AxiosError } from "axios";
import { toast } from "sonner";

interface ErrorResponse {
  errors?: { msg: string }[];
  message?: string;
}

/**
 * Handles API errors and displays a toast notification.
 * @param error - The error caught from the try/catch block.
 * @param defaultMessage - A default message in case no specific error message is found.
 */
export const handleApiError = (
  error: unknown,
  defaultMessage = "Something went wrong"
) => {
  const err = error as AxiosError;
  let errorMessage = defaultMessage;

  // Ensure response data follows expected structure
  const data = err.response?.data as ErrorResponse;

  errorMessage = data?.errors?.[0]?.msg || data?.message || errorMessage;

  toast.error("Error", {
    description: errorMessage,
  });

  console.error("API Error:", err);
};
