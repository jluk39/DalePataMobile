import Constants from 'expo-constants';

// API Configuration for DalePata Mobile
export const API_CONFIG = {
  BASE_URL: Constants.expoConfig?.extra?.apiBaseUrl || process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.dalepata.com/api',
  TIMEOUT: 30000,
  DEBUG: __DEV__, // Activa logs en desarrollo
}

// Optional: Supabase configuration (if needed)
export const SUPABASE_CONFIG = {
  URL: Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  ANON_KEY: Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
}

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  REGISTER_USER: '/auth/register/usuario',
  REGISTER_SHELTER: '/auth/register/refugio',
  REGISTER_VET: '/auth/register/veterinaria',
  REGISTER_DOCTOR: '/auth/register/medico',
  PROFILE: '/auth/profile',
  REFRESH_TOKEN: '/auth/refresh-token',
  CHECK_EMAIL: (email: string) => `/auth/check-email/${email}`,
  
  // Pets
  LIST_PETS: '/mascotas',
  LIST_ADOPTION_PETS: '/listarMascotas', // ✅ Endpoint correcto del backend
  GET_PET: (petId: number | string) => `/mascotas/${petId}`,
  CREATE_PET: '/mascotas',
  UPDATE_PET: (petId: number | string) => `/mascotas/${petId}`,
  DELETE_PET: (petId: number | string) => `/mascotas/${petId}`,
  MY_PETS: '/mascotas/mis-mascotas',
  
  // Adoption Requests
  LIST_ADOPTION_REQUESTS: '/solicitudes',
  MY_ADOPTION_REQUESTS: '/solicitudes/mis-solicitudes', // ✅ Endpoint correcto
  GET_ADOPTION_REQUEST: (requestId: number | string) => `/solicitudes/${requestId}`,
  CREATE_ADOPTION_REQUEST: (petId: number | string) => `/solicitudes/mascota/${petId}`,
  CREATE_ADOPTION: '/adopciones',
  CANCEL_ADOPTION_REQUEST: (requestId: number | string) => `/solicitudes/${requestId}/cancelar`, // ✅ Endpoint correcto
  UPDATE_ADOPTION_REQUEST_STATUS: (requestId: number | string) => `/solicitudes/${requestId}/estado`,
}

// Debug logging helper
export const debugLog = (...args: any[]) => {
  if (API_CONFIG.DEBUG) {
    console.log('[API Debug]', ...args)
  }
}

// Error handling helper
export const handleApiError = (error: any, context: string) => {
  debugLog(`Error in ${context}:`, error)
  
  if (error.message) {
    return error
  }
  
  if (typeof error === 'string') {
    return new Error(error)
  }
  
  return new Error('Ha ocurrido un error inesperado')
}
