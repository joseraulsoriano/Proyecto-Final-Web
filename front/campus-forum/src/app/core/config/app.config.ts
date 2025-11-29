/**
 * Configuración de la aplicación usando variables de entorno
 * 
 * En desarrollo: usa http://localhost:8001/api
 * En producción (Vercel): usa la variable de entorno NG_APP_API_URL
 * 
 * Para configurar en Vercel:
 * 1. Ve a Settings → Environment Variables
 * 2. Agrega: NG_APP_API_URL = https://tu-backend-url.com/api
 * 3. Re-despliega la aplicación
 * 
 * Nota: Vercel reemplaza automáticamente las variables NG_APP_* durante el build.
 */
import { API_BASE_URL } from './api-url';

export function getApiBaseUrl(): string {
  // En el navegador, intenta leer de window si está disponible (para inyección dinámica)
  if (typeof window !== 'undefined' && (window as any).__API_URL__) {
    return (window as any).__API_URL__;
  }
  
  // Usa la URL de la API configurada (se genera automáticamente en Vercel)
  // Si no existe el archivo api-url.ts, usa localhost por defecto
  try {
    return API_BASE_URL || 'http://localhost:8001/api';
  } catch {
    return 'http://localhost:8001/api';
  }
}

