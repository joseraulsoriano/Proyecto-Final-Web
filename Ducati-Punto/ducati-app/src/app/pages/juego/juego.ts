import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-juego',
  imports: [CommonModule, Sidebar, Footer],
  templateUrl: './juego.html',
  styleUrl: './juego.scss',
})
export class Juego {
  sidebarOpen: boolean = false;
  juegoActivo: boolean = false;
  juegoTerminado: boolean = false;
  velocidad: number = 26;
  puntaje: number = 1400;
  peligro: number = 0;

  constructor(private router: Router) {}

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  omitir(): void {
    // Navegar a otra página o continuar sin usar lentes
    this.router.navigate(['/inicio']);
  }

  usarLentes(): void {
    // Activar la pantalla del juego
    this.juegoActivo = true;
    this.juegoTerminado = false;
  }

  onGameScreenClick(): void {
    // Simular que el juego terminó al tocar la pantalla
    this.juegoActivo = false;
    this.juegoTerminado = true;
  }

  volverAlInicio(): void {
    this.router.navigate(['/inicio']);
  }
}
