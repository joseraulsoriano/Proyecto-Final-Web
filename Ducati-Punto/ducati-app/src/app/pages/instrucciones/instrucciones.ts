import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-instrucciones',
  imports: [RouterLink, CommonModule, Sidebar],
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
