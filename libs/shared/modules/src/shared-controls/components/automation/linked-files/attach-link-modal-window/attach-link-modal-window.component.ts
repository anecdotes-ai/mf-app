import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TipTypeEnum } from 'core/models';
import { CollectionResult } from 'core/models/collection-result.model';
import { PusherMessageType } from 'core/models/pusher-message-type.model';
import { PusherMessage } from 'core/models/pusher-message.model';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { EvidenceInstance, Service, Framework } from 'core/modules/data/models/domain';
import {
  EvidenceFacadeService,
  EvidenceService,
  OperationError,
  PluginFacadeService,
  PluginNotificationFacadeService,
  PluginService,
} from 'core/modules/data/services';
import { TabModel } from 'core/modules/dropdown-menu';
import { CustomValidators } from 'core/modules/dynamic-form/validators/index';
import { ModalWindowService } from 'core/modules/modals';
import { PluginNotificationSenderService } from 'core/services/plugin-notification-sender/plugin-notification-sender.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, take, takeUntil, timeout } from 'rxjs/operators';
import { EvidenceCreationModalParams, RequirementLike } from '../../../../models';
import { CalculatedControl } from 'core/modules/data/models';
import { SubscriptionDetacher } from 'core/utils';
import { MessageBusService } from 'core/services/message-bus/message-bus.service';

const updateServiceRequestTimeout = 120000; // 120 seconds

const pluginsWithFolderCollection = ['gdrive', 'dropbox', 'confluence'];

export const AttachLinkModalComponentInputFields = {
  pluginData: 'pluginData',
  evidence: 'evidence',
  backButtonHandler: 'backButtonHandler',
  requirementLike: 'requirementLike',
  filterCollectionResultFn: 'filterCollectionResultFn',
  wasResourceUpdatedFn: 'wasResourceUpdatedFn',
  framework: 'framework',
  control: 'control',
  frameworkId: 'frameworkId',
  controlId: 'controlId',
};

@Component({
  selector: 'app-attach-link-modal-window',
  templateUrl: './attach-link-modal-window.component.html',
  styleUrls: ['./attach-link-modal-window.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttachLinkModalWindowComponent implements OnInit, OnDestroy, AfterViewInit {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  @ViewChild('tabContentTemplate')
  private tabContentTemplateRef: TemplateRef<any>;

  @ViewChild('evidenceCollectionFailedErrorText')
  private evidenceCollectionFailedErrorText: TemplateRef<any>;

  @ViewChild('connectionFailedErrorText', { static: true })
  private connectionFailedErrorText: TemplateRef<any>;

  @Input(AttachLinkModalComponentInputFields.pluginData)
  pluginData: Service;

  @Input(AttachLinkModalComponentInputFields.evidence)
  evidence: EvidenceInstance;

  @Input(AttachLinkModalComponentInputFields.requirementLike)
  requirementLike: RequirementLike;

  @Input(AttachLinkModalComponentInputFields.filterCollectionResultFn)
  filterCollectionResultFn: (msg: PusherMessage<CollectionResult>) => boolean;

  @Input(AttachLinkModalComponentInputFields.wasResourceUpdatedFn)
  wasResourceUpdatedFn: () => Promise<boolean>;

  @Input(AttachLinkModalComponentInputFields.framework)
  framework: Framework;

  @Input(AttachLinkModalComponentInputFields.control)
  control: CalculatedControl;

  context: EvidenceCreationModalParams;

  formControl: FormControl;
  tabModel$: Subject<TabModel[]> = new Subject();
  isLoading$ = new BehaviorSubject<boolean>(false);

  inputErrorTexts: { [key: string]: string | TemplateRef<any> };

  tipTypes = TipTypeEnum;

  get isFolderCollectionSupported(): boolean {
    return pluginsWithFolderCollection.includes(this.pluginData.service_id);
  }

  get isBackHandler(): boolean {
    return this.componentsSwitcher.previousIndex !== undefined;
  }

  constructor(
    public pluginService: PluginService,
    private modalWindowService: ModalWindowService,
    private messageBusService: MessageBusService,
    private componentsSwitcher: ComponentSwitcherDirective,
    private router: Router,
    private notificationFacade: PluginNotificationFacadeService,
    private pluginNotificationSenderService: PluginNotificationSenderService,
    private evidenceService: EvidenceService,
    private evidencesFacade: EvidenceFacadeService,
    private pluginFacadeService: PluginFacadeService
  ) { }

  ngOnInit(): void {
    this.createFormControl();
    this.componentsSwitcher.sharedContext$.pipe(this.detacher.takeUntilDetach()).subscribe((context: EvidenceCreationModalParams) => this.context = context);
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  ngAfterViewInit(): void {
    this.initTabModel();

    this.inputErrorTexts = {
      connectionFailed: this.connectionFailedErrorText,
      failedToAddLink: this.evidenceCollectionFailedErrorText,
      linkAlreadyExists: this.buildTranslationKey('errors.linkAlreadyExists'),
    };
  }

  backButtonHandler(): void {
    this.componentsSwitcher.goBack();
  }

  navigateToPlugin(specificTab?: string): void {
    if (specificTab) {
      this.router.navigate([this.pluginService.getPluginRoute(this.pluginData.service_id)], {
        queryParams: { tab: specificTab },
      });
    } else {
      this.router.navigate([this.pluginService.getPluginRoute(this.pluginData.service_id)]);
    }
  }

  connect(): void {
    this.evidence ? this.updateEvidence() : this.startEvidenceCollection();
  }

  buildTranslationKey(relativeKey: string): string {
    return `attachLinkAutomationModal.${relativeKey}`;
  }

  isFormControlValid(): boolean {
    return this.formControl.valid;
  }

  private async startEvidenceCollection(): Promise<void> {
    this.isLoading$.next(true);
    try {
      const fetchedFullService = await this.pluginFacadeService
        .getServiceById(this.pluginData.service_id, true)
        .pipe(take(1))
        .toPromise();

      await this.evidencesFacade.createSharedLinkEvidenceAsync(
        this.formControl.value,
        fetchedFullService.service_id,
        // Temporarily we take 1st instance (assuming it's a single account service) to do the operation, in the future it should be adjusted for multiple accounts
        fetchedFullService.service_instances_list[0].service_instance_id,
        this.context.targetResource,
        this.control?.control_id,
        this.framework?.framework_id,
      );

      this.modalWindowService.close();
    } catch (error) {
      this.updateNotificationWithErrorState();
      this.handleError(error);
    } finally {
      this.isLoading$.next(false);
    }
  }

  private updateNotificationWithErrorState(): void {
    const unsubscribe$ = new Subject();

    this.notificationFacade
      .getNotification(this.pluginData.service_id)
      .pipe(takeUntil(unsubscribe$))
      .subscribe(() => {
        this.pluginNotificationSenderService.sendCollectionFailedNotification({
          service_id: this.pluginData.service_id,
          service_name: this.pluginData.service_display_name,
          status: false,
        });

        unsubscribe$.next();
        unsubscribe$.complete();
      });
  }

  private handleError(error: OperationError): void {
    if (error instanceof OperationError) {
      if (error.errorCode === 404) {
        this.formControl.setErrors({ failedToAddLink: true });
        return;
      } else if (error.errorCode === 409) {
        this.formControl.setErrors({ linkAlreadyExists: true });
        return;
      }
    }

    this.formControl.setErrors({ connectionFailed: true });
  }

  private async updateEvidence(): Promise<void> {
    this.isLoading$.next(true);

    try {
      const fetchedFullService = await this.pluginFacadeService
        .getServiceById(this.pluginData.service_id, true)
        .pipe(take(1))
        .toPromise();
      await this.updateRequirementEvidence(
        fetchedFullService.service_id,
        fetchedFullService.service_instances_list[0].service_instance_id
      );
      await this.waitForCollection();
      if (await this.wasResourceUpdatedFn()) {
        this.modalWindowService.openSuccessAlert(this.buildTranslationKey('docConnectedMessage'));
      } else {
        this.formControl.setErrors({ connectionFailed: true });
        this.isLoading$.next(false);
      }
    } catch (err) {
      this.updateNotificationWithErrorState();
      this.formControl.setErrors({ connectionFailed: true });
      this.isLoading$.next(false);
      return;
    }
  }

  private async waitForCollection(): Promise<void> {
    await this.messageBusService
      .getObservable<PusherMessage<CollectionResult>>(PusherMessageType.Collection)
      .pipe(
        filter((x) => this.filterCollectionResultFn(x) && x.message_object.service_id === this.pluginData.service_id),
        timeout(updateServiceRequestTimeout),
        take(1)
      )
      .toPromise();
  }

  private updateRequirementEvidence(service_id: string, service_instance_id: string): Promise<void> {
    return this.evidenceService
      .updateEvidence(
        this.requirementLike.resourceType,
        this.requirementLike.resourceId,
        service_id,
        service_instance_id,
        this.evidence.evidence_id,
        undefined,
        this.formControl.value
      )
      .toPromise();
  }

  private createFormControl(): void {
    let formValue = null;
    if (this.evidence) {
      formValue = this.evidence.evidence_url;
    }
    this.formControl = new FormControl(formValue, [Validators.required, CustomValidators.strictUrl]);
  }

  private async initTabModel(): Promise<void> {
    this.tabModel$.next([
      {
        tabTemplate: this.tabContentTemplateRef,
        translationKey: this.pluginData.service_display_name,
        icon: await this.pluginService.getServiceIconLink(this.pluginData.service_id).pipe(take(1)).toPromise(),
      },
    ]);
  }
}
