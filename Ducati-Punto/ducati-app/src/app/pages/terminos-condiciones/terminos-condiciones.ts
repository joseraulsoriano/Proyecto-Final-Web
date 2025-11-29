import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-terminos-condiciones',
  imports: [RouterLink, CommonModule, Sidebar],
  templateUrl: './terminos-condiciones.html',
  styleUrl: './terminos-condiciones.scss',
})
export class TerminosCondiciones implements OnInit {
  sidebarOpen: boolean = false;
  isLoggedIn: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Detectar si viene desde login o registrar-cuenta (sin registro)
    const referrer = document.referrer;
    const currentUrl = window.location.href;
    
    // Si viene desde login o registrar-cuenta, o si no hay referrer, asumir sin registro
    if (referrer.includes('/login') || referrer.includes('/registrar-cuenta') || !referrer) {
      this.isLoggedIn = false;
    } else {
      // Si viene desde otras páginas, asumir que está logueado
      this.isLoggedIn = true;
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }
}
