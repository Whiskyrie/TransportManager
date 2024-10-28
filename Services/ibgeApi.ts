import axios from 'axios';

const ibgeApi = axios.create({
    baseURL: 'https://servicodados.ibge.gov.br/api/v1'
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

export const ibgeService = {
    // Buscar todos os estados
    getEstados: async (): Promise<Estado[]> => {
        try {
            const response = await ibgeApi.get<Estado[]>('/localidades/estados');
            return response.data.sort((a, b) => a.nome.localeCompare(b.nome));
        } catch (error) {
            console.error('Erro ao buscar estados:', error);
            throw error;
        }
    },

    // Buscar municípios por estado
    getMunicipiosPorEstado: async (ufId: number): Promise<Municipio[]> => {
        try {
            const response = await ibgeApi.get<Municipio[]>(`/localidades/estados/${ufId}/municipios`);
            return response.data.sort((a, b) => a.nome.localeCompare(b.nome));
        } catch (error) {
            console.error('Erro ao buscar municípios:', error);
            throw error;
        }
    },

    // Buscar municípios que correspondam a um termo de busca
    buscarMunicipios: async (termo: string): Promise<Municipio[]> => {
        try {
            // Primeiro, buscamos todos os estados
            const estados = await ibgeService.getEstados();

            // Depois, buscamos os municípios de todos os estados em paralelo
            const municipiosPromises = estados.map(estado =>
                ibgeService.getMunicipiosPorEstado(estado.id)
            );

            const todosMunicipios = await Promise.all(municipiosPromises);

            // Flatten o array de arrays e filtra os municípios que correspondem ao termo
            const municipiosFiltrados = todosMunicipios
                .flat()
                .filter(municipio =>
                    municipio.nome.toLowerCase().includes(termo.toLowerCase()) ||
                    municipio.microrregiao.mesorregiao.UF.nome.toLowerCase().includes(termo.toLowerCase())
                )
                .sort((a, b) => a.nome.localeCompare(b.nome));

            return municipiosFiltrados.slice(0, 10); // Limita a 10 resultados
        } catch (error) {
            console.error('Erro ao buscar municípios:', error);
            throw error;
        }
    }
};