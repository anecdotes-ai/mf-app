import { Component, Input } from '@angular/core';
import { CalculatedControl, EvidenceLike } from 'core/modules/data/models';
import { RequirementLike } from 'core/modules/shared-controls/models';

@Component({
  selector: 'app-evidence-info',
  templateUrl: './evidence-info.component.html',
  styleUrls: ['./evidence-info.component.scss'],
})
export class EvidenceInfoComponent {
  @Input() control: CalculatedControl;
  @Input() requirementLike: RequirementLike;
  @Input() evidenceLike: EvidenceLike;
  @Input() isFullViewMode = true;
}
