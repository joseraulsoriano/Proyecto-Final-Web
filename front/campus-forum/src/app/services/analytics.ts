import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Statistics, CategoryStatistics } from '../shared/interfaces/analytics.interface';

import { getApiBaseUrl } from '../core/config/app.config';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = `${getApiBaseUrl()}/analytics`;

  constructor(private http: HttpClient) {}

  // Obtener estadísticas generales
  getStatistics(): Observable<Statistics> {
    return this.http.get<Statistics>(this.apiUrl);
  }

  // Obtener estadísticas de una categoría
  getCategoryStatistics(categoryId: number): Observable<CategoryStatistics> {
    return this.http.get<CategoryStatistics>(`${this.apiUrl}/category/${categoryId}/`);
  }
}
