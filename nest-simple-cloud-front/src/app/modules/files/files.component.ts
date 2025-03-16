import {Component, OnInit} from '@angular/core';
import {FilesService} from './services/files.service';
import {NzCardComponent} from 'ng-zorro-antd/card';
import {NzListComponent, NzListItemComponent, NzListItemMetaComponent} from 'ng-zorro-antd/list';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzSpaceComponent, NzSpaceItemDirective} from 'ng-zorro-antd/space';
import {AuthService} from '../../core/services/auth.service';
import {Router} from '@angular/router';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NzModalModule, NzModalService} from 'ng-zorro-antd/modal';
import {ProfileComponent} from './components/profile/profile.component';
import {NotificationStorageService} from '../../core/services/notification-storage.service';
import {FileUploadComponent} from './components/file-upload/file-upload.component';
import {FileDataDto} from './models/FileDataDto';
import {NzTooltipDirective} from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-files',
  imports: [
    NzCardComponent,
    NzListComponent,
    NzListItemComponent,
    NzListItemMetaComponent,
    NzButtonComponent,
    NzSpaceComponent,
    NzSpaceItemDirective,
    NzIconDirective,
    NzModalModule,
    NzTooltipDirective
  ],
  templateUrl: './files.component.html',
  styleUrl: './files.component.css'
})
export class FilesComponent implements OnInit {
  files: FileDataDto[] = []
  isLoading = false;

  constructor(
    private fs: FilesService,
    private as: AuthService,
    private router: Router,
    private modal: NzModalService,
    private nss: NotificationStorageService
  ) {}

  ngOnInit() {
    this.getFiles();
  }

  getFiles(): void {
    this.isLoading = true;
    this.fs.getFiles().subscribe({
      next: (data) => {
        this.files = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.nss.notificationStorage.next({
          type: 'error',
          title: 'Error',
          content: err.error.message
        })
        this.isLoading = false;
      }
    });
  }

  viewFile(file: FileDataDto): void {
    this.fs.getFile(file.id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      },
      error: (err) => {
        this.nss.notificationStorage.next({
          type: 'error',
          title: 'Error',
          content: err.error.message
        })
      }
    });
  }

  uploadFile(): void {
    const modal = this.modal.create({
      nzTitle: 'Upload',
      nzContent: FileUploadComponent,
      nzFooter: null,
      nzWidth: "80%"
    });
    modal.afterClose.subscribe(result => {
      if (result) {
        this.getFiles()
      }
    });
  }

  deleteFile(id: string): void {
    this.fs.deleteFile(id).subscribe({
      next: (result: boolean) => {
        if (result) {
          this.getFiles()
          this.nss.notificationStorage.next({
            type: 'success',
            title: 'Success',
            content: 'The file was deleted successfully'
          })
        }
      },
      error: (err) => {
        this.nss.notificationStorage.next({
          type: 'error',
          title: 'Error',
          content: err.error.message
        })
      }
    });
  }

  openSettings(): void {
    this.modal.create({
      nzTitle: 'Settings',
      nzContent: ProfileComponent,
      nzFooter: null,
      nzWidth: "80%"
    });
  }

  logout(): void {
    this.as.logout();
    this.router.navigate(["/login"]);
  }
}
