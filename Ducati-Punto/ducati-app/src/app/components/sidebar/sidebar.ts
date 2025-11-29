import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  @Input() isOpen: boolean = false;
  @Input() isLoggedIn: boolean = true;
  @Output() closeSidebar = new EventEmitter<void>();

  constructor(private router: Router) {}

  close(): void {
    this.closeSidebar.emit();
  }

  navigate(route: string): void {
    this.router.navigate([route]);
    this.close();
  }

  logout(): void {
    this.router.navigate(['/login']);
    this.close();
  }
}
