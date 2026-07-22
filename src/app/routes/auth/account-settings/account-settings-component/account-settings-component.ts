import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from "@angular/router";
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

import { inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Inplace } from "primeng/inplace";
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../../services/auth-service';
import { FormService } from '../../../../services/form-service';

@Component({
  selector: 'app-account-settings-component',
  imports: [FloatLabelModule, InputTextModule, FormsModule, MessageModule, ToastModule, ButtonModule, ReactiveFormsModule, Inplace, PasswordModule],
  templateUrl: './account-settings-component.html',
  styleUrl: './account-settings-component.css',
})
export class AccountSettingsComponent {
  authService = inject(AuthService);
  formService = inject(FormService);
  router = inject(Router);
  
  shownPasswordValue = '        ';
  updatePasswordModel = {
    oldPassword: '',
    newPassword: ''
  }

  onSubmit(name: string, value: any, closeCallback: () => void) {
    switch (name) {
      case 'password':
        this.formService.asyncOperation(
          this.authService.changePassword(value),
          () => closeCallback()
        );
        break;
    
      default:
        break;
    }
  }
}
