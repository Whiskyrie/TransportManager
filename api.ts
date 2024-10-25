import axios, { AxiosInstance } from 'axios';

const API_URL = 'http://10.0.2.2:3000/'; // Use o IP correto para iOS se necessário

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
    // Funções para rotas
    getAllRoutes: () => axiosInstance.get('routes'),
    getRoute: (id: string) => axiosInstance.get(`routes/${id}`),
    createRoute: (routeData: any) => axiosInstance.post('routes', routeData),
    updateRoute: (id: string, routeData: any) => axiosInstance.patch(`routes/${id}`, routeData),
    deleteRoute: (id: string) => axiosInstance.delete(`routes/${id}`),
    startRoute: (id: string) => axiosInstance.post(`routes/${id}/start`),
    completeRoute: (id: string) => axiosInstance.post(`routes/${id}/complete`),
    cancelRoute: (id: string) => axiosInstance.post(`routes/${id}/cancel`),

    // Funções para veículos
    getAllVehicles: () => axiosInstance.get('vehicles'),
    getVehicle: (id: string) => axiosInstance.get(`vehicles/${id}`),
    createVehicle: (vehicleData: any) => axiosInstance.post('vehicles', vehicleData),
    updateVehicle: (id: string, vehicleData: any) => axiosInstance.patch(`vehicles/${id}`, vehicleData),
    deleteVehicle: (id: string) => axiosInstance.delete(`vehicles/${id}`),

    // Funções para motoristas
    getAllDrivers: () => axiosInstance.get('driver'),
    getDriver: (id: string) => axiosInstance.get(`driver/${id}`),
    createDriver: (driverData: any) => axiosInstance.post('driver', driverData),
    updateDriver: (id: string, driverData: any) => axiosInstance.patch(`driver/${id}`, driverData),
    deleteDriver: (id: string) => axiosInstance.delete(`driver/${id}`),
};

export const handleApiError = (error: any) => {
    if (error.response) {
        // Tratamento específico para erros comuns
        switch (error.response.status) {
            case 400:
                return "Dados inválidos. Verifique as informações e tente novamente.";
            case 401:
                return "Não autorizado. Faça login novamente.";
            case 403:
                return "Você não tem permissão para realizar esta ação.";
            case 404:
                return "Recurso não encontrado.";
            case 409:
                return "Conflito com dados existentes.";
            case 500:
                // Verifica se há uma mensagem específica do servidor
                if (error.response.data?.message) {
                    return error.response.data.message;
                }
                return "Erro interno do servidor. Tente novamente mais tarde.";
            default:
                return `Erro do servidor: ${error.response.status}`;
        }
    } else if (error.request) {
        if (error.code === 'ECONNABORTED') {
            return "Tempo de conexão esgotado. Verifique sua conexão e tente novamente.";
        }
        return "Erro de conexão. Verifique sua internet e tente novamente.";
    } else {
        return "Ocorreu um erro inesperado. Tente novamente.";
    }
};