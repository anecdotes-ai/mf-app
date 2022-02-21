import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { TextFieldControl } from 'core';
import { SamlFacadeService } from 'core/modules/auth-core/services';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { CustomValidators, DynamicFormGroup } from 'core/modules/dynamic-form';
import { SubscriptionDetacher } from 'core/utils';
import { BehaviorSubject } from 'rxjs';
import {
  SelectedItemToSetSSO,
  SetSSOModalsIds,
  SetSSOSharedContext,
  translationRootKey
} from '../../models';

const ssoLinkFailKey = "ssoLinkFail";

@Component({
  selector: 'app-sso-connection',
  templateUrl: './sso-connection.component.html',
  styleUrls: ['./sso-connection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SsoConnectionComponent implements OnInit {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  private switcherSharedContext: SetSSOSharedContext;

  @HostBinding('class')
  private classes = 'flex flex-column w-full h-full font-main';

  selectedSSOItem: SelectedItemToSetSSO;
  formGroup = new DynamicFormGroup({
    link: new TextFieldControl({
      initialInputs: {
        required: true,
        label: this.buildTranslationKey('idpLinkFieldTitle'),
        placeholder: 'https://example.com',
        validateOnDirty: true,
        isDisabled: false,
        errorTexts: {
          [ssoLinkFailKey]: this.buildTranslationKey('connectionErrorText')
        }
      },
      validators: [Validators.required, CustomValidators.url],
    }),
  });

  connectOrUpdateProcessing$ = new BehaviorSubject(false);
  disconnectProcessing$ = new BehaviorSubject(false);

  get isEditMode(): boolean {
    return !!this.selectedSSOItem?.link;
  }

  get isValueChanged(): boolean {
    return this.formGroup.items.link.value !== this.selectedSSOItem.link;
  }

  constructor(
    private componentSwitcher: ComponentSwitcherDirective,
    private samlFacadeService: SamlFacadeService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.componentSwitcher.sharedContext$
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((context: SetSSOSharedContext) => {
        this.switcherSharedContext = context;
        this.selectedSSOItem = context.selectedItemToSetSSO;
        this.formGroup.items.link.setValue(this.selectedSSOItem.link);
        this.formGroup.markAsPristine();
        this.cd.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  buildTranslationKey(relativeKey: string): string {
    return `${translationRootKey}.${relativeKey}`;
  }

  buildTranslationKeyForSSOItem(relativeKey: string): string {
    return `${translationRootKey}.idpTexts.${this.selectedSSOItem.type.toLocaleLowerCase()}.${relativeKey}`;
  }

  async connect(): Promise<void> {
    this.connectOrUpdateProcessing$.next(true);

    try {
      await this.samlFacadeService.setSSOLink(this.formGroup.items.link.value);
      await this.switcherSharedContext.setCallBack();
      this.displaySuccessState();
    } catch (err) {
      this.formGroup.items.link.setErrors({ [ssoLinkFailKey]: true });
    } finally {
      this.connectOrUpdateProcessing$.next(false);
    }
  }

  disconnect(): void {
    this.componentSwitcher.goById(SetSSOModalsIds.RemoveLinkConfirmation);
  }

  private displaySuccessState(): void {
    this.componentSwitcher.changeContext({
      ...this.switcherSharedContext,
      successPrimaryTextTranslationKey: this.buildTranslationKey('connectionSuccessState.primaryText'),
      successSecondaryTextTranslationKey: this.buildTranslationKey('connectionSuccessState.secondaryText'),
    } as SetSSOSharedContext);
    this.componentSwitcher.goById(SetSSOModalsIds.SuccesscfullySetteledSSO);
  }
}
