import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, CommonModule, Sidebar, FormsModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss',
})
export class Inicio {
  sidebarOpen: boolean = false;
  nombreUsuario: string = 'FERNANDO CASTILLO';
  codigo: string[] = ['4', '5', '7', '2', '0', '5', '5', '5'];
  tiendaSeleccionada: string = 'Liverpool';
  puntaje: number = 3600;
  posicion: number = 14;

  tiendas = ['Liverpool', 'Palacio de Hierro', 'El Palacio de Hierro', 'Sears', 'Coppel'];

  codigosRegistrados = [
    { fecha: '18/10/2022', codigo: '264956', puntosTotales: 1100, puntosPorCodigo: 1000 },
    { fecha: '19/10/2022', codigo: '106347', puntosTotales: 1300, puntosPorCodigo: 1000 },
    { fecha: '24/10/2022', codigo: '967532', puntosTotales: 1200, puntosPorCodigo: 1000 }
  ];

  constructor(private router: Router) {}

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  onCodeChange(index: number, value: string): void {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    this.codigo[index] = value;
    if (value && index < 7) {
      const nextInput = document.querySelector(`input[name="codigo-${index + 1}"]`) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.codigo[index] && index > 0) {
      const prevInput = document.querySelector(`input[name="codigo-${index - 1}"]`) as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
      }
    }
  }

  onRegisterCode(): void {
    const codigoCompleto = this.codigo.join('');
    if (codigoCompleto.length === 8 && this.tiendaSeleccionada) {
      console.log('Código registrado:', codigoCompleto, 'Tienda:', this.tiendaSeleccionada);
    }
  }

  saberMas(): void {
    this.router.navigate(['/bases-promocion']);
  }
}
