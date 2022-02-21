import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoaderManagerService, LoggerService, WindowHelperService } from 'core';
import { AuthService, FirebaseWrapperService } from 'core/modules/auth-core/services';

@Component({
  selector: 'app-email-callback',
  templateUrl: './email-callback.component.html',
  styleUrls: ['./email-callback.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailCallbackComponent implements OnInit {
  isErrorScreenDisplayed: boolean;

  constructor(
    private firebaseWrapperService: FirebaseWrapperService,
    private authService: AuthService,
    private windowHelper: WindowHelperService,
    private logger: LoggerService,
    private activatedRoute: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private loaderManager: LoaderManagerService
  ) { }

  ngOnInit(): void {
    this.init();
  }

  buildTranslationKey(relativeKey: string): string {
    return `auth.emailCallback.${relativeKey}`;
  }

  private async init(): Promise<void> {
    if (!(await this.trySignInWithEmailAsync())) {
      this.isErrorScreenDisplayed = true;
      this.loaderManager.hide();
      this.cd.detectChanges();
    }
  }

  private async trySignInWithEmailAsync(): Promise<boolean> {
    try {
      if (this.firebaseWrapperService.isSignInWithEmailLinkByQueryParams(this.activatedRoute.snapshot.queryParams)) {
        await this.authService.signInWithEmailLinkAsync(this.activatedRoute.snapshot.queryParams);
        this.windowHelper.redirectToOrigin();
        return true;
      }
    } catch (err) {
      this.logger.error(err);
    }

    return false;
  }
}
