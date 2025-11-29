import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { SeoService } from '../../../core/services/seo.service';
import { ThemeService } from '../../../core/services/theme.service';
import { LoginRequest } from '../../../shared/interfaces/user.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  loginForm: FormGroup;
  loading = false;
  error: string | null = null;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private seoService: SeoService,
    public themeService: ThemeService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.seoService.setPageMetadata({
      title: 'Iniciar Sesión',
      description: 'Accede a tu cuenta de CampusForum para participar en debates académicos y conectar con la comunidad universitaria.',
      keywords: 'login, iniciar sesión, acceso, campus forum, estudiante, profesor',
      url: window.location.href
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.loading = true;
    this.error = null;

    const credentials: LoginRequest = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        // Extraer el mensaje de error del backend
        let errorMsg = 'Error al iniciar sesión';
        
        if (err.error) {
          // El backend devuelve el error en 'detail' o 'message'
          errorMsg = err.error.detail || err.error.message || err.error.error || errorMsg;
        } else if (err.message) {
          // Si el error viene del interceptor
          errorMsg = err.message;
        }
        
        // Traducir mensajes comunes del backend
        if (errorMsg.includes('No active account found') || errorMsg.includes('No se encontró una cuenta activa')) {
          errorMsg = 'Correo electrónico o contraseña incorrectos';
        } else if (errorMsg.includes('invalid') || errorMsg.includes('inválid')) {
          errorMsg = 'Credenciales inválidas';
        }
        
        this.error = errorMsg;
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
