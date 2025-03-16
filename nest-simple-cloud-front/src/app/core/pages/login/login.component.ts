import {Component, inject} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {NzCardComponent} from 'ng-zorro-antd/card';
import {NzInputDirective} from 'ng-zorro-antd/input';
import {FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NzColDirective} from 'ng-zorro-antd/grid';
import {NzFlexDirective} from 'ng-zorro-antd/flex';
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from 'ng-zorro-antd/form';
import {NotificationStorageService} from '../../services/notification-storage.service';

@Component({
  selector: 'app-login',
  imports: [
    NzCardComponent,
    FormsModule,
    NzButtonComponent,
    NzInputDirective,
    NzIconDirective,
    NzColDirective,
    NzFlexDirective,
    NzFormControlComponent,
    NzFormItemComponent,
    NzFormDirective,
    NzFormLabelComponent,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(NonNullableFormBuilder);
  formLogin = this.fb.group({
    username: this.fb.control('', [Validators.required]),
    password: this.fb.control('', [Validators.required])
  });

  constructor(
    private as: AuthService,
    private router: Router,
    private nss: NotificationStorageService
  ) {}

  login() {
    this.as.login(this.formLogin.getRawValue()).subscribe({
      next: (data) => {
        this.router.navigate(["/files"]);
      },
      error: err => {
        this.nss.notificationStorage.next({
          type: 'error',
          title: 'Error',
          content: err.error.message
        })
      }
    });
  }
}
