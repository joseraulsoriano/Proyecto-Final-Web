# Guía de Despliegue en Vercel

## Configuración Necesaria

### 1. Variables de Entorno en Vercel

Ve a **Settings → Environment Variables** en tu proyecto de Vercel y agrega:

```
NG_APP_API_URL = https://tu-backend-url.com/api
```

**Importante:** Reemplaza `https://tu-backend-url.com/api` con la URL real de tu backend.

### 2. Comando de Build

Vercel detectará automáticamente que es un proyecto Angular y usará:
- **Build Command:** `chmod +x build-vercel.sh && ./build-vercel.sh`
- **Output Directory:** `dist/campus-forum/browser`

### 3. Archivos de Configuración

El proyecto ya incluye:
- ✅ `vercel.json` - Configuración de Vercel
- ✅ `build-vercel.sh` - Script que genera la configuración de API
- ✅ `src/app/core/config/api-url.ts` - Archivo generado automáticamente

### 4. Pasos para Desplegar

1. **Conecta tu repositorio a Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Importa tu proyecto desde GitHub/GitLab/Bitbucket
   - Selecciona el directorio `front/campus-forum`

2. **Configura las variables de entorno:**
   - Settings → Environment Variables
   - Agrega `NG_APP_API_URL` con la URL de tu backend

3. **Despliega:**
   - Vercel detectará automáticamente la configuración
   - El build se ejecutará automáticamente
   - Tu aplicación estará disponible en la URL de Vercel

### 5. Verificación Post-Despliegue

Después del despliegue, verifica:
- ✅ La aplicación carga correctamente
- ✅ Las peticiones a la API funcionan (revisa la consola del navegador)
- ✅ El modo dark/light funciona
- ✅ El routing funciona correctamente (SPA)

### Notas Importantes

- El archivo `api-url.ts` se genera automáticamente durante el build
- No edites manualmente `api-url.ts` ya que se sobrescribe en cada build
- Si cambias la URL del backend, actualiza la variable de entorno y re-despliega

