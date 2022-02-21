import { AgentStatus } from './agentStatus';
import { Tunnel } from './tunnel';

export interface Agent {
  id: string;
  name: string;
  api_key: string;
  status: AgentStatus
  tunnels: Tunnel[];
}
