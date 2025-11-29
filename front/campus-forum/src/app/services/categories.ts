import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Category, 
  CreateCategoryRequest, 
  UpdateCategoryRequest,
  CategoryStatus 
} from '../shared/interfaces/category.interface';

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

import { getApiBaseUrl } from '../core/config/app.config';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private apiUrl = `${getApiBaseUrl()}/categories`;

  constructor(private http: HttpClient) {}

  // Obtener todas las categorías
  getCategories(status?: CategoryStatus, page?: number, pageSize?: number): Observable<PaginatedResponse<Category>> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    if (page) params = params.set('page', page);
    if (pageSize) params = params.set('page_size', pageSize);
    return this.http.get<PaginatedResponse<Category>>(this.apiUrl, { params });
  }

  // Obtener categoría por ID
  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}/`);
  }

  // Crear categoría
  createCategory(data: CreateCategoryRequest): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/`, data);
  }

  // Actualizar categoría
  updateCategory(id: number, data: UpdateCategoryRequest): Observable<Category> {
    return this.http.patch<Category>(`${this.apiUrl}/${id}/`, data);
  }

  // Eliminar categoría
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }

  // Cambiar estado de categoría
  toggleStatus(id: number): Observable<Category> {
    return this.http.patch<Category>(`${this.apiUrl}/${id}/toggle_status/`, {});
  }

  // Archivar categoría
  archiveCategory(id: number): Observable<Category> {
    return this.http.patch<Category>(`${this.apiUrl}/${id}/archive/`, {});
  }

  // Restaurar categoría archivada
  restoreCategory(id: number): Observable<Category> {
    return this.http.patch<Category>(`${this.apiUrl}/${id}/restore/`, {});
  }
}
