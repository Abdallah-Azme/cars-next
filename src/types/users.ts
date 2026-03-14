export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  statue: "active" | "pending" | "disabled" | string;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: User[];
  pagination: Pagination;
}

export interface UserActionResponse {
  success: boolean;
  message: string;
}
