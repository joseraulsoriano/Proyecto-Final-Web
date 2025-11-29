import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-tiendas-participantes',
  imports: [RouterLink, CommonModule, Sidebar],
  templateUrl: './tiendas-participantes.html',
  styleUrl: './tiendas-participantes.scss',
})
export class TiendasParticipantes {
  sidebarOpen: boolean = false;

  tiendas = [
    {
      id: 1,
      nombre: 'Tienda DUCATI Centro',
      direccion: 'Av. Principal 123',
      telefono: '01-234-5678',
      horario: 'Lun - Vie: 9:00 - 18:00'
    },
    {
      id: 2,
      nombre: 'Tienda CARRERA Norte',
      direccion: 'Calle Norte 456',
      telefono: '01-234-5679',
      horario: 'Lun - Sáb: 10:00 - 20:00'
    },
    {
      id: 3,
      nombre: 'Tienda DUCATI Sur',
      direccion: 'Av. Sur 789',
      telefono: '01-234-5680',
      horario: 'Mar - Dom: 9:00 - 19:00'
    },
    {
      id: 4,
      nombre: 'Tienda CARRERA Este',
      direccion: 'Calle Este 321',
      telefono: '01-234-5681',
      horario: 'Lun - Vie: 8:00 - 17:00'
    }
  ];

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }
}
