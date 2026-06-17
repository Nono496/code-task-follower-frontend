import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  getAuthToken(): string {
    return 'blublu';
  }
}
