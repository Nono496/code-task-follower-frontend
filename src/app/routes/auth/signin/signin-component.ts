import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

import { inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-signin',
  imports: [RouterLink, FloatLabelModule, InputTextModule, FormsModule, MessageModule, ToastModule, ButtonModule, ReactiveFormsModule],
  providers: [AuthService, MessageService],
  templateUrl: './signin-component.html',
  styleUrl: './signin-component.css',
})
export class Signin {
  authService = inject(AuthService);

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
    // TODO Call AuthService
      this.formSubmitted = true;
      if (this.form.valid) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form Submitted', life: 3000 });
          this.form.reset();
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
