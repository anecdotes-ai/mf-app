export interface SendSlackMessage {
  /**
   * Either an overridden message or null to send the default message
   */
  message?: string;
  /**
   * The list of recipients to receive this message
   */
  recipients: string[];
}
