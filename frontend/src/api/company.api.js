import api from "./axios";

export const getCompanyById = (id) => api.get(`/companies/${id}`);

export const companyRegister = (data) => api.post("/companies/register", data);

export const deleteCompany = (id, confirm) =>
  api.delete(`/companies/${id}`, {
    data: { confirm }
  });
