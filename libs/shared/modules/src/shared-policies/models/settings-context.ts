
import {PolicySettings} from 'core/modules/data/models/domain';

export interface SettingsContext {
  translationKey?: string;
  policyId: string;
  policySettings?: PolicySettings;
}
