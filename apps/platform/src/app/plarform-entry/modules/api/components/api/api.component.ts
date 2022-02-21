import { Component } from '@angular/core';
import { IntercomService } from 'core';

@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss'],
})
export class ApiComponent {
  constructor(
    private intercomService: IntercomService
  ) { }

  buildTranslationKey(relativeKey: string): string {
    return `api.${relativeKey}`;
  }

  openIntercom(): void {
    this.intercomService.openMessanger();
  }
}
