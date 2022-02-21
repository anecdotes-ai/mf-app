import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { LoaderManagerService, TextFieldControl } from 'core';
import { DynamicFormGroup } from 'core/modules/dynamic-form';
import { SignInComponentIds } from '../../models';
import { Subject } from 'rxjs';
import { TenantService } from 'core/modules/auth-core/services';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-forgot-account',
  templateUrl: './forgot-account.component.html',
  styleUrls: ['./forgot-account.component.scss']
})
export class ForgotAccountComponent implements OnInit {
  isProcessing$ = new Subject<boolean>();
  dynamicFormGroup: DynamicFormGroup<any> = new DynamicFormGroup({
    email: new TextFieldControl({
      initialInputs: {
        label: this.buildTranslationKey('form.email.label'),
        placeholder: this.buildTranslationKey('form.email.placeholder'),
        validateOnDirty: true,
        required: true,
      },
      validators: [Validators.required, Validators.email],
    }),
  });

  constructor(private loaderManager: LoaderManagerService,
              private componentSwitcherDirective: ComponentSwitcherDirective,
              private tenantService: TenantService) { }

  ngOnInit(): void {
    this.loaderManager.hide();
  }

  buildTranslationKey(relativeKey: string): string {
    return `auth.login.${relativeKey}`;
  }

  async submit(): Promise<void> {
    const email = this.dynamicFormGroup.get('email').value;
    this.isProcessing$.next(true);
    this.tenantService.forgotAccount(email).pipe(take(1)).subscribe(
      () => {
        const context = {
          confirmation: {
            enteredEmail: email
          }
        };
        this.componentSwitcherDirective.changeContext(context);
        this.componentSwitcherDirective.goById(SignInComponentIds.ConfirmationPage);
      }
    );
  }

}
