import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fixImageUrl(url: string | null | undefined): string {
  if (!url) return "";
  
  // Replace the IP-based URL with the domain — the SSL cert is on the domain, not the IP
  return url.replace(/^https?:\/\/204\.168\.156\.86\//, "https://egyjapco.tech/");
}
