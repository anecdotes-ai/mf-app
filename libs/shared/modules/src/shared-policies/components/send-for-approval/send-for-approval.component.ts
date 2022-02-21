import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Validators } from '@angular/forms';
import { RadioButtonsGroupControl, TextAreaControl, RadioButtonModel, TipTypeEnum } from 'core/models';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { ApproverTypeEnum, PolicyShare, ShareMethodEnum } from 'core/modules/data/models/domain';
import { PoliciesFacadeService } from 'core/modules/data/services/facades';
import { DynamicFormGroup } from 'core/modules/dynamic-form';
import { ModalWindowService } from 'core/modules/modals/services';
import { SubscriptionDetacher } from 'core/utils';
import { SendForApproval } from '../../constants/modal-ids.constants';
import { SendForApprovalContext } from '../../models/send-for-approval-context';
import { Clipboard } from '@angular/cdk/clipboard';

const RESHARE_TIMEOUT = 20000;

const SEND = 'send';
const COPY = 'copy';
const COPIED = 'copied';

const SHARE_STRING = {
  share: { email: SEND, link: COPY },
  shared: { email: SEND, link: COPIED },
  reshare: { email: SEND, link: COPY },
};

const FORM_LABELS = {
  shareMethod: 'share_method',
  message: 'message',
};

@Component({
  selector: 'app-send-for-approval',
  templateUrl: './send-for-approval.component.html',
  styleUrls: ['./send-for-approval.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendForApprovalComponent implements OnInit, OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  private shareState: string;

  isLoading: boolean;
  policyId: string;
  approverEmail: string;
  formGroup: DynamicFormGroup<any>;
  leftCornerText: string;
  tipTypes = TipTypeEnum;
  isResend: boolean;
  approverType: ApproverTypeEnum;

  @ViewChild('approver')
  approverTemplate: TemplateRef<any>;

  @ViewChild('link')
  linkTemplate: TemplateRef<any>;

  private get isLink(): boolean {
    return this.formGroup.items.share_method.value === ShareMethodEnum.Link;
  }

  get isReshare(): boolean {
    return this.shareState === SendForApproval.ReShare;
  }

  constructor(
    private policiesFacade: PoliciesFacadeService,
    private cd: ChangeDetectorRef,
    private switcher: ComponentSwitcherDirective,
    private modalWindowService: ModalWindowService,
    private clipboard: Clipboard,
  ) {}

  // **** Lifecycle Hooks ****

  ngOnInit(): void {
    this.shareState = this.switcher.currentComponent.id;
    this.switcher.sharedContext$.pipe(this.detacher.takeUntilDetach()).subscribe((context: SendForApprovalContext) => {
      this.policyId = context.policyId;
      this.leftCornerText = context.leftCornerText;
      this.approverEmail = context.approverEmail;
      this.isResend = context.isResend;
      this.approverType = context.approverType;
      this.buildForm();
    });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  // **** Public TranslationKey Methods ****

  buildTranslationKey(key: string): string {
    return `policyManager.sendForApproval.${key}`;
  }

  buildActionButton(): string {
    const shareMethod = this.formGroup.items.share_method.value;
    return this.buildTranslationKey(SHARE_STRING[this.shareState][shareMethod]);
  }

  // **** Public Logic Methods ****

  async send(): Promise<void> {
    this.isLoading = true;
    try {
      const payload: PolicyShare = { ...this.formGroup.value, user_email: this.approverEmail, approver_type: this.approverType };
      const link = await this.policiesFacade.sharePolicy(this.policyId, payload, this.isLink, this.isResend);
      this.shareState = SendForApproval.Shared;
      this.isLink ? this.copyLink(link) : this.switcher.goById(SendForApproval.Shared);
    } catch (e) {
      this.switcher.goById(SendForApproval.Error);
    } finally {
      this.isLoading = false;
      this.cd.detectChanges();
    }
  }

  close(): void {
    this.modalWindowService.close();
  }
  // **** Form Private Methods ***

  private buildForm(): void {
    this.formGroup = new DynamicFormGroup({
      [FORM_LABELS.shareMethod]: new RadioButtonsGroupControl({
        initialInputs: {
          label: this.buildTranslationKey('sendVia'),
          dynamicNoteFactory: this.dynamicShareMethodNote.bind(this),
          buttons: [
            {
              id: ShareMethodEnum.Email,
              value: ShareMethodEnum.Email,
              label: this.buildTranslationKey('email'),
            } as RadioButtonModel,
            {
              id: ShareMethodEnum.Link,
              value: ShareMethodEnum.Link,
              label: this.buildTranslationKey('link'),
            } as RadioButtonModel,
          ],
        },
        validators: [Validators.required],
      }),
    });
    this.subscribeForFormValueChanges();
    this.enrichFormValues();
  }

  private subscribeForFormValueChanges(): void {
    this.formGroup.items.share_method.valueChanges
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((valueChanged: string) => {
        valueChanged === ShareMethodEnum.Email ? this.addMessageToForm() : this.removeMessageFromForm();
        this.cd.detectChanges();
      });
  }

  private enrichFormValues(): void {
    this.formGroup.items.share_method.setValue(ShareMethodEnum.Email);
  }

  private addMessageToForm(): void {
    this.formGroup.addControl(
      FORM_LABELS.message,
      new TextAreaControl({
        initialInputs: {
          label: this.buildTranslationKey('addComment'),
          multiline: true,
          rows: 3,
          resizable: false,
        },
      })
    );
  }

  private removeMessageFromForm(): void {
    this.formGroup.removeControl(FORM_LABELS.message);
  }

  private dynamicShareMethodNote(shareMethod: ShareMethodEnum): TemplateRef<any> {
    switch (shareMethod) {
      case ShareMethodEnum.Email:
        return this.approverTemplate;
      case ShareMethodEnum.Link:
        return this.linkTemplate;
      default:
        return;
    }
  }

  // **** Logic Private Methods ****

  private copyLink(link: string): void {
    if (!link) {
      throw new Error('No link was passed to the user.');
    }
    this.shareState = SendForApproval.Shared;
    this.clipboard.copy(link);
    setTimeout(() => {
      this.shareState = SendForApproval.ReShare;
      this.cd.detectChanges();
    }, RESHARE_TIMEOUT);
  }
}
