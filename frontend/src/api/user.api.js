import api from "./axios";

export const getUsers = (page = 1) =>
  api.get("/user/", {
    params: { page, limit: 20 },
  });

export const getUserById = (id) => api.get(`/user/${id}`);

export const createUser = (payload) => api.post("/user/register", payload);

export const updateUser = (id, payload) => api.put(`/user/${id}`, payload);

export const deleteUser = (id, confirm) =>
  api.delete(`/user/${id}`, {
    data: { confirm },
  });
