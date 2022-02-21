import {
  Component,
  Input,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  HostBinding,
} from '@angular/core';
import {
  CombinedEvidenceInstance,
  EvidenceStatusEnum,
  EvidenceTypeEnum,
  ControlRequirement,
  Framework
} from 'core/modules/data/models/domain';
import { EvidenceItemAnimations } from '../../evidence-item-animations';
import { EvidenceFacadeService } from 'core/modules/data/services/facades/evidences-facade/evidences-facade.service';
import { CalculatedControl } from 'core/modules/data/models';

@Component({
  selector: 'app-evidence-mitigation-mark',
  templateUrl: './evidence-mitigation-mark.component.html',
  animations: EvidenceItemAnimations,
  styleUrls: ['./evidence-mitigation-mark.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvidenceMitigationMarkComponent {
  @Input()
  evidence: CombinedEvidenceInstance;

  @Input()
  framework: Framework;

  @Input()
  controlInstance: CalculatedControl;

  @Input()
  controlRequirement: ControlRequirement;

  @Output()
  clicked = new EventEmitter(true);

  isMitigatedStatusApplied: boolean;

  get isNewStatus(): boolean {
    return this.evidence.evidence_status === EvidenceStatusEnum.NEW;
  }

  get isNotMitigatedStatus(): boolean {
    return this.evidence.evidence_status === EvidenceStatusEnum.NOTMITIGATED;
  }

  get isEvidenceStatusDisplayed(): boolean {
    return this.evidence.evidence_is_applicable && this.evidence.evidence_type !== EvidenceTypeEnum.DOCUMENT;
  }

  constructor(protected cd: ChangeDetectorRef, private evidenceFacadeService: EvidenceFacadeService) {}

  buildTranslationKey(relativeKey: string): string {
    return `evidences.${relativeKey}`;
  }

  setEvidenceNotMitigatedStatus(event: MouseEvent): void {
    this.evidenceFacadeService.setNotMitigatedStatus(
      this.evidence,
      this.controlRequirement.requirement_id,
      this.controlInstance.control_id,
      this.framework.framework_id
    );
    event.stopPropagation();
    this.clicked.emit();
  }

  setEvidenceMitigatedStatus(event: MouseEvent): void {
    this.evidenceFacadeService.setMitigatedStatus(
      this.evidence,
      this.controlRequirement.requirement_id,
      this.controlInstance.control_id,
      this.framework.framework_id
    );
    event.stopPropagation();
    // we need to show sliding animation for 'new' status if status set from new to mitigated
    this.isMitigatedStatusApplied = true;
    setTimeout(() => {
      this.isMitigatedStatusApplied = false;
      this.cd.detectChanges();
    }, 300);

    this.clicked.emit();
  }
}
