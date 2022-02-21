import { frameworksWithGuideline } from './../../constants/control-item.constants';
import { ControlsSwitcherModalsService } from './../../services/controls-switcher-modals/controls-switcher-modals.service';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { EvidenceSourcesEnum } from 'core/models';
import {
  CALCULATION_TIME,
  HipaaFrameworkId,
  ITGCFrameworkId,
  SocTwoFrameworkId
} from 'core/constants';
import { MessageBusService } from 'core/services';
import { AnecdotesUnifiedFramework } from 'core/modules/data/constants';
import { CalculatedControl, ResourceType } from 'core/modules/data/models';
import { Framework } from 'core/modules/data/models/domain';
import { ControlsFacadeService, DataAggregationFacadeService, TrackOperations } from 'core/modules/data/services';
import { SubscriptionDetacher } from 'core/utils';
import { isAnecdotesControl } from 'core/utils/userflow';
import { Observable, Subject, combineLatest, of } from 'rxjs';
import { debounceTime, delay, filter, map, skip} from 'rxjs/operators';
import { ControlContextService, ControlsFocusingService } from '../../services';
import { TemplateTypes } from 'core/components/frameworks-icon/frameworks-icon.component';
import { GeneralEventService } from 'core/services/general-event-service/general-event.service';

@Component({
  selector: 'app-control-item',
  templateUrl: './control-item.component.html',
  styleUrls: ['./control-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlItemComponent implements OnInit, OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  private controlUpdated$: Observable<string>;
  private isInitialExpansionProceeded = false;
  private allRequirementIds = new Set<string>();

  @HostBinding('class')
  private classes = 'block relative';

  isAnecdotesControl: boolean;
  resourceTypeEnum = ResourceType;
  isControlHaveRecentlyAddedEvidence = false;
  templateTypes = TemplateTypes;
  isGapped$: Observable<boolean>;
  sources = EvidenceSourcesEnum;

  @ViewChild(MatExpansionPanel)
  private expansionPanel: MatExpansionPanel;

  @HostBinding('class.selected')
  isSelectedControl: boolean;

  @HostBinding('class.audit')
  private get isAudit(): boolean {
    return this.context.isAudit;
  }

  isRelatedCommentFocused$: Observable<boolean>;

  @Input() controlInstance: CalculatedControl;
  @Input() framework: Framework;
  @Input() expand: boolean;
  @Input() isNewlyAdded: boolean;
  @Input() auditHistoryMode = false;
  @Input() displayedRequirementsAndEvidences: { requirement_id: string; evidence_ids: string[] }[] = [];
  @Output()
  expanded = new Subject<boolean>();
  anecdotesUnifiedFrameworkId = AnecdotesUnifiedFramework.framework_id;
  socTwoFrameworkId = SocTwoFrameworkId;
  hipaaFrameworkId = HipaaFrameworkId;
  itgcFrameworkId = ITGCFrameworkId;
  isControlWithFrameworkLabels = false;
  filteredFrameworkRelatedControls: { [framework_name: string]: string[] };
  translationKeyRoot = 'controls';
  frameworksWithGuideline = frameworksWithGuideline;

  /**
   *
   * This property was done for the backward compatibility
   * We need to refactor this component to have only a control id and then this component should obtain the control by id from facade
   * It should fix all change detection issues
   */
  calculatedControl: CalculatedControl;

  get isAnecdotesFramework(): boolean {
    return this.framework.framework_id === this.anecdotesUnifiedFrameworkId;
  }

  get isSocTwoFramework(): boolean {
    return this.framework.framework_id === this.socTwoFrameworkId;
  }

  get isHipaaFramework(): boolean {
    return this.framework.framework_id === this.hipaaFrameworkId;
  }

  get isITGCFramework(): boolean {
    return this.framework.framework_id === this.itgcFrameworkId;
  }

  get initialExpansionProceeded(): boolean {
    return this.isInitialExpansionProceeded;
  }

  get viewOnly(): boolean {
    return this.framework.is_snapshot;
  }

  get isReadOnly(): boolean {
    return this.controlInstance?.is_snapshot;
  }

  constructor(
    private controlsFacade: ControlsFacadeService,
    private context: ControlContextService,
    private messageBusService: MessageBusService,
    private cd: ChangeDetectorRef,
    private controlsSwitcherModalsService: ControlsSwitcherModalsService,
    private controlsFocusing: ControlsFocusingService,
    private generalEventService: GeneralEventService,
    private aggregationService: DataAggregationFacadeService
  ) { }

  ngOnInit(): void {
    this.isControlWithFrameworkLabels = this.isHipaaFramework || this.isITGCFramework || this.isSocTwoFramework;
    this.initControlStream();

    this.isAnecdotesControl = isAnecdotesControl(this.controlInstance.control_id);
    this.controlUpdated$ = this.messageBusService.getObservable(TrackOperations.UPDATE_CUSTOM_CONTOL);
    this.controlUpdated$
      .pipe(
        debounceTime(CALCULATION_TIME),
        filter((c) => this.controlInstance.control_id === c),
        this.detacher.takeUntilDetach()
      )
      .subscribe(() => {
        this.cd.markForCheck();
      });

    this.isGapped$ = this.initIsGappedObserable();

    this.allRequirementIds = new Set(this.controlInstance.control_requirement_ids);

    this.controlsFocusing.getSpecificControlExpandingStream(this.controlInstance.control_id)
      .pipe(delay(500), this.detacher.takeUntilDetach()).subscribe(() => {
        this.expansionPanel.open();
      });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  private initIsGappedObserable(): Observable<boolean> {
    return combineLatest(this.controlInstance.control_requirement_ids?.map(
      req => this.aggregationService.getRelevantEvidence(this.controlInstance.control_framework_id, req)))
    .pipe(
      map(relevant_requirement_evidence_list =>
        relevant_requirement_evidence_list
        .some(relevant_requirement_evidence =>
          relevant_requirement_evidence.some(e => e.evidence.evidence_gap?.length && e.evidence?.evidence_is_applicable))),
    );
  }

  isFrameworkWithGuideline(frameworkName: string): boolean {
    return isFrameworkWithGuideline(frameworkName);
  }

  filterFrameworkRelatedControls(control: CalculatedControl): void {
    /**
     * Filters the related frameworks names that doesn't equal framework_name
     * When we display the related frameworks icons for framework we want to present the related framework controls only
     *  and not all the rest as we do in "My Controls"
     */
    const controlRelatedFrameworks = {};
    if (this.framework.framework_name in control.control_related_frameworks_names) {
      controlRelatedFrameworks[this.framework.framework_name] =
        control.control_related_frameworks_names[this.framework.framework_name];
    }
    this.filteredFrameworkRelatedControls = controlRelatedFrameworks;
  }

  setInitialExpansionProceeded(): void {
    if (!this.isInitialExpansionProceeded) {
      this.isInitialExpansionProceeded = true;
    }
  }

  multiSelectValueChange(value: boolean): void {
    this.isSelectedControl = value;
  }

  threeDotsMenuClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  rowTrackBy(controlInstance: CalculatedControl): string {
    return controlInstance?.control_id;
  }

  buildTranslationKey(relativeKey: string): string {
    return `${this.translationKeyRoot}.${relativeKey}`;
  }

  openGuidelineModal(): void {
    this.controlsSwitcherModalsService.openGuidelineModal(this.controlInstance, this.framework);
  }

  close(): void {
    this.expansionPanel.close();
  }
  
  private initControlStream(): void {
    let controlStream$: Observable<CalculatedControl>;
    if (this.auditHistoryMode) {
      controlStream$ = of(this.controlInstance);
    } else  {
      controlStream$ = this.controlsFacade.getSingleControl(this.controlInstance?.control_id).pipe(
        filter((control) => !!control),
        this.detacher.takeUntilDetach()
      );
    }
      controlStream$.subscribe((control) => {
        this.filterFrameworkRelatedControls(control);
        this.calculatedControl = control;
        this.cd.detectChanges();
      });
  
      controlStream$
        .pipe(skip(1), this.detacher.takeUntilDetach())
        .subscribe(
          (control) => {
            this.allRequirementIds = this.context.detectNewControlRequirements(control, this.allRequirementIds);
          }
        );
    
  }
}

export function isFrameworkWithGuideline(frameworkName: string): boolean {
  /**
   * Checks whether the given frameworkName is included in frameworksWithGuideline.
   * Basically it checks whether the given frameworkName starts with any of the keys in frameworksWithGuideline.
   */
  return Object.keys(frameworksWithGuideline).some(key => frameworkName?.startsWith(key));
}
