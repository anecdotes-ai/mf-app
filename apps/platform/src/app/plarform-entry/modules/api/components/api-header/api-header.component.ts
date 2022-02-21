import { Component } from '@angular/core';

@Component({
  selector: 'app-api-header',
  templateUrl: './api-header.component.html',
  styleUrls: ['./api-header.component.scss'],
})
export class ApiHeaderComponent {
  buildTranslationKey(relativeKey: string): string {
    return `api.header.${relativeKey}`;
  }
}
