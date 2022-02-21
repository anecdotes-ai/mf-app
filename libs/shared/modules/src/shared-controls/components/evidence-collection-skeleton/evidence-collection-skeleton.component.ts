import { EvidenceCollectionResult } from 'core/models/evidence-collection-result';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Router } from '@angular/router';
import { RouteParams } from 'core/constants';
import { EvidenceTypeIconMapping } from 'core/models';
import { PluginNotificationSenderService, MessageBusService, EvidenceCollectionMessages } from 'core/services';
import { EvidenceTypeEnum } from 'core/modules/data/models/domain';
import {
  EvidenceFacadeService,
  EvidenceService,
  PluginService,
  OperationsTrackerService,
  TrackOperations,
} from 'core/modules/data/services';
import { SubscriptionDetacher } from 'core/utils';
import { interval, merge, Observable, Subject } from 'rxjs';
import { filter, map, takeUntil, takeWhile, timeout } from 'rxjs/operators';
import { CollectingEvidence } from 'core/modules/data/models';

/**
 * Backend sends only Response, no UploadProgress, so we need to fake-update progress bar.
 * We assume that when response is received, 50% of the job is done.
 * Another 50% is for controls update.
 * Here is approximate time we need to wait.
 */
const approximateControlsUpdateTimeInMs = 25000;
const fakeProgressUpdateIntervalInMs = 500;
const maxPercent = 100;
const minPercent = 0;

@Component({
  selector: 'app-evidence-collection-skeleton',
  templateUrl: './evidence-collection-skeleton.component.html',
  styleUrls: ['./evidence-collection-skeleton.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvidenceCollectionSkeletonComponent implements OnInit, OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  private collectionEnd$ = new Subject();
  private evidenceCollected: boolean;
  private updateServiceRequestTimeout: number;

  @Input()
  collectingEvidence: CollectingEvidence;

  @Input()
  numberOfEvidences: number;

  @Input()
  resourceId: string;

  @Output()
  evidenceCollectionEnd = new EventEmitter();

  @Output()
  tryAgain = new EventEmitter();

  fileTypeMapping: { icon: string };
  isManualOrUrlUpload: boolean;
  collectionPercentage: number;
  isCollectionError: boolean;
  evidenceName: string;
  collectionErrorDescription: string;
  messageError = this.buildTranslationKey('uploadingFailed');

  evidenceIcon$: Observable<string>;

  evidenceTypes = EvidenceTypeEnum;

  constructor(
    private evidenceService: EvidenceService,
    private evidencesFacade: EvidenceFacadeService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private pluginService: PluginService,
    private pluginNotificationSenderService: PluginNotificationSenderService,
    private messageBus: MessageBusService,
    private operationsTrackerService: OperationsTrackerService
  ) {}

  ngOnInit(): void {
    this.evidenceIcon$ = this.evidenceService.getIcon(this.collectingEvidence.serviceId);
    this.fileTypeMapping = EvidenceTypeIconMapping[this.collectingEvidence.evidenceType];
      this.isManualOrUrlUpload =
        this.collectingEvidence.evidenceType === EvidenceTypeEnum.MANUAL ||
        this.collectingEvidence.evidenceType === EvidenceTypeEnum.URL;
    this.numberOfEvidences > 1
        ? (this.updateServiceRequestTimeout = this.numberOfEvidences * 60000)
        : (this.updateServiceRequestTimeout = 120000);
    this.handleCollection();
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  buildTranslationKey(relativeKey: string): string {
    return `evidences.skeleton.${relativeKey}`;
  }

  tryAgainClick(): void {
    this.tryAgain.emit();
    this.evidenceCollectionEnd.emit();
    this.handleCollection();
  }

  goToPluginPage(): void {
    this.router.navigate([this.pluginService.getPluginRoute(this.collectingEvidence.serviceId)], {
      queryParams: { [RouteParams.plugin.tabQueryParamName]: RouteParams.plugin.logsQueryParamValue },
    });
  }

  private handleCollection(): void {
    this.updateProgress(); // not testable because of interval
    merge(
      this.evidencesFacade.getEvidence(this.collectingEvidence.evidenceId), // TODO: Must be removed. We should always rely on EvidenceCollectionMessages.EVIDENCE_UPLOADED event
      this.messageBus
        .getObservable(EvidenceCollectionMessages.EVIDENCE_UPLOADED, this.resourceId)
        .pipe(
          filter((collectingEvidence: CollectingEvidence[]) =>
            collectingEvidence.some((e) => e.temporaryId === this.collectingEvidence.temporaryId)
          )
        )
    )
      .pipe(
        filter((evidence) => !!evidence),
        timeout(this.updateServiceRequestTimeout),
        this.detacher.takeUntilDetach()
      )
      .subscribe(
        () => this.collectionSuccess(),
        () => this.collectionFail() // not testable because of timeout
      );
  }

  private collectionSuccess(): void {
    this.evidenceCollectionEnd.emit();
    this.detacher.detach(false);
  }

  private collectionFail(): void {
    this.isCollectionError = true;
    this.detacher.detach(false);

    if (this.collectingEvidence.evidenceType === EvidenceTypeEnum.LINK) {
      this.pluginNotificationSenderService.sendCollectionFailedNotification({
        service_id: this.collectingEvidence.serviceId,
        service_name: this.collectingEvidence.serviceDisplayName,
      });
    }

    this.cd.detectChanges();
  }

  private updateProgress(): void {
    const stepInPercents = (fakeProgressUpdateIntervalInMs * 100) / approximateControlsUpdateTimeInMs;

    this.collectionPercentage = minPercent;

    this.operationsTrackerService
      .getOperationStatus(this.collectingEvidence.evidenceId, TrackOperations.ADD_EVIDENCE_FROM_DEVICE)
      .pipe(
        filter((x) => x instanceof Error),
        this.detacher.takeUntilDetach()
      )
      .subscribe((e) => {
        this.messageError = JSON.parse(e.message).error.error_title;
        this.collectionFail();
      });

    this.messageBus
      .getObservable<EvidenceCollectionResult>(
        EvidenceCollectionMessages.EVIDENCE_COLLECTED,
        this.collectingEvidence.evidenceId
      )
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((collectResult) => {
        if (collectResult.successfully_collected) {
          this.evidenceCollected = true;
          this.evidenceName = collectResult.description;
        } else {
          this.collectionErrorDescription = collectResult.description;
          this.collectionFail();
        }
      });

    interval(fakeProgressUpdateIntervalInMs)
      .pipe(
        map((x) => minPercent + stepInPercents * x),
        takeWhile((fakeProgressInPercents) => fakeProgressInPercents <= maxPercent),
        takeUntil(this.collectionEnd$),
        filter(() => this.collectionPercentage <= maxPercent / 2 || this.evidenceCollected),
        this.detacher.takeUntilDetach()
      )
      .subscribe(() => {
        this.collectionPercentage += stepInPercents * 5;
        this.cd.detectChanges();
      });
  }
}
