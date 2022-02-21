import { Agent } from 'core/modules/data/models/domain';

export enum AgentItemStateEnum {
  CREATE_NEW = 'create-new-agent',
  EXISTING = 'existing-agent',
}

export interface AgentItemEntity {
  itemState: AgentItemStateEnum;
  agentObject?: Agent;
}
