import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';

interface Alert {
  message: string;
  type: 'success' | 'error' | '';
}

@Component({
  selector: 'app-index',
  standalone: true,
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class IndexComponent implements OnInit {

  activeTab: 'login' | 'register' = 'login';

  loginForm!: FormGroup;
  registerForm!: FormGroup;

  alert: Alert = { message: '', type: '' };

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.buildForms();
  }

  buildForms() {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      nombre: [''],   // <-- tu backend usa "nombre"
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  switchTab(tab: 'login' | 'register') {
    this.activeTab = tab;
    this.alert = { message: '', type: '' };
  }

  // Login:
  onLogin() {
    if (this.loginForm.invalid) {
      this.showAlert('Por favor completa correctamente el formulario.', 'error');
      return;
    }

    this.userService.login(this.loginForm.value).subscribe({
      next: (res) => {
        // Guarda token REAL
        localStorage.setItem('token', res.token);

        this.showAlert('Inicio de sesión exitoso', 'success');

        console.log('TOKEN:', res.token);

      },
      error: () => {
        this.showAlert('Credenciales incorrectas', 'error');
      }
    });
  }

  // Registro:
  onRegister() {
    if (this.registerForm.invalid) {
      this.showAlert('Revisa los datos del registro.', 'error');
      return;
    }

    this.userService.register(this.registerForm.value).subscribe({
      next: (res) => {
        this.showAlert('Registro exitoso. Ahora puedes iniciar sesión.', 'success');

        // Cambiar a login y copiar correo
        this.switchTab('login');
        this.loginForm.patchValue({ email: this.registerForm.value.email });
      },
      error: () => {
        this.showAlert('No se pudo registrar el usuario.', 'error');
      }
    });
  }

  // Advertencias o mensajes:
  showAlert(message: string, type: 'success' | 'error') {
    this.alert = { message, type };

    setTimeout(() => {
      this.alert = { message: '', type: '' };
    }, 4000);
  }
}
