import { Framework, Service } from 'core/modules/data/models/domain';
export interface OnboardingSharedContext {
  selectedFramework?: Framework[];
  selectedPlugins?: Service[];
}
