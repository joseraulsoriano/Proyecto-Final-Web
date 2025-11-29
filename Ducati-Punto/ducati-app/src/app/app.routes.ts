import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login)
  },
  {
    path: 'registrar-cuenta',
    loadComponent: () => import('./pages/registrar-cuenta/registrar-cuenta').then(m => m.RegistrarCuenta)
  },
  {
    path: 'inicio',
    loadComponent: () => import('./pages/inicio/inicio').then(m => m.Inicio)
  },
  {
    path: 'politica-privacidad',
    loadComponent: () => import('./pages/politica-privacidad/politica-privacidad').then(m => m.PoliticaPrivacidad)
  },
  {
    path: 'terminos-condiciones',
    loadComponent: () => import('./pages/terminos-condiciones/terminos-condiciones').then(m => m.TerminosCondiciones)
  },
  {
    path: 'bases-promocion',
    loadComponent: () => import('./pages/bases-promocion/bases-promocion').then(m => m.BasesPromocion)
  },
  {
    path: 'instrucciones',
    loadComponent: () => import('./pages/instrucciones/instrucciones').then(m => m.Instrucciones)
  },
  {
    path: 'juego',
    loadComponent: () => import('./pages/juego/juego').then(m => m.Juego)
  },
  {
    path: 'tiendas-participantes',
    loadComponent: () => import('./pages/tiendas-participantes/tiendas-participantes').then(m => m.TiendasParticipantes)
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
