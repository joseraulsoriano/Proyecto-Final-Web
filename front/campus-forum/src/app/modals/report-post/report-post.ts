import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ReportsService } from '../../services/reports';
import { CreateReportRequest, ReportType } from '../../shared/interfaces/report.interface';

@Component({
  selector: 'app-report-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './report-post.html',
  styleUrl: './report-post.scss'
})
export class ReportPostComponent {
  @Input() postId: number | null = null;
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() reported = new EventEmitter<void>();

  reportForm!: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private reportsService: ReportsService
  ) {
    this.reportForm = this.fb.group({
      reason: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onClose(): void {
    this.reportForm.reset();
    this.error = null;
    this.close.emit();
  }

  onBackdropClick(): void {
    this.onClose();
  }

  onSubmit(): void {
    if (this.reportForm.invalid || !this.postId) {
      this.reportForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    const data: CreateReportRequest = {
      type: ReportType.POST,
      post_id: this.postId,
      reason: this.reportForm.value.reason
    };

    this.reportsService.createReport(data).subscribe({
      next: () => {
        this.loading = false;
        this.reported.emit();
        this.onClose();
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.detail || err.error?.reason || 'Error al reportar el post';
      }
    });
  }

  get f() {
    return this.reportForm.controls;
  }
}
