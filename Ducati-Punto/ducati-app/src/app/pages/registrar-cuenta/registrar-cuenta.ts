import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registrar-cuenta',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './registrar-cuenta.html',
  styleUrl: './registrar-cuenta.scss',
})
export class RegistrarCuenta {
  nombre: string = '';
  apellidos: string = '';
  email: string = '';
  password: string = '';
  telefono: string = '';
  ciudad: string = '';
  edad: string = '';
  showPassword: boolean = false;
  aceptaTerminos: boolean = false;

  edades: string[] = ['18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65+'];

  constructor(private router: Router) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onRegister(): void {
    // Navegar a inicio cuando se hace clic en registrar
    this.router.navigate(['/inicio']);
  }
}
