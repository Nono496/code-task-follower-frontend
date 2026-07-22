import { Component, input, output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

import { inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../../services/auth-service';
import { FormService } from '../../../../services/form-service';

@Component({
  selector: 'app-sign-in-form-component',
  imports: [FloatLabelModule, InputTextModule, FormsModule, MessageModule, ToastModule, ButtonModule, ReactiveFormsModule],
  templateUrl: './sign-in-form-component.html',
  styleUrl: './sign-in-form-component.css',
})
export class SignInFormComponent {
  authService = inject(AuthService);
  formService = inject(FormService);

  fb = inject(FormBuilder);

  form: FormGroup;
  formSubmitted: boolean = false;

  saveTokenOnSignIn = input<boolean>(true);
  onSignIn = output<void>();

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
        this.authService.signIn(this.form.getRawValue(), this.saveTokenOnSignIn()).subscribe({
          next: () => {
            this.onSignIn.emit();
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
