import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { EvidenceSourcesEnum } from 'core/modules/shared-controls/models';
import { EvidenceInstance, EvidenceTypeEnum } from 'core/modules/data/models/domain';
import { Observable } from 'rxjs';
import { EvidenceService } from 'core/modules/data/services';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { SubscriptionDetacher } from 'core/utils';
import { EvidencePreviewModalsContext } from 'core/modules/shared-controls/services/evidence-preview-service/evidence-preview.service';

export enum EvidencePreviewTypeEnum {
  EvidencePreview = 'evidence-preview',
  FilePreview = 'file-preview',
  UrlPreview = 'url-preview',
}

@Component({
  selector: 'app-evidence-preview-host',
  templateUrl: './evidence-preview-host.component.html',
  styleUrls: ['./evidence-preview-host.component.scss'],
})
export class EvidencePreviewHostComponent implements OnInit, OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  evidencePreviewTypeEnum = EvidencePreviewTypeEnum;
  eventSource: EvidenceSourcesEnum;
  evidence: EvidenceInstance;
  evidencePreviewData$: Observable<string>;
  evidenceType: EvidencePreviewTypeEnum;
  headerDataToDisplay: string[];

  constructor(
    private evidenceService: EvidenceService,
    private switcher: ComponentSwitcherDirective,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.switcher.sharedContext$
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((payload: EvidencePreviewModalsContext) => {
        this.eventSource = payload.eventSource;
        this.headerDataToDisplay = payload?.entityPath;
        this.evidence = payload.evidence;
        this.evidenceType = this.getCurrentEvidencePreviewType(payload.evidence);
        this.evidencePreviewData$ = this.evidenceService.getEvidencePreview(payload.evidence.evidence_instance_id);

        this.cd.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  private getCurrentEvidencePreviewType(evidence: EvidenceInstance): EvidencePreviewTypeEnum {
    switch (evidence.evidence_type) {
      case EvidenceTypeEnum.LOG:
      case EvidenceTypeEnum.LIST:
      case EvidenceTypeEnum.CONFIGURATION:
      case EvidenceTypeEnum.TICKET: {
        return EvidencePreviewTypeEnum.EvidencePreview;
      }
      case EvidenceTypeEnum.LINK:
      case EvidenceTypeEnum.DOCUMENT:
      case EvidenceTypeEnum.MANUAL: {
        return EvidencePreviewTypeEnum.FilePreview;
      }
      case EvidenceTypeEnum.URL: {
        return EvidencePreviewTypeEnum.UrlPreview;
      }
    }
  }
}
