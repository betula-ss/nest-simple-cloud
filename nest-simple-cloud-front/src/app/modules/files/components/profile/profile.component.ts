import {Component, inject, OnInit} from '@angular/core';
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from 'ng-zorro-antd/form';
import {NzColDirective} from 'ng-zorro-antd/grid';
import {NzInputDirective} from 'ng-zorro-antd/input';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NzFlexDirective} from 'ng-zorro-antd/flex';
import {ProfileService} from '../../services/profile.service';
import {JwtHelperService} from '@auth0/angular-jwt';
import {NotificationStorageService} from '../../../../core/services/notification-storage.service';
import {AuthService} from '../../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [
    NzFormDirective,
    ReactiveFormsModule,
    NzFormItemComponent,
    NzFormLabelComponent,
    NzColDirective,
    NzFormControlComponent,
    NzInputDirective,
    NzButtonComponent,
    NzIconDirective,
    NzFlexDirective
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  profileForm = this.fb.group({
    id: this.fb.control('', [Validators.required]),
    username: this.fb.control(''),
    password: this.fb.control('')
  });

  constructor(
    private ps: ProfileService,
    private nss: NotificationStorageService,
    private as: AuthService
  ) {}

  ngOnInit() {
    const access_token = localStorage.getItem('access_token');
    if (access_token) {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(access_token as string);
      this.profileForm.patchValue({
        id: decodedToken.id,
        username: decodedToken.username
      })
    }
  }

  submitForm(): void {
    this.ps.updateUser(this.profileForm.getRawValue()).subscribe({
      next: (data) => {
        this.nss.notificationStorage.next({
          type: 'success',
          title: 'Success',
          content: 'Profile saved successfully'
        })
        if (data.access_token) {
          const helper = new JwtHelperService();
          const decodedToken = helper.decodeToken(data.access_token as string);
          this.profileForm.patchValue({
            id: decodedToken.id,
            username: decodedToken.username
          })
          this.as.updateToken(data.access_token as string)
        }
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
