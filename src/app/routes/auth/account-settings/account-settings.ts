import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from "@angular/router";
import { Button } from "primeng/button";
import { DrawerModule } from 'primeng/drawer';
import { PanelMenuModule } from 'primeng/panelmenu';
import { RouteItems } from '../../../app.routes';
import { AccountSettingsRouteItems } from './account-settings.routes';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-account-settings',
  imports: [PanelMenuModule, Button, RouterLink, DrawerModule, RouterOutlet],
  templateUrl: './account-settings.html',
  styleUrl: './account-settings.css',
})
export class AccountSettings {
  authService = inject(AuthService);
  AppRouteItems = RouteItems;
  AccountSettingsRouteItems = AccountSettingsRouteItems;

  menuItemsVisible = signal(false);
  menuItems = [
    {
      label: 'My account',
      icon: 'pi pi-user',
      routerLink: AccountSettingsRouteItems.Account
    },
    {
      label: 'Git',
      icon: 'pi pi-github',
      routerLink: AccountSettingsRouteItems.Git
    },
    {
      label: 'Admin',
      icon: 'pi pi-crown',
      routerLink: AccountSettingsRouteItems.Admin,
      visible: this.authService.isAdmin
    }
  ];
}
