import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACK_URL,
})

//interceptador
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config
    }, 
    (error) => {
        // devolve um erro para a função que está chamando a requisção
        return Promise.reject(error);
    }
);

export { api }