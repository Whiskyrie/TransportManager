import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginData, AuthResponse, RegisterData } from 'Types/authTypes';
import { config } from 'Config/config';

const createAxiosInstance = (): AxiosInstance => {
    const instance = axios.create({
        baseURL: config.API_BASE_URL,
        timeout: 10000,
    });

    instance.interceptors.request.use(
        async (config) => {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            console.log('Starting Request', JSON.stringify(config, null, 2));
            return config;
        },
        (error) => {
            console.log('Request Error:', error);
            return Promise.reject(error);
        }
    );

    instance.interceptors.response.use(
        (response) => {
            console.log('Response:', JSON.stringify(response.data, null, 2));
            return response;
        },
        async (error) => {
            console.log('Response Error:', error);

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

export const getImageUrl = (filename: string | null): string | null => {
    if (!filename) return null;

    // If the filename is already a full URL, return it as is
    if (filename.startsWith('http')) {
        return filename;
    }

    // Construct the full URL
    return `${config.API_BASE_URL}${config.PROFILE_PICTURES_PATH}/${filename}`;
};

export const api = {
    // Auth endpoints
    login: (data: LoginData) =>
        axiosInstance.post<AuthResponse>('auth/login', data),

    register: (data: RegisterData) =>
        axiosInstance.post<AuthResponse>('auth/register', data),

    resetPassword: ({ code, newPassword }: { code: string; newPassword: string }) => {
        return axiosInstance.post('auth/reset-password', { code, newPassword }, {
            headers: {
                Authorization: undefined, // Explicitly remove the Authorization header
            },
        });
    },

    // Function to send reset password code to the user's email
    sendResetPasswordCode: (email: string) => {
        return axiosInstance.post('auth/send-reset-password-code', { email }, {
            headers: {
                Authorization: undefined, // Ensure no token is attached here
            },
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
    getProfilePicture: (userId: string) =>
        axiosInstance.get(`${config.PROFILE_PICTURES_PATH}/${userId}`),

    getProfilePictureUrl: (filename: string): string =>
        getImageUrl(filename) || '',

    uploadProfilePicture: (formData: FormData) =>
        axiosInstance.post('upload/profile-picture', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }),

    deleteProfilePicture: () =>
        axiosInstance.delete('upload/profile-picture'),

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
