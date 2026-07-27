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
  selector: 'app-register-form-component',
  imports: [FloatLabelModule, InputTextModule, FormsModule, MessageModule, ToastModule, ButtonModule, ReactiveFormsModule],
  templateUrl: './register-form-component.html',
  styleUrl: './register-form-component.css',
})
export class RegisterFormComponent {
  authService = inject(AuthService);
  formService = inject(FormService);

  fb = inject(FormBuilder);

  form: FormGroup;
  formSubmitted: boolean = false;

  saveTokenOnRegister = input<boolean>(true);
  onRegister = output<void>();

  constructor() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
      this.formSubmitted = true;
      if (this.form.valid) {
        this.formService.startSaveMessage('Signing up...');
        this.authService.register(this.form.getRawValue(), this.saveTokenOnRegister()).subscribe({
          next: () => {
            this.onRegister.emit();
            this.formService.endSaveMessage('Signed up');
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
