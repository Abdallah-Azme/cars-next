import type { SettingsResponse } from "@/types/settings";
import { apiRequest } from "./requests";

export const getSettingsApi = () =>
  apiRequest<SettingsResponse>("/settings", {
    method: "get",
  });