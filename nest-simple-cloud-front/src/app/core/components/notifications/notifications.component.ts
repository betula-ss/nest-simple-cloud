import {Component, OnInit} from '@angular/core';
import {NotificationStorageService} from '../../services/notification-storage.service';
import {NzNotificationService} from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-notifications',
  imports: [],
  template: ''
})
export class NotificationsComponent implements OnInit {

  constructor(
    private nss: NotificationStorageService,
    private notification: NzNotificationService
  ) {}

  ngOnInit() {
    this.nss.notificationStorage.subscribe({
      next: (data) => {
        if (data) {
          this.notification.create(data?.type as string, data?.title as string, data?.content as string);
        }
      }
    })
  }
}
