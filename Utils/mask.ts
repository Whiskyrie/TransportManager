// Utils/masks.ts
export const masks = {
    phone: (value: string): string => {
      const cleaned = value.replace(/\D/g, '');
      let formatted = cleaned;
      if (cleaned.length >= 2) {
        formatted = `(${cleaned.slice(0, 2)}`;
        if (cleaned.length >= 7) {
          formatted += `) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
        } else if (cleaned.length > 2) {
          formatted += `) ${cleaned.slice(2)}`;
        }
      }
      return formatted;
    },
  
    plate: (value: string): string => {
      // Converte para maiúsculo e remove caracteres especiais
      return value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    },
  
    document: (value: string): string => {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 11) {
        // CPF: 000.000.000-00
        return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      } else {
        // CNPJ: 00.000.000/0000-00
        return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
      }
    }
  };