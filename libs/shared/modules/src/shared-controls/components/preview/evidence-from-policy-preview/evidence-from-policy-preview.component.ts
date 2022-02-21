import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  HostListener,
  AfterViewInit,
} from '@angular/core';
import { EvidenceSourcesEnum } from 'core/modules/shared-controls/models';
import { CalculatedControl, EvidenceLike, CalculatedPolicy } from 'core/modules/data/models';
import { ControlRequirement, Framework } from 'core/modules/data/models/domain';
import { map, take } from 'rxjs/operators';
import { EvidenceService, DataAggregationFacadeService, PoliciesFacadeService } from 'core/modules/data/services';
import { TipTypeEnum } from 'core/models';
import { FileDownloadingHelperService } from 'core/services';
import { FileTypeHandlerService } from 'core/modules/file-viewer/services';
import { SubscriptionDetacher } from 'core/utils';
import { EvidenceUserEventService } from 'core/modules/data/services/event-tracking/evidence-user-event.service';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { EvidenceFromPolicyModalsContext } from '../../../services/evidence-from-policy-preview/evidence-from-policy-preview.service';
import { DateViewTypeEnum } from 'core/modules/shared-controls/constants/dateViewType';
import { RegularDateFormatMMMdyyyy } from 'core/constants/date';

@Component({
  selector: 'app-evidence-from-policy-preview',
  templateUrl: './evidence-from-policy-preview.component.html',
  styleUrls: ['./evidence-from-policy-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvidenceFromPolicyPreviewComponent implements OnInit, AfterViewInit, OnDestroy {
  // **** Private properties ****

  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  // **** Constants  ****

  evidenceSources = EvidenceSourcesEnum;
  eventSource: EvidenceSourcesEnum;
  tipTypes = TipTypeEnum;
  dateViewTypes = DateViewTypeEnum;
  dateFormat = RegularDateFormatMMMdyyyy;
  translateKey = 'evidencePreview.policyType';

  // **** ViewChilds  ****

  @ViewChild('tipRef', { read: ElementRef }) tipElRef: ElementRef<HTMLElement>;

  // **** HostBindings  ****

  @HostBinding('class.have-tip')
  get checkTipExisting(): boolean {
    return !this.checkTipHidden() && !!this.tipElRef;
  }

  // **** Public properties ****

  evidenceLike: EvidenceLike;
  framework: Framework;
  controlInstance: CalculatedControl;
  policy: CalculatedPolicy;
  controlRequirement: ControlRequirement;
  isLoaded: boolean;
  showTabular: boolean;
  notSupportedPreview: boolean;
  file: File;

  // **** Getters ****

  get hasSchedules(): boolean {
    return !!this.policy?.policy_settings?.scheduling.approval_frequency;
  }

  get hasPreview(): boolean {
    return this.policy.has_roles || this.hasSchedules;
  }

  get evidenceComply(): boolean {
    return this.evidenceLike.evidence.evidence_gap === null;
  }

  // **** HostListeners ****

  @HostListener('click')
  checkTipHidden(): boolean {
    return !!this.tipElRef?.nativeElement.classList.contains('hidden');
  }

  constructor(
    private evidenceService: EvidenceService,
    private fileDownloadingHelper: FileDownloadingHelperService,
    private cd: ChangeDetectorRef,
    private fileTypeHandler: FileTypeHandlerService,
    private evidenceEventService: EvidenceUserEventService,
    private dataAggregationService: DataAggregationFacadeService,
    private switcher: ComponentSwitcherDirective,
    private policiesFacade: PoliciesFacadeService
  ) {}

  // **** Lifecycle hooks ****

  ngOnInit(): void {
    this.switcher.sharedContext$
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((payload: EvidenceFromPolicyModalsContext) => {
        this.eventSource = payload.eventSource;
        this.evidenceLike = payload.evidenceLike;
        this.controlInstance = payload.controlInstance;
        this.controlRequirement = payload.controlRequirement;
        this.framework = payload.framework;
      });

    this.evidenceService
      .downloadEvidence(this.evidenceLike.evidence.evidence_instance_id)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((file) => {
        this.file = new File([file], this.evidenceLike.evidence.evidence_name);
        this.setFileType();
        this.isLoaded = true;
        this.cd.detectChanges();
      });

    this.policiesFacade
      .getPolicy(this.evidenceLike.id)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((policy) => {
        this.policy = policy;
        this.showTabular = true;
        this.cd.detectChanges();
      });
  }

  ngAfterViewInit(): void {
    this.checkTipHidden();
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  // **** Translation key built ****

  buildTranslationKey(relativeKey: string): string {
    return `${this.translateKey}.${relativeKey}`;
  }

  // **** DOM Interaction Methods ****

  async downloadEvidence(): Promise<void> {
    this.fileDownloadingHelper.downloadFile(this.file, this.evidenceLike.evidence.evidence_name);
    const frameworks = await this.dataAggregationService
      .getEvidenceReferences(this.evidenceLike.evidence.evidence_id)
      .pipe(
        map((references) => references.map((reference) => reference.framework.framework_name)),
        take(1)
      )
      .toPromise();
    await this.evidenceEventService.trackEvidenceDownload(
      this.framework ? this.framework.framework_id : null,
      this.controlInstance.control_id,
      this.controlRequirement.requirement_id,
      this.evidenceLike.evidence.evidence_name,
      this.evidenceLike.evidence.evidence_type,
      this.eventSource,
      frameworks?.length ? frameworks.join(', ') : null
    );
  }

  togglePreview(): void {
    this.showTabular = !this.showTabular;
    this.cd.detectChanges();
  }

  // **** Private Methods ****

  private setFileType(): void {
    this.notSupportedPreview = !this.fileTypeHandler.isFileSupported(this.file.name);
  }
}
