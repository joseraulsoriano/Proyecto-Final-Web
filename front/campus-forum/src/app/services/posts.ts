import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { 
  Post, 
  CreatePostRequest, 
  UpdatePostRequest, 
  PostFilters,
  PostStatus 
} from '../shared/interfaces/post.interface';
import { Tag } from '../shared/interfaces/post.interface';

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
export class PostsService {
  private apiUrl = `${getApiBaseUrl()}/posts`;

  constructor(private http: HttpClient) {}

  // Obtener todos los posts con filtros opcionales
  getPosts(filters?: PostFilters, page?: number, pageSize?: number): Observable<PaginatedResponse<Post>> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.category) params = params.set('category', filters.category);
      if (filters.status) params = params.set('status', filters.status);
      if (filters.author) params = params.set('author', filters.author);
      if (filters.search) params = params.set('search', filters.search);
    }
    
    if (page) params = params.set('page', page);
    if (pageSize) params = params.set('page_size', pageSize);

    // El endpoint correcto es /api/posts/posts/ (el router está registrado como 'posts' dentro de /api/posts/)
    return this.http.get<PaginatedResponse<Post>>(`${this.apiUrl}/posts/`, { params });
  }

  // Obtener post por ID
  getPost(id: number): Observable<Post> {
    // El endpoint correcto es /api/posts/posts/{id}/
    return this.http.get<Post>(`${this.apiUrl}/posts/${id}/`);
  }

  // Obtener mis posts
  getMyPosts(page?: number, pageSize?: number): Observable<PaginatedResponse<Post>> {
    let params = new HttpParams();
    if (page) params = params.set('page', page);
    if (pageSize) params = params.set('page_size', pageSize);
    // El endpoint correcto es /api/posts/posts/my-posts/
    return this.http.get<PaginatedResponse<Post>>(`${this.apiUrl}/posts/my-posts/`, { params });
  }

  // Crear post
  createPost(data: CreatePostRequest): Observable<Post> {
    // El endpoint correcto es /api/posts/posts/
    return this.http.post<Post>(`${this.apiUrl}/posts/`, data);
  }

  // Actualizar post
  updatePost(id: number, data: UpdatePostRequest): Observable<Post> {
    // El endpoint correcto es /api/posts/posts/{id}/
    return this.http.patch<Post>(`${this.apiUrl}/posts/${id}/`, data);
  }

  // Eliminar post
  deletePost(id: number): Observable<void> {
    // El endpoint correcto es /api/posts/posts/{id}/
    return this.http.delete<void>(`${this.apiUrl}/posts/${id}/`);
  }

  // Publicar post
  publishPost(id: number): Observable<Post> {
    // El endpoint correcto es /api/posts/posts/{id}/publish/
    return this.http.patch<Post>(`${this.apiUrl}/posts/${id}/publish/`, {});
  }

  // Archivar post
  archivePost(id: number): Observable<Post> {
    // El endpoint correcto es /api/posts/posts/{id}/archive/
    return this.http.patch<Post>(`${this.apiUrl}/posts/${id}/archive/`, {});
  }

  // Restaurar post archivado (publicarlo de nuevo)
  restorePost(id: number): Observable<Post> {
    // El endpoint correcto es /api/posts/posts/{id}/publish/ (restaurar = publicar)
    return this.http.patch<Post>(`${this.apiUrl}/posts/${id}/publish/`, {});
  }

  // Obtener todas las etiquetas
  getTags(): Observable<Tag[]> {
    // El endpoint correcto es /api/posts/tags/
    return this.http.get<Tag[]>(`${this.apiUrl}/tags/`);
  }

  // Obtener conteo de posts archivados
  getArchivedPostsCount(): Observable<number> {
    // El endpoint correcto es /api/posts/posts/ con filtro de status
    return this.http.get<PaginatedResponse<Post>>(`${this.apiUrl}/posts/`, {
      params: new HttpParams().set('status', PostStatus.ARCHIVED).set('page_size', '1')
    }).pipe(
      map(response => response.count)
    );
  }

  // Obtener todos los posts archivados (sin paginación)
  getAllArchivedPosts(): Observable<Post[]> {
    // El endpoint correcto es /api/posts/posts/ con filtro de status
    return this.http.get<PaginatedResponse<Post>>(`${this.apiUrl}/posts/`, {
      params: new HttpParams().set('status', PostStatus.ARCHIVED).set('page_size', '1000')
    }).pipe(
      map(response => response.results)
    );
  }
}
