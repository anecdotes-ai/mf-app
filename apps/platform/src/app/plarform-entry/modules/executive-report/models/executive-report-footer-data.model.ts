export class ExecutiveReportFooterData {
  // Number of plugins connected
  connectedPlugins: number;
  // Number of applicable controls
  applicableControls: number;
  // Number of evidence collected automatically (practically number of evidence instances)
  automatedEvidence: number;
  // [Number of automated evidence] * $300 * [Number of applicable frameworks]
  savedThisYear: number;

  public constructor() {
    this.connectedPlugins = 0;
    this.applicableControls = 0;
    this.automatedEvidence = 0;
    this.savedThisYear = 0;
  }
}
