import axios from 'axios';

const ibgeApi = axios.create({
    baseURL: 'https://servicodados.ibge.gov.br/api/v1',
    timeout: 10000, // 5 segundos
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

export interface Estado {
    id: number;
    sigla: string;
    nome: string;
}

export interface Municipio {
    id: number;
    nome: string;
    microrregiao: {
        id: number;
        nome: string;
        mesorregiao: {
            id: number;
            nome: string;
            UF: {
                id: number;
                sigla: string;
                nome: string;
            }
        }
    }
}

export class IBGEApiError extends Error {
    constructor(message: string, public statusCode?: number) {
        super(message);
        this.name = 'IBGEApiError';
    }
}

let estadosCache: Estado[] | null = null;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hora
let lastFetchTimestamp = 0;

export const ibgeService = {
    // Buscar todos os estados
    getEstados: async (): Promise<Estado[]> => {
        const now = Date.now();
        
        // Retorna do cache se ainda for válido
        if (estadosCache && (now - lastFetchTimestamp) < CACHE_DURATION) {
            return estadosCache;
        }

        try {
            const response = await ibgeApi.get<Estado[]>('/localidades/estados');
            estadosCache = response.data.sort((a, b) => a.nome.localeCompare(b.nome));
            lastFetchTimestamp = now;
            return estadosCache;
        } catch (error) {
            console.error('Erro ao buscar estados:', error);
            throw error;
        }
    },

    // Buscar municípios por estado
    getMunicipiosPorEstado: async (ufId: number): Promise<Municipio[]> => {
        if (!Number.isInteger(ufId) || ufId <= 0) {
            throw new IBGEApiError('ID do estado inválido');
        }

        try {
            const response = await ibgeApi.get<Municipio[]>(`/localidades/estados/${ufId}/municipios`);
            return response.data.sort((a, b) => a.nome.localeCompare(b.nome));
        } catch (error: any) {
            const statusCode = error.response?.status;
            const message = `Erro ao buscar municípios: ${error.message}`;
            throw new IBGEApiError(message, statusCode);
        }
    },

    // Buscar municípios que correspondam a um termo de busca
    buscarMunicipios: async (termo: string): Promise<Municipio[]> => {
        if (!termo || typeof termo !== 'string') {
            throw new IBGEApiError('Termo de busca inválido');
        }

        if (termo.length < 2) {
            throw new IBGEApiError('O termo de busca deve ter pelo menos 2 caracteres');
        }

        try {
            const estados = await ibgeService.getEstados();
            const municipiosPromises = estados.map(estado =>
                ibgeService.getMunicipiosPorEstado(estado.id)
            );

            const todosMunicipios = await Promise.all(municipiosPromises);
            const termoLower = termo.toLowerCase().trim();
            const termoParts = termoLower.split(/[\s-]+/);

            // Função para calcular a pontuação de relevância
            const calcularPontuacao = (municipio: Municipio): number => {
                const nomeCidade = municipio.nome.toLowerCase();
                const nomeEstado = municipio.microrregiao.mesorregiao.UF.nome.toLowerCase();
                const siglaEstado = municipio.microrregiao.mesorregiao.UF.sigla.toLowerCase();
                let pontuacao = 0;

                // Correspondência exata com nome da cidade
                if (nomeCidade === termoLower) {
                    pontuacao += 100;
                }

                // Cidade começa com o termo de busca
                if (nomeCidade.startsWith(termoLower)) {
                    pontuacao += 50;
                }

                // Correspondência parcial com partes do nome
                termoParts.forEach(part => {
                    if (nomeCidade.includes(part)) {
                        pontuacao += 30;
                    }
                });

                // Correspondência com estado
                if (nomeEstado.includes(termoLower) || siglaEstado.includes(termoLower)) {
                    pontuacao += 20;
                }

                return pontuacao;
            };

            const municipiosPontuados = todosMunicipios
                .flat()
                .map(municipio => ({
                    municipio,
                    pontuacao: calcularPontuacao(municipio)
                }))
                .filter(item => item.pontuacao > 0)
                .sort((a, b) => {
                    // Primeiro ordena por pontuação
                    if (b.pontuacao !== a.pontuacao) {
                        return b.pontuacao - a.pontuacao;
                    }
                    // Em caso de empate, ordena alfabeticamente
                    return a.municipio.nome.localeCompare(b.municipio.nome);
                });

            // Retorna apenas os municípios, limitando a 10 resultados
            return municipiosPontuados
                .map(item => item.municipio)
                .slice(0, 10);
        } catch (error) {
            console.error('Erro ao buscar municípios:', error);
            throw error;
        }
    }

};