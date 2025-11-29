import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportsService } from '../../../services/reports';
import { AuthService } from '../../../services/auth';
import { NotificationService } from '../../../core/services/notification';
import { Report, ReportStatus, ReportType } from '../../../shared/interfaces/report.interface';
import { User } from '../../../shared/interfaces/user.interface';
import { ConfirmDismissReportComponent } from '../../../modals/confirm-dismiss-report/confirm-dismiss-report';

@Component({
  selector: 'app-reports-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmDismissReportComponent],
  templateUrl: './reports-panel.html',
  styleUrl: './reports-panel.scss'
})
export class ReportsPanelComponent implements OnInit {
  reports: Report[] = [];
  loading = false;
  error: string | null = null;
  user: User | null = null;
  selectedStatus: ReportStatus | '' = '';
  selectedReport: Report | null = null;
  actionTaken = '';
  showActionModal = false;
  showDismissModal = false;
  reportToDismiss: Report | null = null;
  ReportStatus = ReportStatus; // Exponer enum para usar en template

  constructor(
    private reportsService: ReportsService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUserValue();
    this.loadReports();
  }

  loadReports(): void {
    this.loading = true;
    const status = this.selectedStatus || undefined;
    this.reportsService.getReports(status).subscribe({
      next: (reports) => {
        this.loading = false;
        this.reports = reports;
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error al cargar reportes';
      }
    });
  }

  onStatusChange(): void {
    this.loadReports();
  }

  reviewReport(report: Report): void {
    this.loading = true;
    this.reportsService.reviewReport(report.id).subscribe({
      next: () => {
        this.loading = false;
        this.notificationService.success('Reporte marcado como revisado');
        this.loadReports();
      },
      error: (err) => {
        this.loading = false;
        const errorMsg = err.error?.detail || err.error?.message || 'Error al revisar el reporte';
        this.error = errorMsg;
        this.notificationService.error(errorMsg);
      }
    });
  }

  openResolveModal(report: Report): void {
    this.selectedReport = report;
    this.actionTaken = '';
    this.showActionModal = true;
  }

  resolveReport(): void {
    if (!this.selectedReport) return;

    // Validar que se haya ingresado una acción
    if (!this.actionTaken || this.actionTaken.trim().length === 0) {
      this.notificationService.warning('Por favor, describe la acción tomada');
      return;
    }

    this.loading = true;
    this.reportsService.resolveReport(this.selectedReport.id, {
      action_taken: this.actionTaken.trim()
    }).subscribe({
      next: () => {
        this.loading = false;
        this.notificationService.success('Reporte resuelto correctamente');
        this.closeModal();
        this.loadReports();
      },
      error: (err) => {
        this.loading = false;
        const errorMsg = err.error?.detail || err.error?.message || 'Error al resolver el reporte';
        this.error = errorMsg;
        this.notificationService.error(errorMsg);
      }
    });
  }

  openDismissModal(report: Report): void {
    this.reportToDismiss = report;
    this.showDismissModal = true;
  }

  closeDismissModal(): void {
    this.showDismissModal = false;
    this.reportToDismiss = null;
  }

  confirmDismissReport(): void {
    if (!this.reportToDismiss) return;

    this.loading = true;
    this.reportsService.dismissReport(this.reportToDismiss.id).subscribe({
      next: () => {
        this.loading = false;
        this.notificationService.success('Reporte descartado correctamente');
        this.showDismissModal = false;
        this.reportToDismiss = null;
        this.loadReports();
      },
      error: (err) => {
        this.loading = false;
        const errorMsg = err.error?.detail || err.error?.message || 'Error al descartar el reporte';
        this.error = errorMsg;
        this.notificationService.error(errorMsg);
        this.showDismissModal = false;
      }
    });
  }

  dismissReport(report: Report): void {
    this.openDismissModal(report);
  }

  closeModal(): void {
    this.showActionModal = false;
    this.selectedReport = null;
    this.actionTaken = '';
  }

  getStatusBadgeClass(status: ReportStatus): string {
    switch (status) {
      case ReportStatus.PENDING:
        return 'badge-warning';
      case ReportStatus.REVIEWED:
        return 'badge-info';
      case ReportStatus.RESOLVED:
        return 'badge-success';
      case ReportStatus.DISMISSED:
        return 'badge-secondary';
      default:
        return 'badge-secondary';
    }
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

