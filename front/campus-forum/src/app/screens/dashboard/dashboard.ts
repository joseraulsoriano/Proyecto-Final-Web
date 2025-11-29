import { Component, OnInit, AfterViewInit, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { User, UserRole } from '../../shared/interfaces/user.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (!user) {
      <div class="loading-container">
        <div class="loading">Cargando...</div>
      </div>
    }
    <ng-container #dashboardContainer></ng-container>
  `,
  styles: [`
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      font-size: 1.2rem;
      color: #64748b;
    }
  `]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('dashboardContainer', { read: ViewContainerRef }) dashboardContainer!: ViewContainerRef;
  user: User | null = null;
  userRole = UserRole;
  private componentLoaded = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUserValue();
    if (!this.user) {
      this.authService.getCurrentUser().subscribe({
        next: (user) => {
          this.user = user;
          if (this.componentLoaded) {
            this.loadDashboard();
          }
        },
        error: () => this.router.navigate(['/auth/login'])
      });
    }
  }

  ngAfterViewInit(): void {
    this.componentLoaded = true;
    if (this.user) {
      this.loadDashboard();
    }
  }

  async loadDashboard(): Promise<void> {
    if (!this.user || !this.dashboardContainer) return;

    this.dashboardContainer.clear();
    let component: any;

    switch (this.user.role) {
      case UserRole.ADMIN:
        component = (await import('./admin-dashboard/admin-dashboard')).AdminDashboard;
        break;
      case UserRole.PROFESSOR:
        component = (await import('./professor-dashboard/professor-dashboard')).ProfessorDashboard;
        break;
      case UserRole.STUDENT:
        component = (await import('./student-dashboard/student-dashboard')).StudentDashboard;
        break;
    }

    if (component && this.dashboardContainer) {
      this.dashboardContainer.createComponent(component);
    }
  }
}

