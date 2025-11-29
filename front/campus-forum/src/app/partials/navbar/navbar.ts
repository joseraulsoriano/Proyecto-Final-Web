import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { User, UserRole } from '../../shared/interfaces/user.interface';
import { getApiBaseUrl } from '../../core/config/app.config';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent implements OnInit {
  user: User | null = null;
  isAuthenticated = false;
  isMenuOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.user = this.authService.getCurrentUserValue();

    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      this.isAuthenticated = !!user;
    });
  }

  logout(): void {
    this.authService.logout();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  getRoleLabel(): string {
    if (!this.user) return '';
    switch (this.user.role) {
      case UserRole.ADMIN:
        return 'Administrador';
      case UserRole.PROFESSOR:
        return 'Profesor';
      case UserRole.STUDENT:
        return 'Estudiante';
      default:
        return '';
    }
  }

  canAccessReports(): boolean {
    return this.user?.role === UserRole.ADMIN || this.user?.role === UserRole.PROFESSOR;
  }

  getProfilePictureUrl(url: string | null | undefined): string | null {
    if (!url) return null;
    // Si la URL ya es absoluta (http/https), usarla directamente
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // Si es una ruta relativa, construir la URL completa con el backend
    const apiUrl = getApiBaseUrl().replace('/api', '');
    return `${apiUrl}${url.startsWith('/') ? url : '/' + url}`;
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }
}
