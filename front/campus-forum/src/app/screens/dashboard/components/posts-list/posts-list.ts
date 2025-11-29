import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PostsService } from '../../../../services/posts';
import { Post, PostStatus } from '../../../../shared/interfaces/post.interface';
import { User, UserRole } from '../../../../shared/interfaces/user.interface';
import { NotificationService } from '../../../../core/services/notification';
import { ConfirmDeletePostComponent } from '../../../../modals/confirm-delete-post/confirm-delete-post';

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [CommonModule, ConfirmDeletePostComponent],
  templateUrl: './posts-list.html',
  styleUrl: './posts-list.scss'
})
export class PostsListComponent implements OnInit {
  @Input() user!: User;
  @Input() canEdit: boolean = false;
  @Input() showMyPosts: boolean = false; // Si mostrar solo mis posts
  @Input() showArchived: boolean = false; // Si mostrar posts archivados (solo para admins)
  @Output() archivedCountChanged = new EventEmitter<void>(); // Evento para notificar cambios
  
  posts: Post[] = [];
  loading = false;
  error: string | null = null;
  showDeleteModal = false;
  selectedPostId: number | null = null;
  selectedPostTitle: string = '';

  constructor(
    private postsService: PostsService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading = true;
    
    if (this.showMyPosts) {
      this.postsService.getMyPosts().subscribe({
        next: (response) => {
          this.loading = false;
          this.posts = response?.results || [];
        },
        error: (err) => {
          this.loading = false;
          this.posts = [];
          this.error = 'Error al cargar tus posts';
        }
      });
    } else if (this.showArchived) {
      // Mostrar posts archivados (solo para admins)
      this.postsService.getPosts({ status: PostStatus.ARCHIVED }).subscribe({
        next: (response) => {
          this.loading = false;
          this.posts = response?.results || [];
        },
        error: (err) => {
          this.loading = false;
          this.posts = [];
          this.error = 'Error al cargar posts archivados';
        }
      });
    } else {
      this.postsService.getPosts({ status: PostStatus.PUBLISHED }).subscribe({
        next: (response) => {
          this.loading = false;
          this.posts = response?.results || [];
        },
        error: (err) => {
          this.loading = false;
          this.posts = [];
          this.error = 'Error al cargar posts';
        }
      });
    }
  }

  goToPostDetail(id: number): void {
    this.router.navigate(['/posts', id]);
  }
  
  goToCreatePost(): void {
    this.router.navigate(['/posts/create']);
  }

  openDeleteModal(post: Post): void {
    this.selectedPostId = post.id;
    this.selectedPostTitle = post.title;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedPostId = null;
    this.selectedPostTitle = '';
  }

  confirmDelete(): void {
    if (!this.selectedPostId) return;

    this.loading = true;
    this.postsService.deletePost(this.selectedPostId).subscribe({
      next: () => {
        this.loading = false;
        this.notificationService.success('Post eliminado correctamente');
        this.showDeleteModal = false;
        this.selectedPostId = null;
        this.selectedPostTitle = '';
        this.loadPosts();
      },
      error: (err) => {
        this.loading = false;
        const errorMsg = err.error?.detail || err.error?.message || 'Error al eliminar post';
        this.error = errorMsg;
        this.notificationService.error(errorMsg);
        this.showDeleteModal = false;
      }
    });
  }

  deletePost(id: number): void {
    const post = this.posts.find(p => p.id === id);
    if (post) {
      this.openDeleteModal(post);
    }
  }

  publishPost(id: number): void {
    this.loading = true;
    this.postsService.publishPost(id).subscribe({
      next: () => {
        this.loading = false;
        this.notificationService.success('Post publicado correctamente');
        this.loadPosts();
      },
      error: (err) => {
        this.loading = false;
        const errorMsg = err.error?.detail || err.error?.message || 'Error al publicar post';
        this.error = errorMsg;
        this.notificationService.error(errorMsg);
      }
    });
  }

  archivePost(id: number): void {
    const post = this.posts.find(p => p.id === id);
    const postTitle = post?.title || 'este post';
    
    this.loading = true;
    this.postsService.archivePost(id).subscribe({
      next: (archivedPost) => {
        this.loading = false;
        this.notificationService.success(`Post "${archivedPost.title}" archivado correctamente`);
        this.loadPosts();
        this.archivedCountChanged.emit(); // Notificar cambio en el contador
      },
      error: (err) => {
        this.loading = false;
        const errorMsg = err.error?.detail || err.error?.message || 'Error al archivar post';
        this.error = errorMsg;
        this.notificationService.error(errorMsg);
      }
    });
  }

  restorePost(id: number): void {
    const post = this.posts.find(p => p.id === id);
    const postTitle = post?.title || 'este post';
    
    this.loading = true;
    this.postsService.restorePost(id).subscribe({
      next: (restoredPost) => {
        this.loading = false;
        this.notificationService.success(`Post "${restoredPost.title}" restaurado correctamente`);
        this.loadPosts();
        this.archivedCountChanged.emit(); // Notificar cambio en el contador
      },
      error: (err) => {
        this.loading = false;
        const errorMsg = err.error?.detail || err.error?.message || 'Error al restaurar post';
        this.error = errorMsg;
        this.notificationService.error(errorMsg);
      }
    });
  }

  canModifyPost(post: Post): boolean {
    if (!this.canEdit) return false;
    if (post.author.id === this.user.id) return true;
    return this.user.role === UserRole.ADMIN || this.user.role === UserRole.PROFESSOR;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PUBLISHED':
        return 'badge-success';
      case 'DRAFT':
        return 'badge-warning';
      case 'ARCHIVED':
        return 'badge-secondary';
      default:
        return 'badge-secondary';
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
}

