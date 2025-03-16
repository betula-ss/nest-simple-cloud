import { Routes } from '@angular/router';
import {LoginComponent} from './core/pages/login/login.component';
import {Error401Component} from './core/pages/error401/error401.component';
import {ErrorComponent} from './core/pages/error/error.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'files',
    loadChildren: () => import('./modules/files/files.routes').then(m => m.FILES_ROUTES)
  },
  {
    path: 'error401',
    component: Error401Component
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/files'
  },
  {
    path: '**',
    component: ErrorComponent
  }
];
