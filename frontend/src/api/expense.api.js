import api from "./axios";

export const getExpenses = (status) =>
  api.get(`/expenses${status ? `?status=${status}` : ""}`);

export const getExpenseById = (id) => api.get(`/expenses/${id}`);

export const createExpense = (payload) => api.post("/expenses/create-expense", payload);

export const updateExpense = (id, data) => api.put(`/expenses/${id}`, data);

export const deleteExpense = (id) => api.delete(`/expenses/${id}`);

export const submitExpense = (id) => api.put(`/expenses/${id}/submit`);

export const approveExpense = (id, decison) =>
  api.put(`/expenses/${id}/approvals`, decison);
