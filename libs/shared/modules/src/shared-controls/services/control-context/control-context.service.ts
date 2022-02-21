import { Inject, Injectable, InjectionToken, Optional, TemplateRef } from '@angular/core';
import { CalculatedControl, CalculatedRequirement } from 'core/modules/data/models';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';

export const ControlContexInjectionToken = new InjectionToken('control-context-config');

export interface ControlContextConfig {
  isAudit: boolean;
}

@Injectable()
export class ControlContextService {
  private _newRequirementIds$: BehaviorSubject<{ [controlId: string]: Set<string> }>;
  private _newEvidenceIds$: BehaviorSubject<{ [requirementId: string]: Set<string> }>;

  constructor(@Optional() @Inject(ControlContexInjectionToken) private config: ControlContextConfig) {
    if (!config) {
      this.config = {
        isAudit: false,
      };
    }
  }

  requirementTemplate: TemplateRef<any>;

  get isAudit(): boolean {
    return this.config.isAudit;
  }

  // Manage new evidence

  getRequirementNewEvidence(requirementId: string): Observable<Set<string>> {
    return this.getNewEvidence().pipe(
      filter((reqIds) => requirementId in reqIds),
      map((reqData) => reqData[requirementId]),
      startWith(new Set<string>())
    );
  }

  detectNewRequirementEvidence(currReq: CalculatedRequirement, prevAllReqEvidence: Set<string>): Set<string> {
    const data = this.getNewEvidence().getValue();
    const newSavedReqEvidence = data[currReq.requirement_id] ?? new Set<string>();
    const currAllEvidenceIds = currReq.requirement_related_evidences.map(e => e.id);
    const newEvidenceIds: string[] = currAllEvidenceIds.filter(
      (evidenceId) => !(prevAllReqEvidence.has(evidenceId) || newSavedReqEvidence.has(evidenceId))
    );

    if (newEvidenceIds.length) {
      data[currReq.requirement_id] =
        currReq.requirement_id in data
          ? new Set([...data[currReq.requirement_id], ...newEvidenceIds])
          : new Set(newEvidenceIds);
      this._newEvidenceIds$.next(data);
    }

    return new Set(currAllEvidenceIds);
  }

  // Manage new requirements

  getControlNewRequirements(controlId: string): Observable<Set<string>> {
    return this.getNewRequirements().pipe(
      filter((controlIds) => controlId in controlIds),
      map((controlData) => controlData[controlId]),
      startWith(new Set<string>())
    );
  }

  detectNewControlRequirements(currControl: CalculatedControl, prevAllReq: Set<string>): Set<string> {
    const data = this.getNewRequirements().getValue();
    const newSavedReq = data[currControl.control_id] ?? new Set<string>();
    const newReqIds: string[] = currControl.control_requirement_ids.filter(
      (requirementId) => !(prevAllReq.has(requirementId) || newSavedReq.has(requirementId))
    );

    if (newReqIds.length) {
      data[currControl.control_id] =
        currControl.control_id in data ? new Set([...data[currControl.control_id], ...newReqIds]) : new Set(newReqIds);
      this._newRequirementIds$.next(data);
    }

    return new Set(currControl.control_requirement_ids);
  }

  // Manage all

  clearAllNewEntities(): void {
    this.clearAllNewEvidence();
    this.clearAllNewRequirements();
  }

  private clearAllNewEvidence(): void {
    if (this._newEvidenceIds$) {
      this._newEvidenceIds$.next({});
      this._newEvidenceIds$.complete();
      this._newEvidenceIds$ = undefined;
    }
  }

  private clearAllNewRequirements(): void {
    if (this._newRequirementIds$) {
      this._newRequirementIds$.next({});
      this._newRequirementIds$.complete();
      this._newRequirementIds$ = undefined;
    }
  }

  private getNewEvidence(): BehaviorSubject<{ [controlId: string]: Set<string> }> {
    if (!this._newEvidenceIds$) {
      this._newEvidenceIds$ = new BehaviorSubject({});
    }
    return this._newEvidenceIds$;
  }

  private getNewRequirements(): BehaviorSubject<{ [controlId: string]: Set<string> }> {
    if (!this._newRequirementIds$) {
      this._newRequirementIds$ = new BehaviorSubject({});
    }
    return this._newRequirementIds$;
  }

}
