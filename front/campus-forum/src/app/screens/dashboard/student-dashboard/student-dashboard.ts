import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { User, UserRole } from '../../../shared/interfaces/user.interface';
import { CategoriesListComponent } from '../components/categories-list/categories-list';
import { PostsListComponent } from '../components/posts-list/posts-list';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, CategoriesListComponent, PostsListComponent],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.scss',
})
export class StudentDashboard implements OnInit {
  user: User | null = null;
  canEdit = false; // Estudiantes NO pueden editar

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
        },
        error: () => this.router.navigate(['/auth/login'])
      });
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
