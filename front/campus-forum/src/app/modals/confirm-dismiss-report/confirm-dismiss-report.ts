import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dismiss-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dismiss-report.html',
  styleUrl: './confirm-dismiss-report.scss'
})
export class ConfirmDismissReportComponent {
  @Input() reportType: string = '';
  @Input() reportReason: string = '';
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
