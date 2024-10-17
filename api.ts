import axios, { AxiosInstance } from 'axios';

// Substitua pelo URL do seu backend
const API_URL = 'http://10.0.2.2:3000/'; // Use o IP da sua máquina na rede local

const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000, // 10 segundos de timeout
});

// Adiciona interceptors para logging
axiosInstance.interceptors.request.use(
    (config) => {
        console.log('Starting Request', JSON.stringify(config, null, 2));
        return config;
    },
    (error) => {
        console.log('Request Error:', error);
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        console.log('Response:', JSON.stringify(response.data, null, 2));
        return response;
    },
    (error) => {
        console.log('Response Error:', error);
        return Promise.reject(error);
    }
);

export const api = {
    getAllRoutes: () => axiosInstance.get('routes'),
    getRoute: (id: string) => axiosInstance.get(`routes/${id}`),
    createRoute: (routeData: any) => axiosInstance.post('routes', routeData),
    updateRoute: (id: string, routeData: any) => axiosInstance.patch(`routes/${id}`, routeData),
    deleteRoute: (id: string) => axiosInstance.delete(`routes/${id}`),
    startRoute: (id: string) => axiosInstance.post(`routes/${id}/start`),
    completeRoute: (id: string) => axiosInstance.post(`routes/${id}/complete`),
    cancelRoute: (id: string) => axiosInstance.post(`routes/${id}/cancel`),
};

export const handleApiError = (error: any) => {
    if (error.response) {
        // O servidor respondeu com um status fora do intervalo 2xx
        console.error("Erro de resposta do servidor:", error.response.data);
        console.error("Status do erro:", error.response.status);
        return `Erro do servidor: ${error.response.status}`;
    } else if (error.request) {
        // A requisição foi feita mas não houve resposta
        console.error("Erro de rede - sem resposta:", error.request);
        return "Erro de rede: não foi possível conectar ao servidor";
    } else {
        // Algo aconteceu na configuração da requisição que gerou um erro
        console.error("Erro na configuração da requisição:", error.message);
        return "Erro na configuração da requisição";
    }
};
