import { AuthService } from 'core/modules/auth-core/services';
import { UserClaims } from 'core/modules/auth-core/models';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome-header',
  templateUrl: './welcome-header.component.html',
  styleUrls: ['./welcome-header.component.scss'],
})
export class WelcomeHeaderComponent implements OnInit {
  constructor(private authService: AuthService) {}

  currentUser$: Promise<UserClaims>;

  ngOnInit(): void {
    this.currentUser$ = this.authService.getUserAsync() as Promise<UserClaims>;
  }

  buildTranslationKey(relativeKey: string): string {
    return `welcomePage.${relativeKey}`;
  }
}
