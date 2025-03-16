import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NotificationsComponent} from './core/components/notifications/notifications.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationsComponent],
  template: '<router-outlet></router-outlet><app-notifications></app-notifications>'
})
export class AppComponent {}
