import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Report, CreateReportRequest, ResolveReportRequest, ReportStatus } from '../shared/interfaces/report.interface';
import { PaginatedResponse } from './categories';

import { getApiBaseUrl } from '../core/config/app.config';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiUrl = `${getApiBaseUrl()}/reports`;

  constructor(private http: HttpClient) {}

  // Obtener todos los reportes
  getReports(status?: ReportStatus): Observable<Report[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<PaginatedResponse<Report> | Report[]>(this.apiUrl, { params })
      .pipe(
        map(response => {
          if (Array.isArray(response)) {
            return response;
          }
          return response.results;
        })
      );
  }

  // Obtener reporte por ID
  getReport(id: number): Observable<Report> {
    return this.http.get<Report>(`${this.apiUrl}/${id}/`);
  }

  // Crear reporte
  createReport(data: CreateReportRequest): Observable<Report> {
    return this.http.post<Report>(this.apiUrl, data);
  }

  // Marcar como revisado (moderador)
  reviewReport(id: number): Observable<Report> {
    return this.http.post<Report>(`${this.apiUrl}/${id}/review/`, {});
  }

  // Resolver reporte (moderador)
  resolveReport(id: number, data: ResolveReportRequest): Observable<Report> {
    return this.http.post<Report>(`${this.apiUrl}/${id}/resolve/`, data);
  }

  // Descartar reporte (moderador)
  dismissReport(id: number, action_taken?: string): Observable<Report> {
    return this.http.post<Report>(`${this.apiUrl}/${id}/dismiss/`, {
      action_taken: action_taken || 'Reporte descartado'
    });
  }
}
