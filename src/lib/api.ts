import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_API_URL;

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
})

api.interceptors.request.use(
    async (config) => {
        const { store } = await import('@/store/store')
        const { auth } = store.getState();
        
        const token = auth.token;

        if(token && !config.url?.includes('/auth/')){
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
)

api.interceptors.response.use(
    (response) => {
        return response;
    },

    async (error) => {
        console.log('Api error: ', error);
        return Promise.reject(error);
    }
)

export default api;