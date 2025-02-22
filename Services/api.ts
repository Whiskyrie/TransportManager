import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginData, AuthResponse, RegisterData } from 'Types/authTypes';
import { config } from 'Config/config';
import { UploadResponse } from 'Types/authTypes';

const createAxiosInstance = (): AxiosInstance => {
    const instance = axios.create({
        baseURL: config.API_BASE_URL,
        timeout: 20000, // Você pode aumentar este valor se necessário
    });

    instance.interceptors.request.use(
        async (config) => {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    instance.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {

            // Handle 401 errors (unauthorized)
            if (error.response?.status === 401) {
                await AsyncStorage.removeItem('token');
                await AsyncStorage.removeItem('user');
                // Optionally trigger navigation to login screen here
            }

            return Promise.reject(error);
        }
    );

    return instance;
};

const axiosInstance = createAxiosInstance();

// Adicione esta função auxiliar
export const getImageUrl = (imageData: string | null): string => {
    if (!imageData) return '';
    
    // Se já for uma string base64 completa, retorne como está
    if (imageData.startsWith('data:image')) {
        return imageData;
    }
    
    // Se for uma URL, retorne como está
    if (imageData.startsWith('http')) {
        return imageData;
    }
    
    // Se for apenas o base64 sem o prefixo, adicione o prefixo
    if (imageData.length > 0) {
        return `data:image/jpeg;base64,${imageData}`;
    }
    
    return '';
};

export const api = {
    // Auth endpoints
    login: (data: LoginData) =>
        axiosInstance.post<AuthResponse>('auth/login', data),

    register: (data: RegisterData) =>
        axiosInstance.post<AuthResponse>('auth/register', data),

    resetPassword: ({ email, newPassword }: { email: string; newPassword: string }) => {
        return axiosInstance.post('auth/reset-password', { email, newPassword });
    },
    

    // Function to send reset password code to the user's email
    sendResetPasswordCode: (email: string) => {
        return axiosInstance.post('auth/send-reset-password-code', { email }, {
        });
    },
    // Function to verify reset password code
     verifyResetPasswordCode: ({ email, code }: { email: string; code: string }) =>
    axiosInstance.post('auth/verify-reset-code', { email, code }), 
           
    logout: async () => {
        try {
            const token = await AsyncStorage.getItem('token');

            if (token) {
                await axiosInstance.post('auth/logout', null, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
        } catch (error) {
            console.warn("Erro ao notificar servidor sobre logout:", error);
        } finally {
            await AsyncStorage.multiRemove(['token', 'user']);
        }
    },
    getProfilePicture: async (userId: string) => {
        try {
            const response = await axiosInstance.get(`users/${userId}/profile-picture`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    
    uploadProfilePicture: async (formData: FormData): Promise<UploadResponse> => {
        const response = await axiosInstance.post('/upload/profile-picture', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deleteProfilePicture: async () => {
        return await axiosInstance.delete('/upload/profile-picture');
    },

    // Routes endpoints
    getAllRoutes: () =>
        axiosInstance.get('routes'),

    getRoute: (id: string) =>
        axiosInstance.get(`routes/${id}`),

    createRoute: (routeData: any) =>
        axiosInstance.post('routes', routeData),

    updateRoute: (id: string, routeData: any) =>
        axiosInstance.patch(`routes/${id}`, routeData),

    deleteRoute: (id: string) =>
        axiosInstance.delete(`routes/${id}`),

    startRoute: (id: string) =>
        axiosInstance.post(`routes/${id}/start`),

    completeRoute: (id: string) =>
        axiosInstance.post(`routes/${id}/complete`),

    cancelRoute: (id: string) =>
        axiosInstance.post(`routes/${id}/cancel`),

    // Vehicles endpoints
    getAllVehicles: () =>
        axiosInstance.get('vehicles'),

    getVehicle: (id: string) =>
        axiosInstance.get(`vehicles/${id}`),

    createVehicle: (vehicleData: any) =>
        axiosInstance.post('vehicles', vehicleData),

    updateVehicle: (id: string, vehicleData: any) =>
        axiosInstance.patch(`vehicles/${id}`, vehicleData),

    deleteVehicle: (id: string) =>
        axiosInstance.delete(`vehicles/${id}`),

    // Drivers endpoints
    getAllDrivers: () =>
        axiosInstance.get('driver'),

    getDriver: (id: string) =>
        axiosInstance.get(`driver/${id}`),

    createDriver: (driverData: any) =>
        axiosInstance.post('driver', driverData),

    updateDriver: (id: string, driverData: any) =>
        axiosInstance.patch(`driver/${id}`, driverData),

    deleteDriver: (id: string) =>
        axiosInstance.delete(`driver/${id}`)
};

export const handleApiError = (error: any): string => {
    if (error.response) {
        const status = error.response.status;
        const serverMessage = error.response.data?.message;

        const errorMessages: Record<number, string> = {
            400: "Dados inválidos. Verifique as informações e tente novamente.",
            401: "Sessão expirada. Por favor, faça login novamente.",
            403: "Você não tem permissão para realizar esta ação.",
            404: "Recurso não encontrado.",
            409: "Conflito com dados existentes.",
            500: serverMessage || "Erro interno do servidor. Tente novamente mais tarde."
        };

        return errorMessages[status] || `Erro do servidor: ${status}`;
    }

    if (error.request) {
        if (error.code === 'ECONNABORTED') {
            return "Tempo de conexão esgotado. Verifique sua conexão e tente novamente.";
        }
        return "Erro de conexão. Verifique sua internet e tente novamente.";
    }

    return "Ocorreu um erro inesperado. Tente novamente.";
};
