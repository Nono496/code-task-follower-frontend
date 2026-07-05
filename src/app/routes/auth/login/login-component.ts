import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

import { inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FloatLabelModule, InputTextModule, FormsModule, MessageModule, ToastModule, ButtonModule, ReactiveFormsModule],
  providers: [MessageService],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class Login {
  authService = inject(AuthService);
  router = inject(Router);

  messageService = inject(MessageService);
  fb = inject(FormBuilder);

  form: FormGroup;
  formSubmitted: boolean = false;

  constructor() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
      this.formSubmitted = true;
      if (this.form.valid) {
        this.authService.logIn(this.form.getRawValue()).subscribe((ok) => {
          if (ok) {
            this.router.navigate(['/', 'dashboard']);
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', life: 3000 });
            this.formSubmitted = false;
          }
        });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', life: 3000 });
        this.formSubmitted = false;
      }
  }

  getControl(controlName: string) {
    return this.form.get(controlName) as FormControl;
  }
  isInvalid(controlName: string) {
      const control = this.getControl(controlName);

      return control?.invalid && (control.dirty || this.formSubmitted);
  }
}
