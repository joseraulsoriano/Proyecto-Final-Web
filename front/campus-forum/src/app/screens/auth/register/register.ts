import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { SeoService } from '../../../core/services/seo.service';
import { ThemeService } from '../../../core/services/theme.service';
import { RegisterRequest, UserRole } from '../../../shared/interfaces/user.interface';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit {
  registerForm: FormGroup;
  loading = false;
  error: string | null = null;
  showPassword = false;
  showPassword2 = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private seoService: SeoService,
    public themeService: ThemeService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required]],
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      role: [UserRole.STUDENT, [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    this.seoService.setPageMetadata({
      title: 'Registro',
      description: 'Crea tu cuenta en CampusForum y únete a la comunidad universitaria. Participa en debates académicos y comparte conocimientos.',
      keywords: 'registro, crear cuenta, campus forum, estudiante, profesor, comunidad universitaria',
      url: window.location.href
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const password2 = control.get('password2');
    
    if (password && password2 && password.value !== password2.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    this.loading = true;
    this.error = null;

    const registerData: RegisterRequest = {
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      password2: this.registerForm.value.password2,
      first_name: this.registerForm.value.first_name,
      last_name: this.registerForm.value.last_name,
      role: this.registerForm.value.role
    };

    this.authService.register(registerData).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        if (err.error) {
          const errors = err.error;
          if (errors.email) {
            this.error = `Correo: ${Array.isArray(errors.email) ? errors.email[0] : errors.email}`;
          } else if (errors.password) {
            this.error = `Contraseña: ${Array.isArray(errors.password) ? errors.password[0] : errors.password}`;
          } else if (errors.role) {
            this.error = `Rol: ${Array.isArray(errors.role) ? errors.role[0] : errors.role}`;
          } else if (errors.non_field_errors) {
            this.error = Array.isArray(errors.non_field_errors) ? errors.non_field_errors[0] : errors.non_field_errors;
          } else {
            this.error = 'Error al registrarse. Verifica los datos.';
          }
        } else {
          this.error = 'Error al registrarse. Intenta nuevamente.';
        }
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
    return this.registerForm.controls;
  }

  get passwordMismatch() {
    return this.registerForm.errors?.['passwordMismatch'] && 
           this.f['password2'].touched;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  togglePassword2Visibility(): void {
    this.showPassword2 = !this.showPassword2;
  }
}
