import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';

import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  User,
  UpdateProfileRequest 
} from '../shared/interfaces/user.interface';
import { getApiBaseUrl } from '../core/config/app.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = getApiBaseUrl();
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  // Login
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login/`, credentials)
      .pipe(
        tap(response => {
          this.handleAuthResponse(response);
        })
      );
  }

  // Registro
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register/`, data)
      .pipe(
        tap(response => {
          this.handleAuthResponse(response);
        })
      );
  }

  // Logout
  logout(): void {
    const refresh = localStorage.getItem('refresh_token');
    if (refresh) {
      this.http.post(`${this.apiUrl}/users/logout/`, { refresh })
        .subscribe({
          next: () => {},
          error: () => {}
        });
    }
    this.clearAuthData();
    this.router.navigate(['/auth/login']);
  }

  // Obtener usuario actual
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/me/`)
      .pipe(
        tap(user => {
          this.currentUserSubject.next(user);
          localStorage.setItem('current_user', JSON.stringify(user));
        })
      );
  }

  // Actualizar perfil
  updateProfile(data: UpdateProfileRequest | FormData): Observable<User> {
    // Si ya es FormData, usarlo directamente, sino convertirlo
    let formData: FormData;
    if (data instanceof FormData) {
      formData = data;
    } else {
      formData = new FormData();
      if (data.first_name) formData.append('first_name', data.first_name);
      if (data.last_name) formData.append('last_name', data.last_name);
      if (data.profile_picture) formData.append('profile_picture', data.profile_picture);
    }

    return this.http.patch<User>(`${this.apiUrl}/users/me/`, formData)
      .pipe(
        tap(user => {
          this.currentUserSubject.next(user);
          localStorage.setItem('current_user', JSON.stringify(user));
        })
      );
  }

  // Refresh token
  refreshToken(): Observable<{ access: string }> {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) {
      throw new Error('No refresh token available');
    }
    // Django REST Framework SimpleJWT espera 'refresh' en el body
    return this.http.post<{ access: string }>(`${this.apiUrl}/auth/refresh/`, { refresh });
  }

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  // Obtener token
  getToken(): string | null {
    const token = localStorage.getItem('access_token');
    // Validar que el token no esté vacío o malformado
    if (token && token.trim().length > 0) {
      return token;
    }
    return null;
  }

  // Validar si el token es válido (formato básico)
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // Un JWT válido tiene 3 partes separadas por puntos
    const parts = token.split('.');
    return parts.length === 3;
  }

  // Obtener usuario actual del localStorage
  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Helpers privados
  private handleAuthResponse(response: AuthResponse): void {
    localStorage.setItem('access_token', response.access);
    localStorage.setItem('refresh_token', response.refresh);
    localStorage.setItem('current_user', JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  private loadUserFromStorage(): void {
    const user = localStorage.getItem('current_user');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  private clearAuthData(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('current_user');
    this.currentUserSubject.next(null);
  }
}
