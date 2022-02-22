import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppConfigService, AppRoutes, LoaderManagerService, LoggerService, TextFieldControl } from 'core';
import { TenantFacadeService } from 'core/modules/auth-core/services';
import { DynamicFormGroup } from 'core/modules/dynamic-form';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-login-anecdotes',
  templateUrl: './login-anecdotes.component.html',
  styleUrls: ['./login-anecdotes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginAnecdotesComponent implements OnInit {
  private workspaceFormGroup = new DynamicFormGroup({
    workspace: new TextFieldControl({
      initialInputs: {
        label: this.buildTranslationKey('form.accountWebAddress.label'),
        placeholder: this.buildTranslationKey('form.accountWebAddress.placeholder'),
        validateOnDirty: true,
        required: true,
        errorTexts: {
          workspaceDoesNotExist: this.buildTranslationKey('form.accountWebAddress.workspaceDoesNotExistErrorText'),
        },
      },
      validators: [Validators.required],
    }),
  });

  private emailFormGroup = new DynamicFormGroup({
    email: new TextFieldControl({
      initialInputs: {
        label: this.buildTranslationKey('form.email.label'),
        placeholder: this.buildTranslationKey('form.email.placeholder'),
        validateOnDirty: true,
        required: true
      },
      validators: [Validators.required, Validators.email],
    }),
  });

  dynamicFormGroup: DynamicFormGroup<any>;

  isProcessing$ = new Subject<boolean>();

  @HostListener('document:keydown.enter', ['event$'])
  next: () => Promise<void>;

  constructor(
    private loaderManager: LoaderManagerService,
    private cd: ChangeDetectorRef,
    private tenantFacadeService: TenantFacadeService,
    private logger: LoggerService,
    private configService: AppConfigService,
    private router: Router
      ) { }

  ngOnInit(): void {
    this.workspaceFormGroup.items.workspace.inputs.addonText = `.${this.configService.config.auth.domain}`;
    this.displayEmailForm();
    this.loaderManager.hide();
  }

  buildTranslationKey(relativeKey: string): string {
    return `auth.login.${relativeKey}`;
  }

  navigateToForgot(): void {
    this.router.navigate([`${AppRoutes.Auth}/forgot-account`]);
  }

  private displayEmailForm(): void {
    this.dynamicFormGroup = this.emailFormGroup;
    this.next = this.displayWorkspaceChoosingForm.bind(this);
  }

  private async displayWorkspaceChoosingForm(): Promise<void> {
    if (this.emailFormGroup.invalid) {
      return;
    }

    this.showButtonLoader();

    try {
      const tenant = await this.tenantFacadeService
        .getTenantByEmail(this.emailFormGroup.items.email.value)
        .pipe(take(1))
        .toPromise();

      if (tenant.subdomain) {
        this.redirectToSignIn(tenant.subdomain);
      }

      this.dynamicFormGroup = this.workspaceFormGroup;
      this.next = this.loginToWorkspace.bind(this);

      this.cd.detectChanges();
    } catch (err) {
      this.logger.error(err);
      (this.dynamicFormGroup.items.email as AbstractControl).setErrors({ emailNotFound: true });
    } finally {
      this.hideButtonLoader();
    }
  }

  private async loginToWorkspace(): Promise<void> {
    if (this.workspaceFormGroup.invalid) {
      return;
    }

    this.showButtonLoader();
    const subdomain = this.workspaceFormGroup.items.workspace.value;

    if (await this.tenantFacadeService.doesTenantExist(subdomain).pipe(take(1)).toPromise()) {
      this.redirectToSignIn(subdomain);
    } else {
      this.dynamicFormGroup.items.workspace.setErrors({ workspaceDoesNotExist: true });
      this.hideButtonLoader();
    }
  }

  private redirectToSignIn(subdomain: string): void {
    this.tenantFacadeService.redirectToTenantSignIn(subdomain, { email: this.emailFormGroup.items.email.value });
  }

  private showButtonLoader(): void {
    this.isProcessing$.next(true);
  }

  private hideButtonLoader(): void {
    this.isProcessing$.next(false);
  }
}
