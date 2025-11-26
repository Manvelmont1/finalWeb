import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

interface Alert {
  message: string;
  type: 'success' | 'error' | '';
}

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;

  // FIX: esta propiedad faltaba
  alert: Alert = { message: '', type: '' };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.alert = {
        message: 'Revisa los datos del formulario.',
        type: 'error'
      };
      return;
    }

    console.log('Registro:', this.registerForm.value);

    this.alert = {
      message: 'Registro exitoso.',
      type: 'success'
    };
  }
}
