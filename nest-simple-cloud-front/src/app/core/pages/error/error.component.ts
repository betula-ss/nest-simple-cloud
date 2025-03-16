import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzFlexDirective} from 'ng-zorro-antd/flex';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NzResultComponent} from 'ng-zorro-antd/result';

@Component({
  selector: 'app-error',
  imports: [
    NzButtonComponent,
    NzFlexDirective,
    NzIconDirective,
    NzResultComponent
  ],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export class ErrorComponent {

  constructor(
    private router: Router
  ) {}

  goToMainPage(): void {
    this.router.navigate(["/files"]);
  }
}
