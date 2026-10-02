import { apiClient } from './client';
import type { ApiResponse } from '@/types/api.types';

export interface Expense {
  _id: string;
  category: string;
  description: string | null;
  amount: number;
  method: string;
  expenseDate: string;
}

export interface ExpenseCategory {
  _id: string;
  name: string;
  isActive: boolean;
}

export const expensesApi = {
  list: (params?: { from?: string; to?: string; category?: string }) =>
    apiClient.get<ApiResponse<Expense[]>>('/expenses', { params }).then((r) => r.data.data),
  create: (payload: { category: string; description?: string; amount: number; method: string }) =>
    apiClient.post<ApiResponse<Expense>>('/expenses', payload).then((r) => r.data.data),
  delete: (id: string) => apiClient.delete<ApiResponse<null>>(`/expenses/${id}`).then((r) => r.data),
  
  listCategories: () =>
    apiClient.get<ApiResponse<ExpenseCategory[]>>('/expenses/categories').then((r) => r.data.data),
  createCategory: (payload: { name: string }) =>
    apiClient.post<ApiResponse<ExpenseCategory>>('/expenses/categories', payload).then((r) => r.data.data),
};
