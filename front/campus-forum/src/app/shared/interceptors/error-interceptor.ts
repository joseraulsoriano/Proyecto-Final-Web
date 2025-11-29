import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Rutas de autenticación: dejar pasar el error original sin modificar
      const isAuthRoute = req.url.includes('/api/auth/login') || 
                         req.url.includes('/api/auth/register');
      
      if (isAuthRoute) {
        // Para login/register, devolver el error original para que el componente lo maneje
        return throwError(() => error);
      }

      let errorMessage = 'Ha ocurrido un error';

      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente
        errorMessage = error.error.message;
      } else {
        // Error del lado del servidor
        switch (error.status) {
                 case 401:
                   // No autorizado - solo redirigir si es una ruta protegida
                   const isPublicRoute = req.url.includes('/api/categories') ||
                                        req.url.includes('/api/posts/');
            
            // Para rutas públicas con 401, simplemente devolver el error sin procesarlo
            // Esto permite que el componente maneje el error (puede ser normal si no hay posts)
            if (isPublicRoute) {
              // Para rutas públicas, devolver el error original sin modificar
              // El componente puede decidir cómo manejarlo
              return throwError(() => error);
            }
            
            // Para rutas protegidas, manejar el error normalmente
            const hasToken = localStorage.getItem('access_token');
            
            if (hasToken) {
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              localStorage.removeItem('current_user');
              router.navigate(['/auth/login'], {
                queryParams: { returnUrl: router.url }
              });
              errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
            } else {
              errorMessage = 'No autorizado. Por favor, inicia sesión.';
            }
            break;
          case 403:
            // Prohibido - sin permisos
            errorMessage = error.error?.detail || 'No tienes permisos para realizar esta acción.';
            break;
          case 404:
            errorMessage = error.error?.detail || 'El recurso solicitado no fue encontrado.';
            break;
          case 500:
            errorMessage = 'Error del servidor. Por favor, intenta más tarde.';
            break;
          default:
            errorMessage = error.error?.detail || 
                          error.error?.message || 
                          error.error?.error || 
                          `Error ${error.status}: ${error.statusText}`;
        }
      }

      // No mostrar error en consola para rutas públicas que fallan (puede ser normal)
      const isPublicRoute = req.url.includes('/api/categories') ||
                           req.url.includes('/api/posts/');
      
      if (!isPublicRoute || error.status !== 401) {
        console.error('Error interceptado:', errorMessage);
      }

      return throwError(() => new Error(errorMessage));
    })
  );
};
