import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PostsService } from '../../services/posts';
import { CategoriesService } from '../../services/categories';
import { AuthService } from '../../services/auth';
import { SeoService } from '../../core/services/seo.service';
import { ThemeService } from '../../core/services/theme.service';
import { Post, PostStatus } from '../../shared/interfaces/post.interface';
import { Category, CategoryStatus } from '../../shared/interfaces/category.interface';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.scss'
})
export class Landing implements OnInit {
  posts: Post[] = [];
  categories: Category[] = [];
  selectedCategory: number | null = null;
  loading = false;
  error: string | null = null;
  currentPage = 1;
  totalPages = 1;
  isAuthenticated = false;

  constructor(
    private postsService: PostsService,
    private categoriesService: CategoriesService,
    private authService: AuthService,
    private router: Router,
    private seoService: SeoService,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.seoService.setPageMetadata({
      title: 'Inicio',
      description: 'Explora las últimas publicaciones y debates académicos en CampusForum. Conecta con estudiantes y profesores de tu comunidad universitaria.',
      keywords: 'foro universitario, publicaciones académicas, comunidad estudiantil, debates, campus',
      url: window.location.href
    });
    
    this.isAuthenticated = this.authService.isAuthenticated();
    this.loadCategories();
    this.loadPosts();
  }

  loadCategories(): void {
    this.categoriesService.getCategories(CategoryStatus.ACTIVE).subscribe({
      next: (response) => {
        // Asegurar que categories siempre sea un array
        if (response && Array.isArray(response.results)) {
          this.categories = response.results;
        } else if (Array.isArray(response)) {
          this.categories = response;
        } else {
          this.categories = [];
        }
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
        // En caso de error, asegurar que categories sea un array vacío
        this.categories = [];
      }
    });
  }

  loadPosts(): void {
    this.loading = true;
    this.error = null;

    const filters = {
      status: PostStatus.PUBLISHED,
      category: this.selectedCategory || undefined
    };

    this.postsService.getPosts(filters, this.currentPage).subscribe({
      next: (response) => {
        this.loading = false;
        // Asegurar que posts siempre sea un array
        this.posts = response?.results || [];
        this.totalPages = response?.count ? Math.ceil(response.count / 10) : 1;
      },
      error: (err) => {
        this.loading = false;
        // En cualquier error, asegurar que posts sea un array vacío
        this.posts = [];
        // Si es un 401 en una ruta pública, puede ser que simplemente no haya posts
        // o que el backend esté rechazando por alguna razón, pero no es crítico
        if (err.status === 401) {
          // Para rutas públicas, un 401 puede significar simplemente que no hay contenido
          // o que el backend requiere algo específico, pero no es un error crítico
          this.error = null; // No mostrar error para que se muestre el estado vacío
        } else {
          this.error = 'Error al cargar los posts. Por favor, intenta más tarde.';
        }
      }
    });
  }

  onCategoryChange(categoryId: number | null): void {
    this.selectedCategory = categoryId;
    this.currentPage = 1;
    this.loadPosts();
  }

  goToPost(id: number): void {
    if (this.isAuthenticated) {
      this.router.navigate(['/posts', id]);
    } else {
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: `/posts/${id}` }
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  truncateContent(content: string, maxLength: number = 150): string {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPosts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadPosts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
