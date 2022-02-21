import { ComponentToSwitch } from 'core/modules/component-switcher';
import { EvidenceFromPolicyPreviewComponent } from '../../components/preview/evidence-from-policy-preview/evidence-from-policy-preview.component';

export const EvidenceFromPolicyModalsSwitcher: ComponentToSwitch[] = [
  {
    id: 'evidence-from-policy-preview-modal',
    componentType: EvidenceFromPolicyPreviewComponent,
  },
];
