export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  message: string | string[];
  path: string;
  timestamp: string;
}

export interface PaginationState {
  currentPage: number;
  perPage: number;
  total: number;
}
