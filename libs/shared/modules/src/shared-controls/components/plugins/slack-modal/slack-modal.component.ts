import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TextAreaControl, TextFieldControl } from 'core/models';
import { LoaderManagerService } from 'core/services';
import { CalculatedControl } from 'core/modules/data/models';
import { ModalWindowService } from 'core/modules/modals';
import { ControlRequirement, Framework } from 'core/modules/data/models/domain';
import { SlackChannel, SlackUser } from 'core/modules/data/models/slack';
import { OperationsTrackerService, SlackService, TrackOperations, RequirementsFacadeService } from 'core/modules/data/services';
import { SubscriptionDetacher } from 'core/utils';
import { DynamicFormGroup } from 'core/modules/dynamic-form';
import { combineLatest } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-slack-modal',
  templateUrl: './slack-modal.component.html',
  styleUrls: ['./slack-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlackModalComponent implements OnInit, OnDestroy, OnChanges {
  private modalDataPrepared: boolean;
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  @ViewChild('successModal')
  private successTemlate: TemplateRef<any>;

  @ViewChild('failedModal')
  private failedTemplate: TemplateRef<any>;

  suggestions = [];

  @HostBinding('class.loading')
  displayLoader = false;

  sendMessage: boolean;

  @Input()
  controlRequirement: ControlRequirement;

  @Input()
  controlInstance: CalculatedControl;

  @Input()
  slackModalContentAllowed: boolean;

  @Input()
  currentFramework: Framework;

  channels: SlackChannel[];
  users: SlackUser[];

  form = new DynamicFormGroup({
    searchChannels: new TextFieldControl({
      initialInputs: {
        required: true,
        label: this.buildTranslationKey('form.searchTextField.label'),
        suggestionsConfig: { maxItemsToDisplay: 4 },
        validateOnDirty: true
      },
      validators: [Validators.required],
    }),
    message: new TextAreaControl({
      initialInputs: {
        label: this.buildTranslationKey('form.messageTextArea.label'),
      },
    }),
  });

  constructor(
    private modalWindowService: ModalWindowService,
    private slackService: SlackService,
    private cd: ChangeDetectorRef,
    private operationsTrackerService: OperationsTrackerService,
    private loaderManagerService: LoaderManagerService,
    private router: Router,
    private requirementFacade: RequirementsFacadeService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('slackModalContentAllowed' in changes) {
      const allowed = changes['slackModalContentAllowed'].currentValue;

      if (allowed !== undefined) {
        allowed ? this.prepareModalWindow() : this.redirectToSlackPlugin();
      }
    }
  }

  ngOnInit(): void {
    this.displayLoader = true;
  }

  private prepareModalWindow(): void {
    if (this.modalDataPrepared) {
      return;
    }

    this.setHandlerForSuccessTaskSendMessageOperation();
    this.setHandlerForErrorTaskSendMessageOperation();

    combineLatest([this.slackService.getChannels(), this.slackService.getUsers()])
      .pipe(this.detacher.takeUntilDetach())
      .subscribe(([channels, users]) => {
        this.users = users;
        this.channels = channels;
        this.suggestions = channels
          .map((channel) => channel.channel_name.replace('#', ''))
          .concat(users.map((user) => `${user.profile_real_name} (${user.user_name})`))
          .sort();

        this.form.get('searchChannels').inputs['suggestions'] = this.suggestions;

        this.displayLoader = false;
      })
      .add(() => this.cd.markForCheck());

    this.modalDataPrepared = true;
  }

  private redirectToSlackPlugin(): void {
    this.loaderManagerService.show();
    this.router.navigate(['/plugins/slack']);
  }

  private setHandlerForSuccessTaskSendMessageOperation(): void {
    this.operationsTrackerService
      .getOperationStatus(this.controlRequirement.requirement_id, TrackOperations.SEND_SLACK_TASK)
      .pipe(
        filter((x) => !(x instanceof Error)),
        this.detacher.takeUntilDetach()
      )
      .subscribe((res) => {
        this.modalWindowService.open({
          template: this.successTemlate,
          context: {
            gotItFunc: () => this.modalWindowService.close(),
          },
        });
      });
  }

  private setHandlerForErrorTaskSendMessageOperation(): void {
    this.operationsTrackerService
      .getOperationStatus(this.controlRequirement.requirement_id, TrackOperations.SEND_SLACK_TASK)
      .pipe(
        filter((x) => x instanceof Error),
        this.detacher.takeUntilDetach()
      )
      .subscribe((res) => {
        this.modalWindowService.open({
          template: this.failedTemplate,
          context: {
            // TODO: should reopen slack modal window
            tryAgainFn: () => this.modalWindowService.close(),
          },
        });
      });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  get_recepient_value(recepient: string): string {
    const channel = this.channels.find((f) => f.channel_name === `#${recepient}`);
    if (!!channel) {
      return channel.channel_name;
    }

    const profile_real_name = recepient.split(' (')[0];
    const user = this.users.find((u) => u.profile_real_name === profile_real_name);
    if (!!user) {
      return user.user_name;
    }

    return recepient;
  }

  send(): void {
    this.sendMessage = true;
    const message = this.form.get('message').value;
    const recepient = this.get_recepient_value(this.form.get('searchChannels').value);
    this.requirementFacade.sendMessageViaSlack(message, [recepient], this.controlInstance.control_id, this.currentFramework.framework_id, this.controlRequirement);
  }

  buildTranslationKey(relativeKey: string): string {
    return `slackIntegrationModal.${relativeKey}`;
  }
}
