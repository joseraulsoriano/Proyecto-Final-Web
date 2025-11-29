import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-delete-post',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-delete-post.html',
  styleUrl: './confirm-delete-post.scss'
})
export class ConfirmDeletePostComponent {
  @Input() postTitle: string = '';
  @Input() isOpen: boolean = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onBackdropClick(): void {
    this.cancel.emit();
  }
}
