export interface ValidationItem {
    isValid: boolean;
    message: string;
  }
  export type ValidationType = 'email' | 'password' | 'name' | 'phone' | 'plate' | 'document' | 'year';