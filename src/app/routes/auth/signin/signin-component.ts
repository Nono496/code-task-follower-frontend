import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SignInFormComponent } from './sign-in-form-component/sign-in-form-component';

@Component({
  selector: 'app-signin',
  imports: [SignInFormComponent, RouterLink],
  templateUrl: './signin-component.html',
  styleUrl: './signin-component.css',
})
export class Signin {
  router = inject(Router);
  
  onSignIn() {
    this.router.navigate(['/', 'dashboard']);
  }
}
