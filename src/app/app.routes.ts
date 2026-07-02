import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RedirectCommand, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { Login } from './routes/auth/login/login-component';
import { Signin } from './routes/auth/signin/signin-component';
import { Dashboard } from './routes/dashboard/dashboard-component';
import { ProjectComponent } from './routes/project/project-component';
import { AuthService } from './services/auth-service';
import { ProjectService } from './services/project-service';
import { TaskService } from './services/task-service';

export enum RouteItems {
    LogIn = 'log-in',
    SignIn = 'sign-in',
    Dashboard = 'dashboard',
    Project = 'project'
}

const authRequiredGuard: CanActivateFn = (_r: ActivatedRouteSnapshot, _s: RouterStateSnapshot) => {
    if (inject(AuthService).isAuthenticated()) {
        return true;
    } else {
        return new RedirectCommand(inject(Router).parseUrl('/' + RouteItems.LogIn))
    }
}
const authForbiddenGuard: CanActivateFn = (_r: ActivatedRouteSnapshot, _s: RouterStateSnapshot) => {
    if (inject(AuthService).isAuthenticated()) {
        return new RedirectCommand(inject(Router).parseUrl('/' + RouteItems.Dashboard))
    } else {
        return true;
    }
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
        //canActivate: [authRequiredGuard]
    },
    {
        path: RouteItems.Project,
        title: 'New project',
        component: ProjectComponent,
        //canActivate: [authRequiredGuard],
        resolve: {
            projectId: (route: ActivatedRouteSnapshot) => null,
        }
    },
    {
        path: RouteItems.Project + '/:project-id',
        title: 'Project',//FIXME Should be project title
        component: ProjectComponent,
        //canActivate: [authRequiredGuard],
        resolve: {
            projectId: (route: ActivatedRouteSnapshot) => {
                const param = route.paramMap.get('project-id');
                return param ? +param : undefined;
            },
        }
    },
    {
        path: RouteItems.LogIn,
        title: 'Log in',
        component: Login,
        canActivate: [authForbiddenGuard],
    },
    {
        path: RouteItems.SignIn,
        title: 'Sign in',
        component: Signin,
        canActivate: [authForbiddenGuard],
    },
    {
        path: '**',
        redirectTo: '/' + RouteItems.Dashboard
    }
];
