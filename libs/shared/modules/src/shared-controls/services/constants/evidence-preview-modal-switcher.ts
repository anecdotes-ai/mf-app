import { ComponentToSwitch } from 'core/modules/component-switcher';
import { EvidencePreviewHostComponent } from 'core/modules/shared-controls/components/preview/evidence-preview-host/evidence-preview-host.component';

export const EvidencePreviewModalSwitcher: ComponentToSwitch[] = [
  {
    id: 'evidence-preview-modal',
    componentType: EvidencePreviewHostComponent,
  },
];
