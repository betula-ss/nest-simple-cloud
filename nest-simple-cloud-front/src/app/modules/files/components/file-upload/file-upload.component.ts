import {Component, inject} from '@angular/core';
import {FilesService} from '../../services/files.service';
import {NzColDirective, NzRowDirective} from 'ng-zorro-antd/grid';
import {NzInputDirective} from 'ng-zorro-antd/input';
import {FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzUploadComponent, NzUploadFile} from 'ng-zorro-antd/upload';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NotificationStorageService} from '../../../../core/services/notification-storage.service';
import {NzFlexDirective} from 'ng-zorro-antd/flex';
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from 'ng-zorro-antd/form';
import {NzModalRef} from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  imports: [
    NzRowDirective,
    NzInputDirective,
    FormsModule,
    NzButtonComponent,
    NzUploadComponent,
    NzIconDirective,
    NzColDirective,
    NzFlexDirective,
    NzFormControlComponent,
    NzFormDirective,
    NzFormItemComponent,
    NzFormLabelComponent,
    ReactiveFormsModule
  ],
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  readonly modal = inject(NzModalRef);
  private fb = inject(NonNullableFormBuilder);
  fileForm = this.fb.group({
    title: this.fb.control('', [Validators.required]),
    category: this.fb.control('')
  });
  uploading = false;
  fileList: NzUploadFile[] = [];

  constructor(
    public fs: FilesService,
    private nss: NotificationStorageService
  ) {}

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = []
    this.fileList = this.fileList.concat(file);
    return false;
  };

  handleUpload(): void {
    if (this.fileList.length != 1 || !this.fileForm.valid) {
      this.nss.notificationStorage.next({
        type: 'info',
        title: 'Info',
        content: 'Specify the file name and select the file'
      })
      return;
    }
    this.uploading = true;
    const formData = new FormData();
    formData.append('title', this.fileForm.getRawValue().title);
    formData.append('category', this.fileForm.getRawValue().category);
    this.fileList.forEach((file: any) => {
      formData.append('file', file);
    });
    this.fs.uploadFile(formData).subscribe({
      next: () => {
        this.nss.notificationStorage.next({
          type: 'success',
          title: 'Success',
          content: 'The file was uploaded successfully'
        })
        this.uploading = false;
        this.modal.destroy(true)
      },
      error: (err) => {
        this.nss.notificationStorage.next({
          type: 'error',
          title: 'Error',
          content: `Download error: ${err.message}`
        })
        this.uploading = false;
      }
    });
  }
}
