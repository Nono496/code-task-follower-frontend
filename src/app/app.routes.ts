import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Dashboard } from './dashboard/dashboard';
import { Signin } from './auth/signin/signin';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: 'dashboard/:user-id',
        component: Dashboard,
        title: 'Dashboard'
    },
    {
        path: 'login',
        component: Login,
        title: 'Log in'
    },
    {
        path: 'signin',
        component: Signin,
        title: 'Sign in'
    },
    {
        path: '**',
        redirectTo: '/login'
    }
];
