import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderManagerService } from 'core';
import { Idp, Tenant } from 'core/modules/auth-core/models/domain';
import { FirebaseWrapperService, TenantFacadeService } from 'core/modules/auth-core/services';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { take } from 'rxjs/operators';
import { SignInComponentIds, SignInContext } from '../../models';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent implements OnInit {
  currentTenant: Tenant;

  idps: Idp[];
  displayEmailLogin: boolean;

  isConfirmationModalDisplayed: boolean;

  constructor(
    private tenantFacade: TenantFacadeService,
    private loaderManager: LoaderManagerService,
    private cd: ChangeDetectorRef,
    private firebaseWrapperService: FirebaseWrapperService,
    private router: Router,
    private componentSwitcherDirective: ComponentSwitcherDirective
  ) { }

  ngOnInit(): void {
    this.init();
  }

  buildTranslationKey(relativeKey: string): string {
    return `auth.${relativeKey}`;
  }

  async handleSignInEmailSent(enteredEmail: string): Promise<void> {
    const oldContext = await this.componentSwitcherDirective.sharedContext$.pipe(take(1)).toPromise();
    const newContext: SignInContext = {
      ...oldContext, confirmation: {
        enteredEmail
      }
    };
    this.componentSwitcherDirective.changeContext(newContext);
    this.componentSwitcherDirective.goById(SignInComponentIds.ConfirmationPage);
  }

  private async init(): Promise<void> {
    this.loaderManager.show();
    try {
      this.currentTenant = await this.tenantFacade.getCurrentTenantAsync();
    } catch (error) {
      if(error.error.error_detail === 'tenant disabled'){
        this.componentSwitcherDirective.goById(SignInComponentIds.TenantDisabledError);
        this.cd.detectChanges();
        this.loaderManager.hide();
        return;
      }
      else{
        this.router.navigate(['auth', 'login-anecdotes']);
        return;
      }
    }

    this.firebaseWrapperService.setTenantId(this.currentTenant.tenant_id);
    const idps = [];

    this.currentTenant.idps.forEach((idp) => {
      if (idp.idp_type === 'email_sign_in') {
        this.displayEmailLogin = true;
      } else {
        idps.push(idp);
      }
    });

    if (idps.length) {
      this.idps = idps;
    }

    this.cd.detectChanges();
    this.loaderManager.hide();
  }
}
