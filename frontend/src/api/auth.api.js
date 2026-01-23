import api from "./axios";

export const loginUser = (data) => api.post("/user/login", data);
