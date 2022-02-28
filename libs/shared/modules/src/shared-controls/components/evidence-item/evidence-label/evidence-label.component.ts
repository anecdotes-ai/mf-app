import { PoliciesFacadeService } from 'core/modules/data/services';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CombinedEvidenceInstance } from 'core/modules/data/models/domain';
import { TranslateService } from '@ngx-translate/core';
import { EvidenceTypeIconMapping } from 'core/models';
import { SubscriptionDetacher } from 'core/utils';
import { ResourceType } from 'core/modules/data/models';
import { EvidenceUserEventService } from 'core/modules/data/services/event-tracking/evidence-user-event.service';

@Component({
  selector: 'app-evidence-label',
  templateUrl: './evidence-label.component.html',
  styleUrls: ['./evidence-label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvidenceLabelComponent implements OnInit, OnDestroy {
  private detacher = new SubscriptionDetacher();
  @Input() evidence: CombinedEvidenceInstance;
  @Input() viewPreviewMode: boolean;
  @Input() evidenceComply: boolean;
  @Input() inEvidencePool: boolean;
  @Input() inPluginPage: boolean;

  @Input()
  policyId: string;

  @Input()
  eventSource: string;

  @Input()
  resourceType: ResourceType;

  betaLabel: string;
  fileType: { icon: string };
  resourceTypes = ResourceType;
  evidenceName: string;

  constructor(
    private translateService: TranslateService,
    private evidenceEventService: EvidenceUserEventService,
    private policiesFacade: PoliciesFacadeService,
  ) {}

  ngOnInit(): void {
    if (this.resourceType === this.resourceTypes.Policy) {
      this.setEvidenceNameFromPolicy();
      this.fileType = { icon: 'POLICY-ICON' };
    } else {
      this.createEvidenceName();
      this.fileType = EvidenceTypeIconMapping[this.evidence.evidence_type];
    }

    this.translateService
      .get(this.buildTranslationKey('beta'))
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((value) => (this.betaLabel = value));
  }

  buildTranslationKey(relativeKey: string): string {
    return `evidences.${relativeKey}`;
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  sendEvent(): void {
    this.evidenceEventService.trackFlagHover(
      this.evidence.evidence_id,
      this.evidence.evidence_type,
      this.evidence.evidence_name,
      this.eventSource,
    );
  }

  private setEvidenceNameFromPolicy(): void {
    this.policiesFacade
      .getPolicy(this.policyId)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((policy) => this.evidenceName = policy.policy_name);
  }

  private createEvidenceName(): void {
    this.evidenceName = this.evidence.evidence_is_beta
      ? `${this.evidence.evidence_name} (${this.betaLabel})`
      : this.evidence.evidence_name;
  }
}
