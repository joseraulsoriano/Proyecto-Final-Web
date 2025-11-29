import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Comment, CreateCommentRequest, UpdateCommentRequest } from '../shared/interfaces/comment.interface';
import { PaginatedResponse } from './categories';

import { getApiBaseUrl } from '../core/config/app.config';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private apiUrl = `${getApiBaseUrl()}/comments`;

  constructor(private http: HttpClient) {}

  // Obtener comentarios de un post
  getCommentsByPost(postId: number): Observable<Comment[]> {
    const params = new HttpParams().set('post', postId.toString());
    return this.http.get<PaginatedResponse<Comment> | Comment[]>(this.apiUrl, { params })
      .pipe(
        map(response => {
          if (Array.isArray(response)) {
            return response;
          }
          return response.results;
        })
      );
  }

  // Obtener comentario por ID
  getComment(id: number): Observable<Comment> {
    return this.http.get<Comment>(`${this.apiUrl}/${id}/`);
  }

  // Crear comentario
  createComment(data: CreateCommentRequest): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/`, data);
  }

  // Actualizar comentario
  updateComment(id: number, data: UpdateCommentRequest): Observable<Comment> {
    return this.http.patch<Comment>(`${this.apiUrl}/${id}/`, data);
  }

  // Eliminar comentario
  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }
}
