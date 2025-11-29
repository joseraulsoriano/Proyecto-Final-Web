import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/landing',
    pathMatch: 'full'
  },
  {
    path: 'landing',
    loadComponent: () => import('./screens/landing/landing').then(m => m.Landing)
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./screens/auth/login/login').then(m => m.Login)
      },
      {
        path: 'register',
        loadComponent: () => import('./screens/auth/register/register').then(m => m.Register)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./screens/dashboard/dashboard').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./screens/profile/profile').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'posts/create',
    loadComponent: () => import('./screens/posts/form/form').then(m => m.PostFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'posts/:id/edit',
    loadComponent: () => import('./screens/posts/form/form').then(m => m.PostFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'posts/:id',
    loadComponent: () => import('./screens/posts/post-detail/post-detail').then(m => m.PostDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'reports',
    loadComponent: () => import('./screens/reports/reports-panel/reports-panel').then(m => m.ReportsPanelComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/landing'
  }
];
