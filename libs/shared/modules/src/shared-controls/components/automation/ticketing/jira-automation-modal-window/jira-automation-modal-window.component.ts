import { ChangeDetectorRef, Component, Input, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import {
  DropdownControl,
} from 'core/models';
import {
  AppConfigService,
  MessageBusService,
  WindowHelperService,
  EvidenceCollectionMessages
} from 'core/services';
import { TabModel } from 'core/modules/dropdown-menu';
import { ModalWindowService } from 'core/modules/modals';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { CalculatedControl, CollectingEvidence } from 'core/modules/data/models';
import { ControlRequirement, EvidenceTypeEnum, Service, Framework } from 'core/modules/data/models/domain';
import {
  EvidenceFacadeService,
  PluginFacadeService,
  PluginService,
  PluginsMetaFacadeService
} from 'core/modules/data/services';
import { SubscriptionDetacher } from 'core/utils';
import { DynamicFormGroup } from 'core/modules/dynamic-form';
import { BehaviorSubject, Subject } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import {
  baseModalConfigData,
  buildTranslationKeyByTicketingRoot,
  TicketingModalsCommonTranslationRootKey
} from '../constants/constants';

export const JiraAutomationModalWindowComponentInputFields = {
  pluginData: 'pluginData',
  controlRequirement: 'controlRequirement',
  controlInstance: 'controlInstance',
  framework: 'framework'
};

interface IssueType {
  anecdotes_id: string;
  description: string;
  id: string;
  name: string;
}

interface Project {
  anecdotes_id: string;
  id: string;
  key: string;
  name: string;
  issue_types: IssueType[];
}

@Component({
  selector: 'app-jira-automation-modal-window',
  templateUrl: './jira-automation-modal-window.component.html',
  styleUrls: ['./jira-automation-modal-window.component.scss'],
})
export class JiraAutomationModalWindowComponent implements OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  @ViewChild('tabContentTemplate')
  private tabContentTemplateRef: TemplateRef<any>;

  @Input(JiraAutomationModalWindowComponentInputFields.pluginData)
  pluginData: Service;

  @Input(JiraAutomationModalWindowComponentInputFields.controlRequirement)
  controlRequirement: ControlRequirement;

  @Input(JiraAutomationModalWindowComponentInputFields.controlInstance)
  controlInstance: CalculatedControl;

  @Input(JiraAutomationModalWindowComponentInputFields.framework)
  framework: Framework;

  get isValid(): boolean {
    return this.form.valid;
  }

  baseModalConfigData = baseModalConfigData;

  buildTranslationKeyByTicketingRoot = buildTranslationKeyByTicketingRoot;

  form = new DynamicFormGroup({
    project: new DropdownControl({
      initialInputs: {
        data: [],
        searchEnabled: true,
        displayValueSelector: (project: Project) => project.name,
        searchFieldPlaceholder: buildTranslationKeyByTicketingRoot('search'),
        placeholderTranslationKey: this.buildTranslationKey('selectProject'),
      },
      validators: [Validators.required],
    }),
    issueType: new DropdownControl({
      initialInputs: {
        isDisabled: true,
        data: [],
        displayValueSelector: (issue: IssueType) => issue.name,
        searchEnabled: true,
        searchFieldPlaceholder: buildTranslationKeyByTicketingRoot('search'),
        placeholderTranslationKey: this.buildTranslationKey('issueType'),
      },
      validators: [Validators.required],
    }),
  });

  tabModel$: Subject<TabModel[]> = new Subject();
  isLoading$ = new BehaviorSubject<boolean>(false);

  constructor(
    private windowHelperService: WindowHelperService,
    private pluginService: PluginService,
    private messageBusService: MessageBusService,
    private componentsSwitcher: ComponentSwitcherDirective,
    private pluginsMetaFacade: PluginsMetaFacadeService,
    private modalWindowService: ModalWindowService,
    private appConfig: AppConfigService,
    private cd: ChangeDetectorRef,
    private evidencesFacade: EvidenceFacadeService,
    private pluginFacadeService: PluginFacadeService
  ) { }

  ngOnInit(): void {
    this.pluginFacadeService.getServiceById(this.pluginData.service_id, true)
      .pipe(take(1), switchMap((res) => this.pluginsMetaFacade
        .getServiceMetadata(res.service_id, res.service_instances_list[0].service_instance_id)),
        this.detacher.takeUntilDetach())
      .subscribe((meta) => {
        this.form.items.project.inputs.data = meta?.projects;
        this.setupDependencies();
      });
  }

  ngAfterViewInit(): void {
    this.initTabModel();
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  buildTranslationKey(relativeKey: string): string {
    return `${TicketingModalsCommonTranslationRootKey}.jiraAutomationModal.${relativeKey}`;
  }

  openArticle(): void {
    this.windowHelperService.openUrlInNewTab(this.appConfig.config.redirectUrls.intercomJiraCustomizationHelp);
  }

  backButtonHandler(): void {
    this.componentsSwitcher.goBack();
  }

  async createEvidence(): Promise<void> {
    this.isLoading$.next(true);

    const tickets = [this.form.items.project.value.anecdotes_id, this.form.items.issueType.value.anecdotes_id];
    const fetchedFullService = await this.pluginFacadeService.getServiceById(this.pluginData.service_id, true).pipe(take(1)).toPromise();

    try {
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
      }));

      this.messageBusService.sendMessage<CollectingEvidence[]>(
        EvidenceCollectionMessages.COLLECTION_STARTED,
        collectingEvidences,
        this.controlRequirement.requirement_id
      );

      this.modalWindowService.close();
    } finally {
      this.isLoading$.next(false);
    }
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

  private setupDependencies(): void {
    this.form.items.project.valueChanges.pipe(this.detacher.takeUntilDetach()).subscribe((selectedProject: Project) => {
      this.form.items.issueType.reset();
      this.form.items.issueType.inputs.data = selectedProject.issue_types;
      this.form.items.issueType.inputs.isDisabled = false;
      this.cd.detectChanges();
    });
  }
}
