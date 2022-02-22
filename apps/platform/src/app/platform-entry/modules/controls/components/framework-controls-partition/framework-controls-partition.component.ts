import { TranslateService } from '@ngx-translate/core';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { DataFilterManagerService, FilterDefinition } from 'core/modules/data-manipulation/data-filter';
import { DataSearchComponent, SearchInstancesManagerService } from 'core/modules/data-manipulation/search';
import { CalculatedControl, CalculatedRequirement, EvidenceLike, ResourceType } from 'core/modules/data/models';
import { EvidenceStatusEnum, ControlStatusEnum, Framework } from 'core/modules/data/models/domain';
import { ControlsFacadeService, SnapshotsFacadeService } from 'core/modules/data/services';
import { ControlContextService } from 'core/modules/shared-controls/services';
import { SubscriptionDetacher } from 'core/utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, shareReplay, take, withLatestFrom } from 'rxjs/operators';
import { ControlFilterObject } from '../../models';
import {
  ApplicabilityOptionId,
  ManuallyUploadedEvidence,
  MarkedEvidenceOptionId,
  NewEvidenceOptionId,
} from '../constants';
import { ControlsRendererComponent } from '../controls-renderer/controls-renderer.component';
import { CommentPanelManagerService, CommentingResourceModel } from 'core/modules/commenting';
import { AuthService, UserFacadeService } from 'core/modules/auth-core/services';
import { RoleEnum, User } from 'core/modules/auth-core/models/domain';
import { ControlsForFilteringProvider } from '../../services';
import { OwnerFilterService } from 'core/services';

@Component({
  selector: 'app-framework-controls-partition',
  templateUrl: './framework-controls-partition.component.html',
  styleUrls: ['./framework-controls-partition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FrameworkControlsPartitionComponent implements OnInit, AfterViewInit, OnDestroy {
  // ** PRIVATES **
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  private initPromise: Promise<void>;

  private filterStream$: Observable<CalculatedControl[]>;

  private currentSearchScopeKey: string;
  private dataSearch: DataSearchComponent;
  private controls$: Observable<CalculatedControl[]>;

  private get allPluginsOption(): string {
    return this.translateService.instant('controls.plugins.allPlugins');
  }

  // ** HOST BINDINGS **
  @HostBinding('id')
  private get id(): string {
    return this.framework.framework_name;
  }

  // ** INPUTS/ Outputs **
  @Input()
  framework: Framework;

  @Output()
  controlsLoaded = new EventEmitter();

  @ViewChild(ControlsRendererComponent)
  controlsRender: ControlsRendererComponent;

  // ** PUBLICS **
  isNotFoundState$ = new BehaviorSubject(false);
  displayedData: CalculatedControl[];
  displayedRequirementsAndEvidences: { [controlId: string]: { requirement_id: string; evidence_ids: string[] }[] };
  shouldDisplayAnimation = false;

  currentUserName: string;
  users: User[] = [];
  get isOnSearchState(): boolean {
    return !!this.dataSearch.inputtedText;
  }

  get isFrameworkSnapshot(): boolean {
    return this.framework?.is_snapshot;
  }

  constructor(
    private cd: ChangeDetectorRef,
    private filterManager: DataFilterManagerService,
    private searchInstancesManagerService: SearchInstancesManagerService,
    private elementRef: ElementRef<HTMLElement>,
    private controlsFacade: ControlsFacadeService,
    private controlsForFilteringProvider: ControlsForFilteringProvider,
    private controlContextService: ControlContextService,
    private commentingPanelManager: CommentPanelManagerService,
    private translateService: TranslateService,
    private authService: AuthService,
    private userFacade: UserFacadeService,
    private snapshotsFacadeService: SnapshotsFacadeService,
    private ownerFilterService: OwnerFilterService,
  ) {}

  // **** INIT ****

  ngOnInit(): void {
    // Should be replaced with new mechanism for scrolling to items in effect
    // NOTE: this code won't work when we implement comments for requirements and evidence
    this.currentSearchScopeKey = this.searchInstancesManagerService.getSearchScopeKey(this.elementRef.nativeElement);
    this.filterStream$ = this.filterManager.getDataFilterEvent<CalculatedControl>();
    let action: Observable<CalculatedControl[]>;

    if (this.isFrameworkSnapshot) {
      action = this.snapshotsFacadeService.getControlsSnapshot(this.framework.related_controls_snapshots);
    } else if (this.framework.freeze) {
      action = this.controlsFacade.getFreezeControlsByFrameworkId(this.framework.framework_id);
    } else {
      action = this.controlsFacade.getControlsByFrameworkId(this.framework.framework_id);
    }

    this.controls$ = action.pipe(
      filter((controls) => !!controls),
      shareReplay()
    );

    this.initPromise = this.initAsync();
    if (this.isFrameworkSnapshot) {
      this.focusAsync();
    }
    this.cd.detectChanges();
  }

  ngAfterViewInit(): void {
    this.isNotFoundState$
      .pipe(
        filter((isNotFound) => isNotFound),
        take(1),
        this.detacher.takeUntilDetach()
      )
      .subscribe(() => {
        this.controlsLoaded.emit();
      });
  }

  private async initAsync(): Promise<void> {
    this.dataSearch = await this.searchInstancesManagerService
      .getDataSearch(this.currentSearchScopeKey)
      .pipe(
        filter((x) => !!x),
        take(1)
      )
      .toPromise();
    this.shouldDisplayAnimation = true;
    await this.controls$.pipe(take(1)).toPromise();
    this.shouldDisplayAnimation = false;
    this.users = await this.userFacade.getUsers().pipe(take(1)).toPromise();
    const currentUser = await this.authService.getUserAsync();
    this.currentUserName = `${currentUser?.first_name} ${currentUser?.last_name}`;
    this.cd.detectChanges();
  }

  // **** FOCUS - FRAMEWORK ****

  async focusAsync(): Promise<void> {
    await this.initPromise.then();
    this.handleData();
    this.dataSearch.search.pipe(this.detacher.takeUntilDetach()).subscribe((data) => this.filterData(data));
    this.handleFiltering();

    this.cd.detectChanges();
  }

  // **** SUBSCRIPTION HANDLERS ****

  private handleData(): void {
    const action = this.isFrameworkSnapshot ? this.controlsForFilteringProvider.getControlsForFilteringAudit(this.controls$, this.framework) :
      this.controlsForFilteringProvider.getControlsForFiltering(this.framework.framework_id, this.framework.freeze);
    action.pipe(this.detacher.takeUntilDetach())
      .subscribe((controls) => {
        this.filterManager.setData(controls);
      });
  }

  private handleFiltering(): void {
    this.filterStream$.pipe(this.detacher.takeUntilDetach()).subscribe((filteredData) => {
      this.dataSearch.data = filteredData;
    });
    this.controls$.pipe(take(1), this.detacher.takeUntilDetach()).subscribe(() => this.loadFilteringDefinition());

    this.filterManager
      .getDataFilterEvent()
      .pipe(withLatestFrom(this.commentingPanelManager.isOpen()), take(1))
      .subscribe(([_, isCommentingOpen]) => {
        if (!isCommentingOpen) {
          this.filterManager.open();
        }
      });
  }

  // **** FILTERING ****
  resetControlsFilters(): void {
    this.dataSearch.reset();
  }

  private filterData(controls: CalculatedControl[]): void {
    this.isNotFoundState$.next(!controls.length);
    this.setDataToDisplay(controls);
  }

  private loadFilteringDefinition(): void {
    const filterDefinition: FilterDefinition<ControlFilterObject>[] = [
      {
        translationKey: 'controls.status.tab',
        fieldId: 'status',
        propertySelector: (c) => c.control_status.status,
        ignoreForCounting: true,
        hideInZeroCount: true,
        displayed: true,
        expanded: true,
        options: [
          {
            value: ControlStatusEnum.NOTSTARTED,
            icon: 'controls-filter/status/not_started',
            translationKey: 'controls.status.notStarted',
          },
          {
            value: ControlStatusEnum.INPROGRESS,
            icon: 'controls-filter/status/in_progress',
            translationKey: 'controls.status.inProgress',
          },
          {
            value: ControlStatusEnum.READY_FOR_AUDIT,
            icon: 'controls-filter/status/ready_for_audit',
            translationKey: 'controls.status.readyForAudit',
          },
          {
            value: ControlStatusEnum.GAP,
            icon: 'controls-filter/status/gap',
            translationKey: 'controls.status.gap',
          },
          {
            value: ControlStatusEnum.ISSUE,
            icon: 'controls-filter/status/issue',
            translationKey: 'controls.status.issue',
          },
          {
            value: ControlStatusEnum.APPROVED_BY_AUDITOR,
            icon: 'controls-filter/status/approved_by_auditor',
            translationKey: 'controls.status.approved',
          },
          {
            value: ControlStatusEnum.MONITORING,
            icon: 'controls-filter/status/monitoring',
            translationKey: 'controls.status.monitoring',
          },
        ],
      },
      this.ownerFilterService.getOwnerFilterDefinition(this.users, this.currentUserName, 'control_owner', 'controls.owner.tab'),
      {
        translationKey: 'controls.plugins.tab',
        propertySelector: (c) => [this.allPluginsOption, ...(c.relevant_automating_service_display_names || [])],
        fieldId: 'plugins',
        useSort: true,
        nestedFiltering: true,
        customSortCallback: (a: string, b: string) => {
          if (a == ManuallyUploadedEvidence) {
            return 1;
          }
          return a.localeCompare(b);
        },
        nestedOptions: {
          propertyName: 'control_calculated_requirements',
          filterCriteria: (req: CalculatedRequirement, optionValue: string) =>
            optionValue === this.allPluginsOption
              ? req.requirement_related_evidences.some((e) => e.service_display_name !== ManuallyUploadedEvidence)
              : req.requirement_related_evidences.some((e) => e.service_display_name === optionValue),
          nestedOptions: {
            propertyName: 'requirement_related_evidences',
            filterCriteria: (evidence: EvidenceLike, optionValue: string) =>
              optionValue === this.allPluginsOption
                ? evidence.service_display_name !== ManuallyUploadedEvidence
                : evidence.service_display_name === optionValue,
          },
        },
        optionsCounterPropertySelector: (service_display_name: string) => {
          return [
            {
              nextEntities: (controls: CalculatedControl[]) => {
                let uniqueRequirementsDictionary = controls
                  .map((x) => x.control_calculated_requirements)
                  .reduce(
                    (result, requirements) => [
                      ...result,
                      ...requirements.filter((req) => req.requirement_applicability),
                    ],
                    []
                  )
                  .reduce(
                    (result, requirement) => ({ ...result, [requirement.requirement_id]: requirement }),
                    {} as { [key: string]: CalculatedRequirement }
                  );

                const uniqueEvidenceDictionary = (Object.values(
                  uniqueRequirementsDictionary
                ) as CalculatedRequirement[])
                  .reduce(
                    (result, requirement) => [
                      ...result,
                      ...requirement.requirement_related_evidences.filter(
                        (ev) => ev.is_applicable && ev.service_id !== ManuallyUploadedEvidence
                      ),
                    ],
                    []
                  )
                  .reduce(
                    (result, evidence: EvidenceLike) => ({ ...result, [evidence.id]: evidence }),
                    {} as { [key: string]: EvidenceLike }
                  );

                return Object.values(uniqueEvidenceDictionary);
              },
              filterCurrentEntityBy: (res: CalculatedControl) =>
                service_display_name === this.allPluginsOption
                  ? res.automating_services_display_name.some((name) => name !== ManuallyUploadedEvidence)
                  : res.automating_services_display_name.includes(service_display_name),
            },
            {
              filterCurrentEntityBy: (e: EvidenceLike) =>
                service_display_name === this.allPluginsOption
                  ? e.service_display_name !== ManuallyUploadedEvidence
                  : e.service_display_name === service_display_name,
            },
          ];
        },
      },
      {
        translationKey: 'controls.evidence.tab',
        fieldId: 'evidence',
        propertySelector: (c) => c.control_has_automated_evidence_collected || c.control_any_marked_evidence,
        useSort: true,
        nestedFiltering: true,
        nestedOptions: {
          propertyName: 'control_calculated_requirements',
          filterCriteria: (req: CalculatedRequirement, optionValue: EvidenceStatusEnum) =>
            req.requirement_related_evidences.some((e) => e.status === optionValue),
          nestedOptions: {
            propertyName: 'requirement_related_evidences',
            propertySelector: (evidence: EvidenceLike) => evidence.status,
          },
        },
        options: [
          {
            translationKey: 'controls.evidence.new',
            icon: 'new',
            optionId: NewEvidenceOptionId,
            customPropertySelector: (c) => c.control_any_new_evidence,
            counterPropertySelector: [
              {
                nextEntities: (c: CalculatedControl[]) => {
                  const requirements: CalculatedRequirement[] = [];
                  c.forEach((control) => {
                    requirements.push(...control.control_calculated_requirements);
                  });

                  const evidence: EvidenceLike[] = [];

                  requirements.forEach((req) => {
                    evidence.push(...req.requirement_related_evidences);
                  });

                  return evidence;
                },
                filterCurrentEntityBy: (res: CalculatedControl) => res.control_any_new_evidence,
              },
              {
                filterCurrentEntityBy: (e: EvidenceLike) => e.status === EvidenceStatusEnum.NEW,
              },
            ],
            value: true,
            exactValue: EvidenceStatusEnum.NEW,
          },
          {
            translationKey: 'controls.evidence.marked',
            icon: 'marked',
            optionId: MarkedEvidenceOptionId,
            customPropertySelector: (c) => c.control_any_marked_evidence,
            counterPropertySelector: [
              {
                nextEntities: (c: CalculatedControl[]) => {
                  const requirements: CalculatedRequirement[] = [];
                  c.forEach((control) => {
                    requirements.push(...control.control_calculated_requirements);
                  });

                  const evidence: EvidenceLike[] = [];

                  requirements.forEach((req) => {
                    evidence.push(...req.requirement_related_evidences);
                  });

                  return evidence;
                },
                filterCurrentEntityBy: (res: CalculatedControl) => res.control_any_marked_evidence,
              },
              {
                filterCurrentEntityBy: (e: EvidenceLike) => e.status === EvidenceStatusEnum.NOTMITIGATED,
              },
            ],
            value: true,
            exactValue: EvidenceStatusEnum.NOTMITIGATED,
          },
        ],
      },
      {
        translationKey: 'controls.categories.tab',
        fieldId: 'categories',
        propertySelector: (c) => c.control_category,
        displayed: false,
        singleSelection: true,
        ignoreForReset: true,
      },
      {
        translationKey: 'controls.applicability.tab',
        fieldId: 'includeNotApplicable',
        propertySelector: (c) => c.control_is_applicable,
        isSwitcher: true,
        shouldAffectCounting: true,
        options: [
          {
            translationKey: 'controls.applicability.notApplicable',
            optionId: ApplicabilityOptionId,
            icon: 'not-applicable',
            customPropertySelector: (c) => c.control_is_applicable === false,
            counterPropertySelector: (c) => !c.control_is_applicable,
            value: true,
            exactValue: 'NOT APPL',
          },
          {
            translationKey: 'appl',
            optionId: 'no',
            displayed: false,
            checkedByDefault: true,
            notTrackedInQueryParams: true,
            customPropertySelector: (c) => !c.control_is_applicable,
            value: false,
            icon: 'hide_n-a',
            exactValue: 'APPL',
          },
        ],
      },
    ];

    this.filterManager.setFilterDefinition(filterDefinition);
  }

  private setDataToDisplay(controls: CalculatedControl[]): void {
    this.displayedData = controls;
    this.displayedRequirementsAndEvidences = {};
    controls.forEach((control) => {
      this.displayedRequirementsAndEvidences[control.control_id] = control.control_calculated_requirements.map(
        (req) => ({
          requirement_id: req.requirement_id,
          evidence_ids: req.requirement_related_evidences.map((e) => e.id),
        })
      );
    });
    if (!this.isFrameworkSnapshot) {
      this.setCommentingResourcesAsync(controls);
    }
  }

  private async setCommentingResourcesAsync(controls: CalculatedControl[]): Promise<void> {
    const resources = controls.reduce(
      (result, control) => [
        ...result,
        {
          resourceType: ResourceType.Control,
          resourceId: control.control_id,
          resourceTypeDisplayName: 'commenting.resourceNames.control',
          resourceDisplayName: control.control_name,
          extraParams: {
            frameworkName: this.framework.framework_name,
            path: [this.framework.framework_name, control.control_name],
          },
          logData: { 'control name': control.control_name },
        } as CommentingResourceModel,
        // TODO: Should be uncomented when we implement comments for requirements
        // ...control.control_calculated_requirements.map((req) => ({
        //   resourceType: ResourceType.Requirement,
        //   resourceId: req.requirement_id,
        //   resourceTypeDisplayName: 'commenting.resourceNames.requirement',
        //   resourceDisplayName: req.requirement_name
        // }))
      ],
      []
    ) as CommentingResourceModel[];
    const availableUsers = await this.getAvailableUsersAsync();
    this.commentingPanelManager.init(resources, availableUsers, { 'framework name': this.framework.framework_name });
  }

  private async getAvailableUsersAsync(): Promise<User[]> {
    const users = await this.userFacade.getUsers().pipe(take(1)).toPromise();
    const rolesSet = new Set([RoleEnum.Admin, RoleEnum.Collaborator, RoleEnum.Auditor]);
    const filteredUsers = users
      .filter((u) => rolesSet.has(u.role))
      .filter((u) => {
        if (u.role === RoleEnum.Auditor) {
          return u.audit_frameworks.includes(this.framework.framework_id);
        }

        return true;
      });

    return filteredUsers;
  }

  // **** DESTROY ****

  ngOnDestroy(): void {
    this.controlContextService.clearAllNewEntities();
    this.detacher.detach();
    this.filterManager.close(true);
    this.commentingPanelManager.destroy();
  }
}
