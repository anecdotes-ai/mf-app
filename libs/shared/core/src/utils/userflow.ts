// ********** CONSTS **********

export const ANECDOTES_EVIDENCE_ID = '779697985'; // Identification of applicable legislation and contractual requirements
export const ANECDOTES_CONTROL_ID = '728341854728341939'; // Anecdotes - Frameworks And Controls
export const ANECDORES_SERVICE_ID = 'anecdotes';

// ********** FUNCTIONS **********

export function isAnecdotesPluginActive(service_id: string, isActive: boolean): boolean {
  return service_id === ANECDORES_SERVICE_ID && isActive;
}

export function isAnecdotesControl(controlId: string): boolean {
  return controlId === ANECDOTES_CONTROL_ID;
}

export function isAnecdotesEvidence(evidenceId: string): boolean {
  return evidenceId === ANECDOTES_EVIDENCE_ID;
}
