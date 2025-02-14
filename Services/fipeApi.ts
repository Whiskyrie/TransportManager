import axios from 'axios';
import { FipeBrand, FipeModel } from 'Types/fipeTypes';

const BASE_URL = 'https://parallelum.com.br/fipe/api/v1';

const cleanModelName = (modelName: string) => {
  // Remove informações entre parênteses e após o hífen
  return modelName.split('(')[0].split('-')[0].trim();
};

export const fipeApi = {
  getBrands: async () => {
    try {
      const response = await axios.get<FipeBrand[]>(`${BASE_URL}/carros/marcas`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar marcas:', error);
      return [];
    }
  },

  getModels: async (brandId: string) => {
    try {
      const response = await axios.get<{modelos: FipeModel[]}>(`${BASE_URL}/carros/marcas/${brandId}/modelos`);
      // Limpa os nomes dos modelos antes de retornar
      return response.data.modelos.map(model => ({
        ...model,
        nome: cleanModelName(model.nome)
      }));
    } catch (error) {
      console.error('Erro ao buscar modelos:', error);
      return [];
    }
  }
};