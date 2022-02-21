import {
  ZendeskGroupMetadata,
  ZendeskSystemFieldOption,
  ZendeskTicketFieldMetadata,
  ZendeskMetadata,
  ControlRequirement,
  EvidenceTypeEnum,
  Service,
  Framework
} from 'core/modules/data/models/domain';
import { CollectingEvidence, CalculatedControl } from 'core/modules/data/models';
import { Component, Input, OnInit, TemplateRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Validators } from '@angular/forms';
import { DropdownControl } from 'core/models';
import { MessageBusService, AppConfigService, EvidenceCollectionMessages } from 'core/services';
import { TabModel } from 'core/modules/dropdown-menu';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { ModalWindowService } from 'core/modules/modals';
import { EvidenceFacadeService, PluginFacadeService, PluginService, PluginsMetaFacadeService } from 'core/modules/data/services';
import { SubscriptionDetacher } from 'core/utils';
import { DynamicFormGroup } from 'core/modules/dynamic-form';
import { Subject } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import {
  baseModalConfigData,
  buildTranslationKeyByTicketingRoot,
  TicketingModalsCommonTranslationRootKey,
} from './../constants/constants';

export const ZendeskAutomationModalWindowComponentInputFields = {
  pluginData: 'pluginData',
  controlRequirement: 'controlRequirement',
  controlInstance: 'controlInstance',
  framework: 'framework'
};

export const noValueTicketField: ZendeskSystemFieldOption = { name: 'No Values', value: null };

@Component({
  selector: 'app-zendesk-automation-modal-window',
  templateUrl: './zendesk-automation-modal-window.component.html',
  styleUrls: ['./zendesk-automation-modal-window.component.scss'],
})
export class ZendeskAutomationModalWindowComponent implements OnInit {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  @ViewChild('tabContentTemplate', { static: true })
  private tabContentTemplateRef: TemplateRef<any>;

  @Input(ZendeskAutomationModalWindowComponentInputFields.pluginData)
  pluginData: Service;

  @Input(ZendeskAutomationModalWindowComponentInputFields.controlRequirement)
  controlRequirement: ControlRequirement;

  @Input(ZendeskAutomationModalWindowComponentInputFields.controlInstance)
  controlInstance: CalculatedControl;

  @Input()
  framework: Framework;

  intercomLink: string;

  get isValid(): boolean {
    return this.form.valid;
  }

  baseModalConfigData = baseModalConfigData;

  form: DynamicFormGroup<{
    group: DropdownControl;
    ticketTypeField: DropdownControl;
    ticketType: DropdownControl;
  }>;

  tabModel$: Subject<TabModel[]> = new Subject();
  connectionProcess$: Subject<boolean> = new Subject();

  buildTranslationKeyByTicketingRoot = buildTranslationKeyByTicketingRoot;

  constructor(
    private pluginService: PluginService,
    private messageBusService: MessageBusService,
    private componentsSwitcher: ComponentSwitcherDirective,
    private pluginsMetaFacade: PluginsMetaFacadeService,
    private modalWindowService: ModalWindowService,
    private cd: ChangeDetectorRef,
    private appConfig: AppConfigService,
    private evidencesFacade: EvidenceFacadeService,
    private pluginFacadeService: PluginFacadeService
  ) { }

  ngOnInit(): void {
    this.intercomLink = this.appConfig.config.redirectUrls.intercomZendeskCustomizationHelp;
    this.createForm();

    this.pluginFacadeService.getServiceById(this.pluginData.service_id, true)
      .pipe(take(1), switchMap((res) => this.pluginsMetaFacade
        .getServiceMetadata(res.service_id, res.service_instances_list[0].service_instance_id)),
        this.detacher.takeUntilDetach())
      .subscribe((meta: ZendeskMetadata) => {
        this.form.items.group.inputs.data = meta.groups;

        this.form.items.ticketTypeField.inputs.data = meta.ticket_fields;
        this.cd.detectChanges();
        this.setupDependencies();
      });
  }

  ngAfterViewInit(): void {
    this.initTabModel();
  }

  buildTranslationKey(relativeKey: string): string {
    return `${TicketingModalsCommonTranslationRootKey}.zendeskAutomationModal.${relativeKey}`;
  }

  createForm(): void {
    this.form = new DynamicFormGroup({
      group: new DropdownControl({
        initialInputs: {
          data: [],
          searchEnabled: true,
          displayValueSelector: (group: ZendeskGroupMetadata) => group.name,
          searchFieldPlaceholder: buildTranslationKeyByTicketingRoot('search'),
          placeholderTranslationKey: this.buildTranslationKey('selectGroup'),
        },
        validators: [Validators.required],
      }),
      ticketTypeField: new DropdownControl({
        initialInputs: {
          data: [],
          displayValueSelector: (ticketTypeField: ZendeskTicketFieldMetadata) => ticketTypeField.title,
          searchEnabled: true,
          searchFieldPlaceholder: buildTranslationKeyByTicketingRoot('search'),
          placeholderTranslationKey: this.buildTranslationKey('selectTicketTypeField'),
        },
        validators: [Validators.required],
      }),
      ticketType: new DropdownControl({
        initialInputs: {
          isDisabled: true,
          data: [],
          displayValueSelector: (ticketType: ZendeskSystemFieldOption) => ticketType.name,
          searchEnabled: true,
          searchFieldPlaceholder: buildTranslationKeyByTicketingRoot('search'),
          placeholderTranslationKey: this.buildTranslationKey('selectTicketType'),
        },
        validators: [Validators.required],
      }),
    });
  }

  backButtonHandler(): void {
    this.componentsSwitcher.goBack();
  }

  async createEvidence(): Promise<void> {
    this.connectionProcess$.next(true);
    const tickets: any[] = [
      (this.form.items.group.value as ZendeskGroupMetadata).id,
      (this.form.items.ticketTypeField.value as ZendeskTicketFieldMetadata).id,
    ];

    if (this.form.items.ticketType.value !== noValueTicketField) {
      const ticketTypeName = (this.form.items.ticketType.value as ZendeskSystemFieldOption).name;
      tickets.push(ticketTypeName);
    }

    try {
      const fetchedFullService = await this.pluginFacadeService.getServiceById(this.pluginData.service_id, true).pipe(take(1)).toPromise();

      const evidenceIds = await this.evidencesFacade.addEvidenceFromTicketAsync(
        this.controlRequirement.requirement_id,
        fetchedFullService.service_id,
        // Temporarily we take 1st instance (assuming it's a single account service) to do the operation, in the future it should be adjusted for multiple accounts
        fetchedFullService.service_instances_list[0].service_instance_id,
        tickets,
        this.framework.framework_id,
        this.controlInstance.control_id
      );

      const collectingEvidences = evidenceIds.map((evidenceId) => ({
        evidenceId,
        serviceId: fetchedFullService.service_id,
        evidenceType: EvidenceTypeEnum.TICKET,
        serviceDisplayName: fetchedFullService.service_display_name,
        tickets,
      }));

      this.messageBusService.sendMessage<CollectingEvidence[]>(
        EvidenceCollectionMessages.COLLECTION_STARTED,
        collectingEvidences,
        this.controlRequirement.requirement_id
      );
      this.modalWindowService.close();
    } finally {
      this.connectionProcess$.next(false);
    }
  }

  private setupDependencies(): void {
    this.form.items.group.valueChanges.subscribe((selectedGroup: ZendeskGroupMetadata) => {
      if (this.form.items.ticketTypeField.value && selectedGroup && this.form.items.ticketType.inputs.isDisabled) {
        this.form.items.ticketType.inputs.isDisabled = false;
        this.cd.detectChanges();
      }
    });

    this.form.items.ticketTypeField.valueChanges.subscribe((selectedTicketTypeField: ZendeskTicketFieldMetadata) => {
      if (!selectedTicketTypeField) {
        return;
      }

      if (
        selectedTicketTypeField.custom_field_options?.length ||
        selectedTicketTypeField.system_field_options?.length
      ) {
        this.form.items.ticketType.setValue(null);
        this.form.items.ticketType.inputs.data =
          selectedTicketTypeField.custom_field_options || selectedTicketTypeField.system_field_options;
      } else {
        this.form.items.ticketType.inputs.data = null;
        this.form.items.ticketType.setValue(noValueTicketField);
      }

      if (this.form.items.group.value && selectedTicketTypeField && this.form.items.ticketType.inputs.isDisabled) {
        this.form.items.ticketType.inputs.isDisabled = false;
        this.cd.detectChanges();
      }
    });
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
