import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RegisterFormComponent } from './register-form-component/register-form-component';

@Component({
  selector: 'app-register',
  imports: [RegisterFormComponent, RouterLink],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css',
})
export class Register {
  router = inject(Router);
  
  onRegister() {
    this.router.navigate(['/', 'dashboard']);
  }
}
