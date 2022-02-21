import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { SubscriptionDetacher } from 'core/utils';
import { LoaderManagerService } from 'core';
import { skip, take } from 'rxjs/operators';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent implements OnInit, OnDestroy {
  private subscriptionDetacher = new SubscriptionDetacher();
  areChildrenDisplayed: boolean;
  loaderHidden: boolean;

  constructor(
    private fireAuth: AngularFireAuth,
    private router: Router,
    private cd: ChangeDetectorRef,
    private loader: LoaderManagerService,
  ) { }

  ngOnDestroy(): void {
    this.subscriptionDetacher.detach();
  }

  ngOnInit(): void {
    this.loader.loaderStream$.pipe(this.subscriptionDetacher.takeUntilDetach(), skip(1)).subscribe((isDisplayed) => {
      this.loaderHidden = !isDisplayed;
      this.cd.detectChanges();
    });
    this.checkIfAuthenticated();
  }

  private async checkIfAuthenticated(): Promise<any> {
    const token = await this.fireAuth.idToken.pipe(take(1)).toPromise();

    if (token) {
      this.router.navigate(['/']);
    } else {
      this.areChildrenDisplayed = true;
      this.cd.detectChanges();
    }
  }
}
