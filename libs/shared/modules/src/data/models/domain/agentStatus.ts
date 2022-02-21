export interface AgentStatus {
    dns_status?: AgentDnsStatus;
    general_status?: AgentGeneralStatuses;
    last_heartbeat?: Date;
    uptime?: number
}

export enum AgentGeneralStatuses {
    NEVER_DEPLOYED = 'NEVER_DEPLOYED', ONLINE = 'ONLINE', OFFLINE = 'OFFLINE'
}

export interface AgentDnsStatus {
    agent: boolean
    broker: boolean
    google: boolean
}
