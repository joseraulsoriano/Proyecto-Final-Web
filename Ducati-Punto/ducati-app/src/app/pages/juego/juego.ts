import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-juego',
  imports: [RouterLink, CommonModule, Sidebar],
  templateUrl: './juego.html',
  styleUrl: './juego.scss',
})
export class Juego {
  sidebarOpen: boolean = false;
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

  onGameScreenClick(): void {
    // Simular que el juego terminó al tocar la pantalla
    this.juegoTerminado = true;
  }

  volverAlMenu(): void {
    this.router.navigate(['/inicio']);
  }

  jugarDeNuevo(): void {
    this.juegoTerminado = false;
    this.velocidad = 26;
    this.puntaje = 31;
    this.peligro = 0;
  }
}
