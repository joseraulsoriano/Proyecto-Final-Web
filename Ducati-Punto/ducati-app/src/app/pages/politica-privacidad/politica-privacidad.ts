import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-politica-privacidad',
  imports: [CommonModule, Sidebar, Footer],
  templateUrl: './politica-privacidad.html',
  styleUrl: './politica-privacidad.scss',
})
export class PoliticaPrivacidad implements OnInit {
  sidebarOpen: boolean = false;
  isLoggedIn: boolean = false;

  ngOnInit(): void {
    const storedStatus = sessionStorage.getItem('isLoggedIn');
    this.isLoggedIn = storedStatus === 'true';
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }
}
