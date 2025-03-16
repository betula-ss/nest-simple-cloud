import {Routes} from '@angular/router';
import {FilesComponent} from './files.component';
import {AuthGuard} from '../../core/guards/auth.guard';

export const FILES_ROUTES: Routes = [
  {
    path: '',
    component: FilesComponent,
    canActivate: [AuthGuard]
  },
]
