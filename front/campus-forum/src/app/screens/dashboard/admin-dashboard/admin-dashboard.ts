import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { PostsService } from '../../../services/posts';
import { NotificationService } from '../../../core/services/notification';
import { User, UserRole } from '../../../shared/interfaces/user.interface';
import { CategoriesListComponent } from '../components/categories-list/categories-list';
import { PostsListComponent } from '../components/posts-list/posts-list';
import { StatisticsPanelComponent } from '../components/statistics-panel/statistics-panel';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, CategoriesListComponent, PostsListComponent, StatisticsPanelComponent],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard implements OnInit {
  user: User | null = null;
  canEdit = false; // Admin o Profesor pueden editar
  showArchivedPosts = false; // Toggle para mostrar posts archivados
  archivedPostsCount = 0;
  loadingArchived = false;
  restoringAll = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private postsService: PostsService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUserValue();
    if (!this.user) {
      this.authService.getCurrentUser().subscribe({
        next: (user) => {
          this.user = user;
          this.updatePermissions();
          this.loadArchivedCount();
        },
        error: () => this.router.navigate(['/auth/login'])
      });
    } else {
      this.updatePermissions();
      this.loadArchivedCount();
    }
  }

  updatePermissions(): void {
    if (this.user) {
      this.canEdit = this.user.role === UserRole.ADMIN || this.user.role === UserRole.PROFESSOR;
    }
  }

  loadArchivedCount(): void {
    this.loadingArchived = true;
    this.postsService.getArchivedPostsCount().subscribe({
      next: (count) => {
        this.archivedPostsCount = count;
        this.loadingArchived = false;
      },
      error: () => {
        this.loadingArchived = false;
      }
    });
  }

  viewArchivedPosts(): void {
    this.showArchivedPosts = true;
    // Scroll suave a la sección de posts
    setTimeout(() => {
      const postsSection = document.querySelector('.posts-section-container');
      if (postsSection) {
        postsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  restoreAllArchivedPosts(): void {
    if (this.archivedPostsCount === 0) {
      this.notificationService.info('No hay posts archivados para restaurar');
      return;
    }

    if (!confirm(`¿Estás seguro de restaurar todos los ${this.archivedPostsCount} posts archivados?`)) {
      return;
    }

    this.restoringAll = true;
    this.postsService.getAllArchivedPosts().subscribe({
      next: (archivedPosts) => {
        if (archivedPosts.length === 0) {
          this.restoringAll = false;
          this.notificationService.info('No hay posts archivados para restaurar');
          return;
        }

        // Restaurar todos los posts uno por uno
        let restored = 0;
        let failed = 0;
        const total = archivedPosts.length;

        archivedPosts.forEach((post, index) => {
          this.postsService.restorePost(post.id).subscribe({
            next: () => {
              restored++;
              if (restored + failed === total) {
                this.restoringAll = false;
                if (restored > 0) {
                  this.notificationService.success(`Se restauraron ${restored} de ${total} posts archivados`);
                  this.loadArchivedCount();
                  // Si estamos viendo posts archivados, recargar la lista
                  if (this.showArchivedPosts) {
                    // Disparar evento para recargar posts-list
                    this.showArchivedPosts = false;
                    setTimeout(() => {
                      this.showArchivedPosts = true;
                    }, 100);
                  }
                }
                if (failed > 0) {
                  this.notificationService.warning(`${failed} posts no pudieron ser restaurados`);
                }
              }
            },
            error: () => {
              failed++;
              if (restored + failed === total) {
                this.restoringAll = false;
                if (restored > 0) {
                  this.notificationService.success(`Se restauraron ${restored} de ${total} posts archivados`);
                  this.loadArchivedCount();
                  if (this.showArchivedPosts) {
                    this.showArchivedPosts = false;
                    setTimeout(() => {
                      this.showArchivedPosts = true;
                    }, 100);
                  }
                }
                if (failed > 0) {
                  this.notificationService.warning(`${failed} posts no pudieron ser restaurados`);
                }
              }
            }
          });
        });
      },
      error: (err) => {
        this.restoringAll = false;
        const errorMsg = err.error?.detail || err.error?.message || 'Error al cargar posts archivados';
        this.notificationService.error(errorMsg);
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
