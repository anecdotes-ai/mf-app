import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SvgRegistryService } from 'core/modules/svg-icons';

@Component({
  selector: 'app-evidence-icon',
  templateUrl: './evidence-icon.component.html',
  styleUrls: ['./evidence-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvidenceIconComponent {
  @Input()
  evidenceServiceId: string;

  get iconSrc(): string {
    const iconPath = `plugins/${this.evidenceServiceId}`;
    return this.svgIconRegistry.doesIconExist(iconPath) ? iconPath : 'evidences/default';
  }

  constructor(private svgIconRegistry: SvgRegistryService) {}
}
