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
import { EvidenceLike, CalculatedPolicy } from 'core/modules/data/models';
import { EvidenceService, PoliciesFacadeService } from 'core/modules/data/services';
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
  policy: CalculatedPolicy;
  isLoaded: boolean;
  showTabular: boolean;
  notSupportedPreview: boolean;
  file: File;
  headerDataToDisplay: string[];

  // **** Getters ****

  get hasSchedules(): boolean {
    return !!this.policy?.policy_settings?.scheduling.approval_frequency;
  }

  get hasPreview(): boolean {
    return this.policy?.has_roles || this.hasSchedules;
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
        this.headerDataToDisplay = payload.entityPath;
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

    await this.evidenceEventService.trackEvidenceDownload(
      this.evidenceLike.evidence.evidence_id,
      this.evidenceLike.evidence.evidence_name,
      this.evidenceLike.evidence.evidence_type,
      this.eventSource,
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
