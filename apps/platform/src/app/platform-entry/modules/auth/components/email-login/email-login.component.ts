import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoggerService, TextFieldControl } from 'core';
import { Tenant } from 'core/modules/auth-core/models/domain';
import {
  TenantFacadeService,
  TenantSubDomainExtractorService
} from 'core/modules/auth-core/services';
import { DynamicFormGroup } from 'core/modules/dynamic-form';
import { SubscriptionDetacher } from 'core/utils';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-email-login',
  templateUrl: './email-login.component.html',
  styleUrls: ['./email-login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailLoginComponent implements OnInit, OnDestroy {
  private subscriptionDetacher = new SubscriptionDetacher();
  private isProcessing: boolean;

  @Output()
  signInEmailSent = new EventEmitter<string>();

  @Input()
  tenant: Tenant;

  isProcessing$ = new Subject<boolean>();

  dynamicFormGroup = new DynamicFormGroup({
    email: new TextFieldControl({
      initialInputs: {
        label: this.buildTranslationKey('email.label'),
        placeholder: this.buildTranslationKey('email.placeholder'),
        validateOnDirty: true,
        required: true,
      },
      validators: [Validators.required, Validators.email],
    }),
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private logger: LoggerService,
    private tenantFacade: TenantFacadeService,
    private tenantSubDomainExtractorService: TenantSubDomainExtractorService
  ) { }

  ngOnDestroy(): void {
    this.subscriptionDetacher.detach();
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.queryParams.email) {
      this.dynamicFormGroup.items.email.setValue(this.activatedRoute.snapshot.queryParams.email);
    }

    this.isProcessing$
      .pipe(this.subscriptionDetacher.takeUntilDetach())
      .subscribe((value) => (this.isProcessing = value));
  }

  @HostListener('document:keydown.enter', ['event$'])
  async sendSignInLink(): Promise<void> {
    if (this.dynamicFormGroup.valid && !this.isProcessing) {
      this.isProcessing$.next(true);

      try {
        const encoded_email = encodeURIComponent(this.dynamicFormGroup.items.email.value);
        await this.tenantFacade.sendSignInEmailAsync(
          encoded_email,
          this.tenantSubDomainExtractorService.getCurrentTenantSubDomain()
        );
        this.signInEmailSent.emit(this.dynamicFormGroup.items.email.value);
      } catch (err) {
        this.dynamicFormGroup.items.email.setErrors({ emailNotFound: true });
        this.logger.error(err);
      } finally {
        this.isProcessing$.next(false);
      }
    }
  }

  buildTranslationKey(relativeKey: string): string {
    return `auth.emailPart.${relativeKey}`;
  }
}
