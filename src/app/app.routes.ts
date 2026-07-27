import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RedirectCommand, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { Login } from './routes/auth/login/login-component';
import { Register } from './routes/auth/register/register-component';
import { Dashboard } from './routes/dashboard/dashboard-component';
import { ProjectComponent } from './routes/project/project-component';
import { AuthService } from './services/auth-service';
import { AccountSettings } from './routes/auth/account-settings/account-settings';
import { accountSettingsRoutes } from './routes/auth/account-settings/account-settings.routes';
import { ItemType, PlayerService } from './services/player-service';
import { firstValueFrom } from 'rxjs';

export enum RouteItems {
    LogIn = 'log-in',
    Register = 'register',
    Dashboard = 'dashboard',
    Project = 'project',
    AccountSettings = 'account-settings',
}

const authRequiredGuard: CanActivateFn = (_r: ActivatedRouteSnapshot, _s: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);    
    
    if (authService.isAuthenticated) {
        return true;
    } else {
        return new RedirectCommand(router.parseUrl('/' + RouteItems.LogIn))
    }
}
const authForbiddenGuard: CanActivateFn = (_r: ActivatedRouteSnapshot, _s: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    
    if (authService.isAuthenticated) {
        return new RedirectCommand(router.parseUrl('/' + RouteItems.Dashboard))
    } else {
        return true;
    }
}
const projectAccessGuard: CanActivateFn = async (route: ActivatedRouteSnapshot, _s: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    const playerService = inject(PlayerService);
    const router = inject(Router);
    
    if (authService.isAdmin) {
        return true;
    }
    
    const projectId = route.paramMap.get('project-id')
    if (projectId) {
        const permissions = await firstValueFrom(playerService.getItemPlayer(+projectId, ItemType.Project));
        if (permissions.read || permissions.add || permissions.update || permissions.delete || permissions.admin) {
            return true;
        }
    }
    return new RedirectCommand(router.parseUrl('/' + RouteItems.Dashboard))
}

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/' + RouteItems.Dashboard,
        pathMatch: 'full'
    },
    {
        path: RouteItems.Dashboard,
        title: 'Dashboard',
        component: Dashboard,
        canActivate: [authRequiredGuard]
    },
    {
        path: RouteItems.Project,
        title: 'New project',
        component: ProjectComponent,
        canActivate: [authRequiredGuard],
        resolve: {
            projectId: (route: ActivatedRouteSnapshot) => null,
        }
    },
    {
        path: RouteItems.Project + '/:project-id',
        title: 'Project',
        component: ProjectComponent,
        canActivate: [authRequiredGuard, projectAccessGuard],
        resolve: {
            projectId: (route: ActivatedRouteSnapshot) => {
                const param = route.paramMap.get('project-id');
                return param ? +param : undefined;
            },
        }
    },
    {
        path: RouteItems.AccountSettings,
        component: AccountSettings,
        canActivate: [authRequiredGuard],
        children: accountSettingsRoutes
    },
    {
        path: RouteItems.LogIn,
        title: 'Log in',
        component: Login,
        canActivate: [authForbiddenGuard],
    },
    {
        path: RouteItems.Register,
        title: 'Register',
        component: Register,
        canActivate: [authForbiddenGuard],
    },
    {
        path: '**',
        redirectTo: '/' + RouteItems.Dashboard
    }
];
