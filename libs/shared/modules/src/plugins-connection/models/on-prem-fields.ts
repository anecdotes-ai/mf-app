import { OnPremFieldsEnum } from './on-prem-fields.enum';

export interface OnPremFields {
  [OnPremFieldsEnum.AgentID]: string;
  [OnPremFieldsEnum.Hostname]: string;
  [OnPremFieldsEnum.Port]: string;
}
