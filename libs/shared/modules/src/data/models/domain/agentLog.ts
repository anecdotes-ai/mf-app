export interface AgentLog {
  /**
   * the log message
   */
  message: string;
  /**
   * the log level (debug/info/etc)
   */
  severity: AgentSeverityEnum;
  timestamp: Date;
}

export enum AgentSeverityEnum {
  INFO = "INFO",
  DEBUG = "DEBUG",
  ERROR = "ERROR",
  WARNING = "WARNING",
}
