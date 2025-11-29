import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-delete-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-delete-category.html',
  styleUrl: './confirm-delete-category.scss'
})
export class ConfirmDeleteCategoryComponent {
  @Input() categoryName: string = '';
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
