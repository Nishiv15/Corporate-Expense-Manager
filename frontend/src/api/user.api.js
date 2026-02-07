import api from "./axios";

export const getUsers = () => api.get("/user/");

export const getUserById = (id) => api.get(`/user/${id}`);

export const createUser = (payload) => api.post("/user/register", payload);

export const updateUser = (id, data) => api.put(`/user/${id}`, data);

export const deleteUser = (id, confirm) =>
  api.delete(`/user/${id}`, {
    data: { confirm }
  });
