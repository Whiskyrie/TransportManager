import { Platform } from 'react-native';

// Detecta o ambiente (Android emulador ou dispositivo físico)
const isAndroidEmulator = Platform.OS === 'android';

export const config = {
    API_BASE_URL: isAndroidEmulator ? 'http://10.51.3.249:3000' : 'http://10.51.3.249:3000',  // Para o emulador Android, usa 10.0.2.2
    PROFILE_PICTURES_PATH: '/uploads'
  };
  

