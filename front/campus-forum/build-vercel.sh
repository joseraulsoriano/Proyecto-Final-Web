#!/bin/bash

# Script de build para Vercel
# Reemplaza la URL de la API en el código antes del build

# Obtener la variable de entorno de Vercel (con fallback a localhost)
API_URL="${NG_APP_API_URL:-http://localhost:8001/api}"

# Crear archivo de configuración con la URL de la API
cat > src/app/core/config/api-url.ts <<EOF
// Este archivo se genera automáticamente durante el build en Vercel
// NO editar manualmente
export const API_BASE_URL = '${API_URL}';
EOF

# Ejecutar el build de Angular
ng build --configuration production

