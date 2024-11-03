import { Alert } from 'react-native';
import { RouteDetails, Coordinates, OSRMResponse } from "Types/distanceTypes";


const getErrorMessage = (error: any): string => {
    if (error.message === 'GEOCODING_FAILED') {
        return 'Não foi possível encontrar as coordenadas para um ou mais endereços fornecidos.';
    }
    if (error.message === 'NO_ROUTE_FOUND') {
        return 'Não foi possível encontrar uma rota entre os pontos especificados.';
    }
    if (error.message === 'NETWORK_ERROR') {
        return 'Erro de conexão. Verifique sua internet e tente novamente.';
    }
    return error.message || 'Erro desconhecido ao calcular a rota.';
};

// Função para geocodificar endereço usando Nominatim
const geocodeAddress = async (address: string): Promise<Coordinates> => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
                address
            )}&format=json&limit=1`,
            {
                headers: {
                    'Accept-Language': 'pt-BR',
                    'User-Agent': 'YourAppName/1.0' // Importante: Substitua pelo nome do seu app
                }
            }
        );

        if (!response.ok) {
            throw new Error('NETWORK_ERROR');
        }

        const data = await response.json();

        if (!data || data.length === 0) {
            throw new Error('GEOCODING_FAILED');
        }

        return {
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon)
        };
    } catch (error) {
        console.error('Erro na geocodificação:', error);
        throw error;
    }
};

const calculateRouteDetails = async (origin: string, destination: string): Promise<RouteDetails> => {
    try {
        // Validação básica
        if (!origin.trim() || !destination.trim()) {
            throw new Error('Os endereços de origem e destino são obrigatórios.');
        }

        // Obter coordenadas para origem e destino
        const [originCoords, destCoords] = await Promise.all([
            geocodeAddress(origin),
            geocodeAddress(destination)
        ]);

        // Fazer requisição ao OSRM
        const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${originCoords.lon},${originCoords.lat};${destCoords.lon},${destCoords.lat}?overview=false`
        );

        if (!response.ok) {
            throw new Error('NETWORK_ERROR');
        }

        const data: OSRMResponse = await response.json();

        if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
            throw new Error('NO_ROUTE_FOUND');
        }

        const route = data.routes[0];

        return {
            distance: (route.distance / 1000).toFixed(2), // Converte metros para quilômetros
            duration: Math.ceil(route.duration / 60).toString() // Converte segundos para minutos
        };
    } catch (error) {
        // Log detalhado para debugging
        console.error('Detalhes do erro:', {
            message: error instanceof Error ? error.message : 'Erro desconhecido',
            origin,
            destination,
            timestamp: new Date().toISOString()
        });

        // Determina a mensagem de erro apropriada
        const errorMessage = getErrorMessage(error);

        // Exibe alerta para o usuário
        Alert.alert(
            'Erro no Cálculo da Rota',
            errorMessage,
            [
                {
                    text: 'OK',
                    onPress: () => console.log('Alerta de erro fechado')
                }
            ]
        );

        throw new Error(errorMessage);
    }
};

// Função auxiliar para adicionar delay entre requisições
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Versão modificada que respeita limites de taxa do Nominatim
export const calculateRouteDetailsWithRateLimit = async (
    origin: string,
    destination: string
): Promise<RouteDetails> => {
    try {
        // Adiciona um pequeno delay para respeitar os limites de taxa do Nominatim
        await delay(1000);
        return await calculateRouteDetails(origin, destination);
    } catch (error) {
        throw error;
    }
};

export default calculateRouteDetailsWithRateLimit;