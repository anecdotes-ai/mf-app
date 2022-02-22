import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-not-exist-error',
  templateUrl: './user-not-exist-error.component.html',
  styleUrls: ['./user-not-exist-error.component.scss']
})
export class UserNotExistErrorComponent {
  buildTranslationKey(relativeKey: string): string {
    return `auth.userNotFoundErrorPage.${relativeKey}`;
  }
}
