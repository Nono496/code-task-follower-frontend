import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

import { inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../services/auth-service';
import { FormService } from '../../../services/form-service';

@Component({
  selector: 'app-signin',
  imports: [RouterLink, FloatLabelModule, InputTextModule, FormsModule, MessageModule, ToastModule, ButtonModule, ReactiveFormsModule],
  templateUrl: './signin-component.html',
  styleUrl: './signin-component.css',
})
export class Signin {
  authService = inject(AuthService);
  formService = inject(FormService);
  router = inject(Router);

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
        this.formService.startSaveMessage('Signing in...');
        this.authService.signIn(this.form.getRawValue()).subscribe({
          next: () => {
            this.router.navigate(['/', 'dashboard']);
            this.formService.endSaveMessage('Signed in');
          },
          error: () => {
            this.formService.saveErrorMessage();
            this.formSubmitted = false;
          }
        });
      } else {
        this.formService.saveErrorMessage();
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
