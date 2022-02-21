import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from 'core/services/config/app.config.service';
import { Observable } from 'rxjs';
import { AbstractService } from '../abstract-http/abstract-service';
import { map } from 'rxjs/operators';
import { Policy, PolicySettings, PolicyShare, ApproveOnBehalf, ApproverTypeEnum } from '../../models/domain';

@Injectable()
export class PolicyService extends AbstractService {
  constructor(http: HttpClient, configService: AppConfigService) {
    super(http, configService);
  }

  getPolicies(): Observable<Policy[]> {
    return this.http.get<Policy[]>(this.buildUrl((a) => a.getPolicies));
  }

  getPolicy(policy_id: string): Observable<Policy> {
    return this.http.get<Policy>(this.buildUrl((a) => a.getPolicy, { policy_id }));
  }

  deletePolicy(policy_id: string): Observable<any> {
    return this.http.delete(this.buildUrl((a) => a.deletePolicy, { policy_id }));
  }

  addPolicy(policy: Policy): Observable<Policy> {
    // Don't send null values
    if (!policy.policy_name) {
      delete policy.policy_name;
    }

    return this.http.post<Policy>(
      this.buildUrl((a) => a.addPolicy),
      policy
    );
  }

  editPolicy(policy_id: string, policy: Policy): Observable<Policy> {
    return this.http.put<Policy>(
      this.buildUrl((a) => a.editPolicy, { policy_id }),
      policy
    );
  }

  sharePolicy(policy_id: string, policyShare: PolicyShare): Observable<{link: string}> {
    return this.http.post<{link: string}>(
      this.buildUrl((a) => a.sharePolicy, { policy_id }),
      policyShare
    );
  }

  downloadTemplate(policy_id: string): Observable<any> {
    const templateUrl = this.buildUrl((a) => a.downalodPolicyTemplate, { policy_id });
    return this.http.get(templateUrl, { responseType: 'text', observe: 'response' }).pipe(
      map((preSignedUrl) => {
        window.open(preSignedUrl.body);
      })
    );
  }

  approvePolicy(policy_id: string, comments: string, approverType: ApproverTypeEnum): Observable<any> {
    return this.http.put<Policy>(
      this.buildUrl((a) => a.approvePolicy, { policy_id }),
      { approved: true, comments, approver_type: approverType }
    );
  }

  editPolicySettings(policy_id: string, settings: PolicySettings): Observable<void> {
    return this.http.put<void>(
      this.buildUrl((a) => a.editPolicySettings, { policy_id }),
      settings
    );
  }

  approveOnBehalf(policy_id: string, approveData: ApproveOnBehalf): Observable<void> {
    return this.http.put<void>(
      this.buildUrl((a) => a.approveOnBehalf, { policy_id }),
      approveData
    );
  }
}
