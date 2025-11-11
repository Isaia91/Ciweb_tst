import axios from "axios";


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api",
    headers: { "Content-Type": "application/json" },
});


// Articles
export const listArticles = () => api.get("/articles");
export const getArticle = (id) => api.get(`/articles/${id}`);
export const createArticle = (payload) => api.post("/articles", payload);
export const updateArticle = (id, payload) => api.put(`/articles/${id}`, payload);
export const deleteArticle = (id) => api.delete(`/articles/${id}`);
export const exportCsvUrl = () => `${api.defaults.baseURL}/articles/export`;

export const listFamilles = () => api.get("/familles");


export default api;
