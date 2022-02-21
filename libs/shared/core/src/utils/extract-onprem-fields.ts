import { OnPremFields, OnPremFieldsEnum } from 'core/modules/plugins-connection/models';

export function extractOnPremFields(values: { [key: string]: string }): OnPremFields {
  return {
    [OnPremFieldsEnum.AgentID]: values[OnPremFieldsEnum.AgentID],
    [OnPremFieldsEnum.Hostname]: values[OnPremFieldsEnum.Hostname],
    [OnPremFieldsEnum.Port]: values[OnPremFieldsEnum.Port]
  };
}