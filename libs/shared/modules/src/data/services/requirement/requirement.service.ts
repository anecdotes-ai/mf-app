import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MANUAL } from '../../constants';
import { EvidenceService } from '../evidence/evidence.service';
import { AppConfigService } from 'core/services/config/app.config.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApplicabilityTypes, ResourceType } from '../../models';
import { ApplicabilitiesUpdate, ControlRequirement, Requirement } from '../../models/domain';
import { AbstractService } from '../abstract-http/abstract-service';

@Injectable({
  providedIn: 'root',
})
export class RequirementService extends AbstractService {
  constructor(http: HttpClient, configService: AppConfigService, private evidenceService: EvidenceService) {
    super(http, configService);
  }

  getRequirements(requirementIds?: string[]): Observable<ControlRequirement[]> {
    const params = {};

    if (requirementIds) {
      params['requirement_ids'] = requirementIds.join(',');
    }

    return this.http.get<ControlRequirement[]>(
      this.buildUrl((a) => a.getRequirements),
      {
        params,
      }
    );
  }

  getRequirement(requirementId: string): Observable<ControlRequirement> {
    return this.getRequirements([requirementId]).pipe(map((requirements) => requirements.find(req => req.requirement_id === requirementId)));
  }

  addRequirementEvidence(
    requirement_id: string,
    service_id: string,
    service_instance_id: string,
    evidence?: File,
    link?: string
  ): Observable<{ evidence_id: string[] }> {
    return this.evidenceService.addEvidence(ResourceType.Requirement, requirement_id, service_id, service_instance_id, evidence, link);
  }

  createRequirementTicketingEvidence(requirement_id: string, service_id: string, service_instance_id: string, tickets: string[]): Observable<any> {
    return this.evidenceService.createTicketingEvidence(ResourceType.Requirement, requirement_id, service_id, service_instance_id, tickets);
  }

  createRequirementUrlEvidence(
    requirement_id: string,
    url: string,
    evidence_name: string
  ): Observable<{ evidence_id: string[] }> {
    const formData = new FormData();
    formData.append('service_id', MANUAL);
    formData.append('evidence_url', url);
    formData.append('evidence_name', evidence_name);

    return this.http.post<{ evidence_id: string[] }>(
      this.buildUrl((a) => a.addRequirementEvidence, { resource_id: requirement_id }),
      formData
    );
  }

  updateRequirementLinkEvidence(
    requirement_id: string,
    evidence_id: string,
    service_id: string,
    service_instance_id: string,
    newLink: string
  ): Observable<any> {
    return this.evidenceService.updateEvidence(
      ResourceType.Requirement,
      requirement_id,
      evidence_id,
      service_id,
      service_instance_id,
      undefined,
      newLink
    );
  }

  updateRequirementUrlEvidence(
    requirement_id: string,
    evidence_id: string,
    evidence_url: string,
    evidence_name: string
  ): Observable<any> {
    return this.http.put(
      this.buildUrl((a) => a.updateRequirementEvidence, { resource_id: requirement_id, evidence_id }),
      { evidence_url, evidence_name }
    );
  }

  deleteRequirementEvidence(requirement_id: string, evidence_id: string): Observable<any> {
    return this.evidenceService.deleteEvidence(ResourceType.Requirement, requirement_id, evidence_id);
  }

  removeRequirement(requirement_id: string): Observable<any> {
    return this.http.delete(this.buildUrl((a) => a.removeRequirement, { requirement_id }));
  }

  changeControlRequirementApplicabilityState(
    controlRequirement: ControlRequirement
  ): Observable<ApplicabilitiesUpdate> {
    return this.http.put<ApplicabilitiesUpdate>(
      this.buildUrl((t) => t.changeApplicability),
      [
        {
          is_applicable: !controlRequirement.requirement_applicability,
          applicability_id: controlRequirement.requirement_id.toString(),
          applicability_type: ApplicabilityTypes.REQUIREMENT,
        },
      ]
    );
  }

  addRequirement(requirement: Requirement): Observable<Requirement> {
    // Don't send null values
    if (!requirement.requirement_help) {
      delete requirement.requirement_help;
    }

    return this.http.post<Requirement>(
      this.buildUrl((a) => a.addRequirement),
      requirement
    );
  }

  editRequirement(requirement_id: string, requirement: Requirement): Observable<Requirement> {
    return this.http.put<Requirement>(
      this.buildUrl((a) => a.editRequirement, { requirement_id: requirement_id }),
      requirement
    );
  }

  attachPolicyToRequirement(requirement_id: string, policy_id: string): Observable<any> {
    return this.http.post(
      this.buildUrl((a) => a.addPolicyToRequirement, { requirement_id, policy_id }),
      null
    );
  }

  deletePolicyFromRequirement(requirement_id: string, policy_id: string): Observable<any> {
    return this.http.delete(this.buildUrl((a) => a.addPolicyToRequirement, { requirement_id, policy_id }));
  }
}
