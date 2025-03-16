import { Component } from '@angular/core';
import {NzResultComponent} from 'ng-zorro-antd/result';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzFlexDirective} from 'ng-zorro-antd/flex';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {Router} from '@angular/router';

@Component({
  selector: 'app-error401',
  imports: [
    NzResultComponent,
    NzButtonComponent,
    NzFlexDirective,
    NzIconDirective
  ],
  templateUrl: './error401.component.html',
  styleUrl: './error401.component.css'
})
export class Error401Component {

  constructor(
    private router: Router
  ) {}

  goToLoginPage(): void {
    this.router.navigate(["/login"]);
  }
}
