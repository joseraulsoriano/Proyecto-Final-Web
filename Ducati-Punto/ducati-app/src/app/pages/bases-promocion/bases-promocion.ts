import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-bases-promocion',
  imports: [RouterLink, CommonModule, Sidebar],
  templateUrl: './bases-promocion.html',
  styleUrl: './bases-promocion.scss',
})
export class BasesPromocion {
  sidebarOpen: boolean = false;

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }
}
