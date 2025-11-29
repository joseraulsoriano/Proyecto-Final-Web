import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PostsService } from '../../../services/posts';
import { AuthService } from '../../../services/auth';
import { Post } from '../../../shared/interfaces/post.interface';
import { User, UserRole } from '../../../shared/interfaces/user.interface';
import { CommentsListComponent } from '../components/comments-list/comments-list';
import { ConfirmDeletePostComponent } from '../../../modals/confirm-delete-post/confirm-delete-post';
import { ReportPostComponent } from '../../../modals/report-post/report-post';
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, CommentsListComponent, ConfirmDeletePostComponent, ReportPostComponent],
  templateUrl: './post-detail.html',
  styleUrl: './post-detail.scss'
})
export class PostDetailComponent implements OnInit {
  post: Post | null = null;
  user: User | null = null;
  loading = false;
  error: string | null = null;
  canEdit = false;
  showDeleteModal = false;
  showReportModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postsService: PostsService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUserValue();
    if (this.user) {
      this.updatePermissions();
    }

    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.loadPost(+postId);
    }
  }

  updatePermissions(): void {
    if (this.user && this.post) {
      this.canEdit = this.post.author.id === this.user.id ||
                     this.user.role === UserRole.ADMIN ||
                     this.user.role === UserRole.PROFESSOR;
    }
  }

  loadPost(id: number): void {
    this.loading = true;
    this.postsService.getPost(id).subscribe({
      next: (post) => {
        this.loading = false;
        this.post = post;
        if (this.user) {
          this.updatePermissions();
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error al cargar el post';
      }
    });
  }

  openDeleteModal(): void {
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  confirmDelete(): void {
    if (!this.post) return;

    this.postsService.deletePost(this.post.id).subscribe({
      next: () => {
        this.showDeleteModal = false;
        this.notificationService.success('Post eliminado correctamente');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        const errorMsg = err.error?.detail || err.error?.message || 'Error al eliminar el post';
        this.error = errorMsg;
        this.notificationService.error(errorMsg);
        this.showDeleteModal = false;
      }
    });
  }

  openReportModal(): void {
    this.showReportModal = true;
  }

  closeReportModal(): void {
    this.showReportModal = false;
  }

  onReported(): void {
    this.notificationService.success('Reporte enviado correctamente');
    this.showReportModal = false;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}


