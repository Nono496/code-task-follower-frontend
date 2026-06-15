import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { Dashboard } from './routes/dashboard/dashboard-component';
import { inject } from '@angular/core';
import { ProjectService } from './services/project-service';
import { TaskService } from './services/task-service';
import { ProjectComponent } from './routes/project/project-component';
import { Signin } from './routes/auth/signin/signin-component';
import { Login } from './routes/auth/login/login-component';
import { Project } from './dtos/project';

export enum RouteItems {
    LogIn = 'log-in',
    SignIn = 'sign-in',
    Dashboard = 'dashboard',
    Project = 'project'
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
        resolve: {
            projects: (route: ActivatedRouteSnapshot) => {
                const projectService = inject(ProjectService);
                return projectService.getProjects();
            },
            tasks: (route: ActivatedRouteSnapshot) => {
                const taskService = inject(TaskService);
                return taskService.getTasks();
            }
        }
    },
    {
        path: RouteItems.Project + '/:project-id',
        title: 'Project',//FIXME Should be project title
        component: ProjectComponent,
        resolve: {
            project: (route: ActivatedRouteSnapshot) => {
                const projectService = inject(ProjectService);
                const projectId = +route.paramMap.get('project-id')!;

                return projectService.getProject(projectId);
            },
            states: (route: ActivatedRouteSnapshot) => {
                return inject(TaskService).getStates();
            },
        }
    },
    {
        path: RouteItems.Project,
        title: 'New project',
        component: ProjectComponent,
        resolve: {
            project: (route: ActivatedRouteSnapshot) => {
                return {} as Project;
            },
            states: (route: ActivatedRouteSnapshot) => {
                return inject(TaskService).getStates();
            },
        }
    },
    {
        path: RouteItems.LogIn,
        title: 'Log in',
        component: Login,
    },
    {
        path: RouteItems.SignIn,
        title: 'Sign in',
        component: Signin,
    },
    {
        path: '**',
        redirectTo: '/' + RouteItems.LogIn
    }
];
