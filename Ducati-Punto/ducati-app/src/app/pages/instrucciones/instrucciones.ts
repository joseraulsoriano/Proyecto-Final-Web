import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-instrucciones',
  imports: [CommonModule, Sidebar, Footer],
  templateUrl: './instrucciones.html',
  styleUrl: './instrucciones.scss',
})
export class Instrucciones {
  sidebarOpen: boolean = false;

  constructor(private router: Router) {}

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  jugarAhora(): void {
    this.router.navigate(['/juego']);
  }
}
