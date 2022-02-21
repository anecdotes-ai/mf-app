import { Injectable } from '@angular/core';
import { AbstractService } from '../abstract-http/abstract-service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'core/services/config/app.config.service';
import { Observable } from 'rxjs';
import { Framework, Audit, AuditLog, StatusEnum, ExcludePlugin } from '../../models/domain';
import { ChangeApplicability, ApplicabilityTypes } from '../../models';
@Injectable()
export class FrameworkService extends AbstractService {
  constructor(http: HttpClient, configService: AppConfigService) {
    super(http, configService);
  }

  getAllFrameworks(): Observable<Framework[]> {
    return this.http.get<Framework[]>(this.buildUrl((a) => a.getAllFrameworks));
  }

  getSpecificFramework(framework_id: string): Observable<Framework> {
    framework_id = framework_id.toLowerCase();
    return this.http.get<Framework>(this.buildUrl((a) => a.getSpecificFramework, { framework_id }));
  }

  changeApplicabilityState(framework: Framework): Observable<ChangeApplicability> {
    const requestBody: ChangeApplicability = {
      applicability_id: framework.framework_id,
      applicability_type: ApplicabilityTypes.FRAMEWORK,
      is_applicable: !framework.is_applicable,
    };

    return this.http.put<ChangeApplicability>(
      this.buildUrl((t) => t.frameworkChangeApplicability, { framework_id: framework.framework_id }),
      requestBody
    );
  }

  getFrameworkIconLink(frameworkId: string, isLarge = false): string {
    return isLarge ? `frameworks/${frameworkId}-70px` : `frameworks/${frameworkId}`;
  }

  adoptFramework(framework: Framework): Observable<ChangeApplicability> {
    const requestBody: ChangeApplicability = {
      applicability_id: framework.framework_id,
      applicability_type: ApplicabilityTypes.FRAMEWORK,
      is_applicable: true,
    };

    return this.http.put<ChangeApplicability>(
      this.buildUrl((t) => t.frameworkChangeApplicability, { framework_id: framework.framework_id }),
      requestBody
    );
  }
  updateFreezeFramework(frameworkId: string, isFreeze: boolean): Observable<any> {
    const requestBody: Framework = {
      freeze: isFreeze
    };

    return this.http.patch<any>(
      this.buildUrl((t) => t.patchFramework, { framework_id: frameworkId }),
      requestBody
      );
    }

  deleteFrameworkAudit(framework_id: string): Observable<void> {
    return this.http.delete<void>(this.buildUrl((a) => a.deleteFrameworkAudit, { framework_id }));
  }

  getFrameworkAuditHistory(framework_id: string, only_completed = true): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(
      this.buildUrl((a) => a.getFrameworkAuditHistory, { framework_id, only_completed })
    );
  }

  changeFrameworkAuditStatus(framework_id: string, status: StatusEnum): Observable<void> {
    return this.http.patch<void>(
      this.buildUrl((a) => a.changeFrameworkAuditStatus, { framework_id }),
      { status }
    );
  }

  setFrameworkAudit(framework_id: string, audit: Audit): Observable<void> {
    return this.http.post<void>(
      this.buildUrl((t) => t.setFrameworkAudit, { framework_id }),
      audit
    );
  }

  updateFrameworkAudit(framework_id: string, audit: Audit): Observable<Audit> {
    return this.http.put<Audit>(
      this.buildUrl((t) => t.updateFrameworkAudit, { framework_id }),
      audit
    );
  }

  updateFrameworksPluginsExclusionList(frameworkId: string, updatedExcludedPluginsList: ExcludePlugin): Observable<any> {
    return this.http.put<string[]>(
      this.buildUrl((t) => t.frameworkUpdatePluginsExclusionList, { framework_id: frameworkId }),
      updatedExcludedPluginsList
    );
  }
}
