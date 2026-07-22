import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RedirectCommand, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { AuthService } from '../../../services/auth-service';
import { AccountSettingsComponent } from './account-settings-component/account-settings-component';
import { AdminSettingsComponent } from './admin-settings-component/admin-settings-component';
import { GitSettingsComponent } from './git-settings-component/git-settings-component';

export enum AccountSettingsRouteItems {
    Account = 'account',
    Git = 'git',
    Admin = 'admin'
}

const adminAuthRequiredGuard: CanActivateFn = (_r: ActivatedRouteSnapshot, _s: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAdmin) {
        return true;
    } else {
        return new RedirectCommand(router.parseUrl('/' + AccountSettingsRouteItems.Account))
    }
}

export const accountSettingsRoutes: Routes = [
    {
        path: '',
        redirectTo: AccountSettingsRouteItems.Account,
        pathMatch: 'full'
    },
    {
        path: AccountSettingsRouteItems.Account,
        title: 'My account',
        component: AccountSettingsComponent,
    },
    {
        path: AccountSettingsRouteItems.Git,
        title: 'Git',
        component: GitSettingsComponent,
    },
    {
        path: AccountSettingsRouteItems.Admin,
        title: 'Admin',
        component: AdminSettingsComponent,
        canActivate: [adminAuthRequiredGuard]
    },
    {
        path: '**',
        redirectTo: AccountSettingsRouteItems.Account
    }
];
