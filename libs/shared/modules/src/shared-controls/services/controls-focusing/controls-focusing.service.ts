import { Injectable } from '@angular/core';
import { ResourceType } from 'core/modules/data/models';
import { FocusingService } from 'core/modules/focusing-mechanism';
import { Observable } from 'rxjs';

const expandControlName = 'ExpandControl';

@Injectable()
export class ControlsFocusingService {
  constructor(private focusingService: FocusingService) {}

  focusControl(controlId: string): void {
    this.focusingService.focusSingleResource(ResourceType.Control, controlId);
  }

  focusControlWithExpanding(controlId: string): void {
    this.focusingService.focusResources({
      [ResourceType.Control]: controlId,
      [expandControlName]: controlId,
    });
  }

  focusRequirement(controlId: string, requirementId: string): void {
    this.focusingService.focusResources({
      [ResourceType.Control]: controlId,
      [ResourceType.Requirement]: requirementId,
      [expandControlName]: controlId,
    });
  }

  focusEvidence(controlId: string, evidenceId: string): void {
    this.focusingService.focusResources({
      [ResourceType.Control]: controlId,
      [ResourceType.Evidence]: evidenceId,
      [expandControlName]: controlId,
    });
  }

  finishControlFocusing(): void {
    this.focusingService.finishFocusing(ResourceType.Control);
  }

  finishControlExpanding(): void {
    this.focusingService.finishFocusing(expandControlName);
  }

  getControlsFocusingStream(): Observable<string> {
    return this.focusingService.getFocusingStreamForResource(ResourceType.Control);
  }

  getSpecificControlFocusingStream(controlId: string): Observable<any> {
    return this.focusingService.getFocusingStreamByResourceId(ResourceType.Control, controlId);
  }

  getSpecificControlExpandingStream(controlId: string): Observable<any> {
    return this.focusingService.getFocusingStreamByResourceId(expandControlName, controlId);
  }

  getSpecificRequirementFocusingStream(requirementId: string): Observable<any> {
    return this.focusingService.getFocusingStreamByResourceId(ResourceType.Requirement, requirementId);
  }

  getSpecificEvidenceFocusingStream(evidenceId: string): Observable<any> {
    return this.focusingService.getFocusingStreamByResourceId(ResourceType.Evidence, evidenceId);
  }
}
