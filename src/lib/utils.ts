import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fixImageUrl(url: string | null | undefined): string {
  if (!url) return "";
  // Convert absolute insecure URLs from the backend to relative paths.
  // This allows them to be proxied through our HTTPS-enabled Next.js server.
  return url.replace(/^http:\/\/204\.168\.156\.86(\/storage\/)/, "$1");
}
