import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractService } from 'core/modules/data/services/abstract-http/abstract-service';
import { AppConfigService } from 'core/services/config/app.config.service';
import { Observable } from 'rxjs';
import { Risk, RiskCategory, RiskSource } from '../../models';

@Injectable()
export class RiskService extends AbstractService {
  constructor(http: HttpClient, configService: AppConfigService) {
    super(http, configService);
  }

  getAllRisks(): Observable<Risk[]> {
    return this.http.get<Risk[]>(this.buildUrl((a) => a.getAllRisks));
  }

  addRisk(risk: Risk): Observable<Risk> {
    return this.http.post<Risk>(
      this.buildUrl((a) => a.addRisk),
      risk
    );
  }

  getRiskById(risk_id: string): Observable<Risk> {
    return this.http.get<Risk>(this.buildUrl((a) => a.getRiskById, { risk_id }));
  }

  editRisk(risk: Risk): Observable<Risk> {
    return this.http.patch<Risk>(
      this.buildUrl((a) => a.editRisk, { risk_id: risk.id }),
      risk
    );
  }

  updateEvidences(risk_id: string, evidenceIds: string[]): Observable<Risk> {
    return this.http.patch<Risk>(
      this.buildUrl((a) => a.attachEvidenceToRisk, { risk_id }),
      {
        evidence_ids: evidenceIds
      }
    );
  }

  deleteRisk(risk_id: string): Observable<any> {
    return this.http.delete<void>(this.buildUrl((a) => a.deleteRisk, { risk_id }));
  }

  getAllRiskCategories(): Observable<RiskCategory[]> {
    return this.http.get<RiskCategory[]>(this.buildUrl((a) => a.getAllRiskCategories));
  }

  addRiskCategory(riskCategory: RiskCategory): Observable<RiskCategory> {
    return this.http.post<RiskCategory>(
      this.buildUrl((a) => a.addRiskCategory),
      riskCategory
    );
  }

  getRiskCategoryById(risk_category_id: string): Observable<RiskCategory> {
    return this.http.get<RiskCategory>(this.buildUrl((a) => a.getRiskCategoryById, { risk_category_id }));
  }

  deleteRiskCategory(risk_category_id: string): Observable<any> {
    return this.http.delete<void>(this.buildUrl((a) => a.deleteRiskCategory, { risk_category_id }));
  }

  getAllRiskSources(): Observable<RiskSource[]> {
    return this.http.get<RiskSource[]>(this.buildUrl((a) => a.getAllRiskSources));
  }

  addRiskSource(riskSource: RiskSource): Observable<RiskSource> {
    return this.http.post<RiskSource>(
      this.buildUrl((a) => a.addRiskSource),
      riskSource
    );
  }

  getRiskSourceById(risk_source_id: string): Observable<RiskSource> {
    return this.http.get<RiskSource>(this.buildUrl((a) => a.getRiskSourceById, { risk_source_id }));
  }

  deleteRiskSource(risk_source_id: string): Observable<any> {
    return this.http.delete<void>(this.buildUrl((a) => a.deleteRiskSource, { risk_source_id }));
  }
}
