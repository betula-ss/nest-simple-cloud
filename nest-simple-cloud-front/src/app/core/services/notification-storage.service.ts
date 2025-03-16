import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface NotificationStorage {
  type: string,
  title: string,
  content: string
}

@Injectable({
  providedIn: 'root'
})
export class NotificationStorageService {
  notificationStorage = new BehaviorSubject<NotificationStorage | null>(null);

  constructor() { }
}
