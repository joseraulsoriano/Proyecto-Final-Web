import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../../services/auth';
import { UserRole } from '../interfaces/user.interface';

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.getCurrentUserValue();

    if (!user) {
      router.navigate(['/auth/login'], {
        queryParams: { returnUrl: state.url }
      });
      return false;
    }

    if (!allowedRoles.includes(user.role)) {
      router.navigate(['/dashboard']);
      return false;
    }

    return true;
  };
};

// Helpers específicos para cada rol
export const adminGuard: CanActivateFn = roleGuard([UserRole.ADMIN]);
export const professorGuard: CanActivateFn = roleGuard([UserRole.ADMIN, UserRole.PROFESSOR]);
export const moderatorGuard: CanActivateFn = roleGuard([UserRole.ADMIN, UserRole.PROFESSOR]);
