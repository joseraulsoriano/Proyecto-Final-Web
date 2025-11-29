import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentsService } from '../../../../services/comments';
import { Comment, CreateCommentRequest } from '../../../../shared/interfaces/comment.interface';
import { User, UserRole } from '../../../../shared/interfaces/user.interface';
import { ConfirmDeleteCommentComponent } from '../../../../modals/confirm-delete-comment/confirm-delete-comment';
import { ReportCommentComponent } from '../../../../modals/report-comment/report-comment';
import { NotificationService } from '../../../../core/services/notification';

@Component({
  selector: 'app-comments-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ConfirmDeleteCommentComponent, ReportCommentComponent],
  templateUrl: './comments-list.html',
  styleUrl: './comments-list.scss'
})
export class CommentsListComponent implements OnInit {
  @Input() postId!: number;
  @Input() user!: User;
  @Input() canEdit: boolean = false;

  comments: Comment[] = [];
  loading = false;
  submitting = false;
  error: string | null = null;
  showDeleteModal = false;
  showReportModal = false;
  selectedCommentId: number | null = null;
  
  commentForm: FormGroup;

  constructor(
    private commentsService: CommentsService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.loading = true;
    this.commentsService.getCommentsByPost(this.postId).subscribe({
      next: (comments) => {
        this.loading = false;
        this.comments = comments;
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error al cargar comentarios';
      }
    });
  }

  onSubmit(): void {
    if (this.commentForm.invalid) {
      return;
    }

    this.submitting = true;
    const data: CreateCommentRequest = {
      content: this.commentForm.value.content,
      post_id: this.postId
    };

    this.commentsService.createComment(data).subscribe({
      next: () => {
        this.submitting = false;
        this.notificationService.success('Comentario creado correctamente');
        this.commentForm.reset();
        this.loadComments();
      },
      error: (err) => {
        this.submitting = false;
        // Manejar diferentes tipos de errores
        let errorMsg = 'Error al crear comentario. Por favor, intenta nuevamente.';
        if (err.error) {
          if (err.error.content && Array.isArray(err.error.content)) {
            errorMsg = err.error.content[0];
          } else if (err.error.post_id && Array.isArray(err.error.post_id)) {
            errorMsg = err.error.post_id[0];
          } else if (err.error.detail) {
            errorMsg = err.error.detail;
          } else if (err.error.message) {
            errorMsg = err.error.message;
          } else if (typeof err.error === 'string') {
            errorMsg = err.error;
          }
        }
        this.error = errorMsg;
        this.notificationService.error(errorMsg);
      }
    });
  }

  openDeleteModal(commentId: number): void {
    this.selectedCommentId = commentId;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedCommentId = null;
  }

  confirmDelete(): void {
    if (!this.selectedCommentId) return;

    this.commentsService.deleteComment(this.selectedCommentId).subscribe({
      next: () => {
        this.notificationService.success('Comentario eliminado correctamente');
        this.showDeleteModal = false;
        this.selectedCommentId = null;
        this.loadComments();
      },
      error: (err) => {
        const errorMsg = err.error?.detail || err.error?.message || 'Error al eliminar comentario';
        this.error = errorMsg;
        this.notificationService.error(errorMsg);
        this.showDeleteModal = false;
      }
    });
  }

  openReportModal(commentId: number): void {
    this.selectedCommentId = commentId;
    this.showReportModal = true;
  }

  closeReportModal(): void {
    this.showReportModal = false;
    this.selectedCommentId = null;
  }

  onReported(): void {
    this.showReportModal = false;
    this.selectedCommentId = null;
  }

  canDeleteComment(comment: Comment): boolean {
    if (!this.canEdit) return false;
    if (comment.author.id === this.user.id) return true;
    return this.user.role === UserRole.ADMIN || this.user.role === UserRole.PROFESSOR;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}


