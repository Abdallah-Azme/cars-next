/**
 * Legacy newsletter API (kept for type compatibility, not called at runtime).
 * All actual newsletter calls now go through src/lib/actions.ts (Server Actions).
 */
import { apiRequest } from "./requests";

type EmailFormData = { email: string };

type NewsletterResponse = {
  success: boolean | string;
  message: string;
  data: {
    id: number;
    email: string;
    createdAt: string;
  };
};

export const newsletterApi = (data: EmailFormData) =>
  apiRequest<NewsletterResponse>("/email-subscriptions", {
    method: "POST",
    body: JSON.stringify(data),
  });