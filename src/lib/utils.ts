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

export function formatWhatsAppUrl(contact: string | null | undefined, message?: string): string | null {
  if (!contact) return null;

  let baseUrl = "";
  if (contact.startsWith("http")) {
    baseUrl = contact;
  } else {
    // Clean all non-digit characters
    let cleanNumber = contact.replace(/\D/g, "");
    
    // If it starts with 0 (like 010...), replace it with 20 (Egypt country code)
    if (cleanNumber.startsWith("0")) {
      cleanNumber = "20" + cleanNumber.substring(1);
    } 
    // If it's a 10 or 11 digit local number and doesn't have 20, prepend 20
    else if (!cleanNumber.startsWith("20") && (cleanNumber.length === 10 || cleanNumber.length === 11)) {
      cleanNumber = "20" + cleanNumber;
    }
    
    baseUrl = `https://wa.me/${cleanNumber}`;
  }

  if (message) {
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}text=${encodeURIComponent(message)}`;
  }

  return baseUrl;
}
