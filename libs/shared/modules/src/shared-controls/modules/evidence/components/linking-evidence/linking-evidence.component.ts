import { Component, Input } from '@angular/core';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { CalculatedControl } from 'core/modules/data/models';
import { Framework, EvidenceInstance } from 'core/modules/data/models/domain';
import { EvidenceFacadeService, RequirementsFacadeService } from 'core/modules/data/services';
import { BehaviorSubject } from 'rxjs';
import { RequirementLike } from 'core/modules/shared-controls/models';
import { EvidenceModalIds } from '../../models';

@Component({
  selector: 'app-linking-evidence',
  templateUrl: './linking-evidence.component.html',
})
export class LinkingEvidenceComponent {
  @Input()
  framework: Framework;

  @Input()
  evidence: EvidenceInstance;

  @Input()
  requirementLike: RequirementLike;

  @Input()
  controlInstance: CalculatedControl;

  linkingInProcess$ = new BehaviorSubject(false);

  constructor(
    private requirementsFacadeService: RequirementsFacadeService,
    private componentSwitcherDirective: ComponentSwitcherDirective,
    private evidencesFacade: EvidenceFacadeService
  ) {}

  async link(): Promise<void> {
    this.linkingInProcess$.next(true);

    try {
      await this.requirementsFacadeService.linkEvidenceAsync(
        this.requirementLike.resourceId,
        this.evidence.evidence_id,
        false,
        this.controlInstance.control_id,
        this.framework.framework_id
      );
      await this.evidencesFacade.evidencePoolCollectionEvent(
        this.requirementLike.resourceId,
        this.controlInstance.control_id,
        this.framework.framework_id
      );
      this.componentSwitcherDirective.goById(EvidenceModalIds.Success);
    } catch {
      this.componentSwitcherDirective.goById(EvidenceModalIds.Error);
    } finally {
      this.linkingInProcess$.next(false);
    }
  }

  buildTranslationKey(relativeKey: string): string {
    return `connectEvidenceModal.${relativeKey}`;
  }
}
