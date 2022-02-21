import { HttpBackend, HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { convertToOneLevelArray } from 'core/modules/data/utils/index';
import { RESOURCE_PATHS } from '../../constants';
import { ResourceType, ApplicabilityTypes } from '../../models';
import { SvgRegistryService } from 'core/modules/svg-icons';
import { AppConfigService } from 'core/services/config/app.config.service';
import { get } from 'lodash';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApplicabilitiesUpdate, EvidenceInstance, EvidenceStatusEnum, EvidenceRunHistoryEntity } from '../../models/domain';
import { AbstractService } from '../abstract-http/abstract-service';

const defaultEvidenceIconPath = 'evidences/default';

@Injectable()
export class EvidenceService extends AbstractService {
  constructor(
    http: HttpClient,
    configService: AppConfigService,
    httpBackend: HttpBackend,
    private svgIconRegistry: SvgRegistryService
  ) {
    super(http, configService);
    this.resourcesHttpClient = new HttpClient(httpBackend);
  }
  private readonly resourcesHttpClient: HttpClient;

  private evidenceIconCache: Map<string, Observable<string>> = new Map();

  getEvidences(evidenceIds?: string[]): Observable<EvidenceInstance[]> {
    const params = {};

    if (evidenceIds) {
      params['evidence_ids'] = evidenceIds.join(',');
    }

    return this.http.get<EvidenceInstance[]>(
      this.buildUrl((t) => t.getEvidences, {}),
      { params }
    );
  }

  getEvidenceRunHistory(evidence_id: string, date?: number): Observable<EvidenceRunHistoryEntity> {
    if (date) {
      return this.http.get<EvidenceRunHistoryEntity>(this.buildUrl((t) => t.getEvidenceRunHistoryFromDate, { evidence_id, date: date.toString() }));
    }
    return this.http.get<EvidenceRunHistoryEntity>(this.buildUrl((t) => t.getEvidenceRunHistory, { evidence_id }));
  }

  getEvidenceFullData(evidence_instance_id: string): Observable<{ [key: string]: string[] }> {
    return this.http.get<{ [key: string]: [] }>(this.buildUrl((t) => t.getEvidencesFullData, { evidence_instance_id }));
  }

  getEvidencePreview(evidence_instance_id: string): Observable<string> {
    return this.http.get<string>(this.buildUrl((t) => t.getEvidencePreview, { evidence_instance_id }));
  }

  getEvidenceSnapshots(evidence_id: string, date?: number): Observable<EvidenceInstance[]> {
    if (date) {
      return this.http.get<EvidenceInstance[]>(this.buildUrl((t) => t.getEvidenceSnapshotsFromDate, { evidence_id, date }));
    }
    return this.http.get<EvidenceInstance[]>(this.buildUrl((t) => t.getEvidenceSnapshots, { evidence_id }));
  }

  getEvidencePresignedUrl(evidence_instance_id: string): Observable<string> {
    const url = this.buildUrl((url) => url.downloadEvidenceSignedUrl, { evidence_instance_id });
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.http.get(url, { headers, responseType: 'text', observe: 'response' }).pipe(
      map((resp: HttpResponse<string>) => {
        return resp.body;
      })
    );
  }

  downloadEvidence(evidence_instance_id: string): Observable<File> {
    const url = this.buildUrl((t) => t.downloadEvidence, { evidence_instance_id });

    return this.http.get(url, { responseType: 'blob', observe: 'response' }).pipe(
      map((resp: HttpResponse<Blob>) => {
        let fileName = resp.headers.get('content-disposition').replace(new RegExp('attachment; filename='), '');

        if (fileName.startsWith('"') && fileName.endsWith('"')) {
          // Removes quotes around file name "file.txt" => file.txt
          fileName = fileName.substring(1, fileName.length - 1);
        }

        return new File([resp.body], fileName);
      })
    );
  }

  downloadAllEvidences(framework_id: string): Observable<string> {
    const url = this.buildUrl((t) => t.downloadAllEvidences, { framework_id });
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');

    return this.http.get(url, { headers, responseType: 'text', observe: 'response' }).pipe(
      map((resp: HttpResponse<string>) => {
        return resp.body;
      })
    );
  }

  downloadLogs(): Observable<string> {
    const url = this.buildUrl((t) => t.downloadLogs);
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');

    return this.http.get(url, { headers, responseType: 'text', observe: 'response' }).pipe(
      map((resp: HttpResponse<string>) => {
        return resp.body;
      })
    );
  }

  changeEvidenceApplicabilityState(evidence: EvidenceInstance): Observable<ApplicabilitiesUpdate> {
    return this.http.put<ApplicabilitiesUpdate>(
      this.buildUrl((t) => t.changeApplicability),
      [
        {
          is_applicable: !evidence.evidence_is_applicable,
          applicability_id: evidence.evidence_id.toString(),
          applicability_type: ApplicabilityTypes.EVIDENCE,
        },
      ]
    );
  }

  getEvidenceIconLink(serviceId: string, isLarge = false): Observable<string> {
    if (!serviceId) {
      return of(defaultEvidenceIconPath);
    }

    const lowerCaseEvidenceId = serviceId.toLowerCase();
    const iconPath = `plugins/${lowerCaseEvidenceId}`;

    if (this.svgIconRegistry.doesIconExist(iconPath)) {
      return of(iconPath);
    }

    return of(defaultEvidenceIconPath);
  }

  private cacheIcon(serviceId: string, icon: Observable<string>): void {
    if (!serviceId) {
      return;
    }

    const lowerCaseServiceId = serviceId.toLowerCase();

    if (!this.evidenceIconCache.has(lowerCaseServiceId)) {
      this.evidenceIconCache.set(lowerCaseServiceId, icon);
    }
  }

  getIcon(serviceId: string): Observable<string> {
    const lowerCaseEvidenceId = serviceId.toLowerCase();

    if (!this.evidenceIconCache.has(lowerCaseEvidenceId)) {
      this.cacheIcon(serviceId, this.getEvidenceIconLink(serviceId));
    }

    return this.evidenceIconCache.get(lowerCaseEvidenceId);
  }

  setEvidenceStatus(evidence: EvidenceInstance, evidence_status: EvidenceStatusEnum): Observable<any> {
    return this.http.put(
      this.buildUrl((t) => t.setEvidenceStatus, { evidence_id: evidence.evidence_id }),
      { evidence_status }
    );
  }

  uploadEvidence(
    service_id: string,
    service_instance_id?: string,
    evidence?: File
  ): Observable<{ evidence_id: string[] }> {
    const formData = new FormData();
    formData.append('service_id', service_id);
    if (service_instance_id) {
      formData.append('service_instance_id', service_instance_id);
    }

    formData.append('evidence', evidence);

    return this.http.post<{ evidence_id: string[] }>(
      this.buildUrl((a) => a.uploadEvidence),
      formData
    );
  }

  createSharedLinkEvidence(
    service_id: string,
    service_instance_id?: string,
    link?: string
  ): Observable<{ evidence_id: string[] }> {
    const formData = new FormData();
    formData.append('service_id', service_id);
    if (service_instance_id) {
      formData.append('service_instance_id', service_instance_id);
    }
    formData.append('link', link);

    return this.http.post<{ evidence_id: string[] }>(
      this.buildUrl((a) => a.uploadEvidence),
      formData
    );
  }

  /** @deprecated TODO: Must be removed. */
  addEvidence(
    resourceType: string,
    resource_id: string,
    service_id: string,
    service_instance_id?: string,
    evidence?: File,
    link?: string
  ): Observable<{ evidence_id: string[] }> {
    const formData = new FormData();
    formData.append('service_id', service_id);
    if(service_instance_id) {
      formData.append('service_instance_id', service_instance_id);
    }
    formData.append('link', link);
    formData.append('evidence', evidence);
    const urlKey = get(RESOURCE_PATHS, [resourceType, 'add']);
    if (!urlKey) {
      return;
    }

    return this.http.post<{ evidence_id: string[] | string[][] }>(
      this.buildUrl((a) => a[urlKey], { resource_id }),
      formData
    ).pipe(
      /**
       * Temporary until we solve issue with the back-end response.
       * Should return string[], but returns string[][] for the "sharing link" evidence.
       */
      map(({ evidence_id }) => {
        return { evidence_id: convertToOneLevelArray(evidence_id) as string[] };
      }),
    );
  }

  createTicketingEvidence(
    resourceType: ResourceType,
    resource_id: string,
    service_id: string,
    service_instance_id: string,
    tickets: string[]
  ): Observable<any> {
    const formData = new FormData();
    formData.append('service_id', service_id);
    formData.append('service_instance_id', service_instance_id);
    formData.append('tickets', tickets.join(','));
    const urlKey = get(RESOURCE_PATHS, [resourceType, 'add']);
    if (!urlKey) {
      return;
    }
    return this.http.post(
      this.buildUrl((a) => a[urlKey], { resource_id }),
      formData
    );
  }

  updateEvidence(
    resourceType: string,
    resource_id: string,
    service_id: string,
    service_instance_id: string,
    evidence_id: string,
    evidence?: File,
    link?: string
  ): Observable<any> {
    const urlKey = get(RESOURCE_PATHS, [resourceType, 'update']);
    if (!urlKey) {
      return;
    }
    let formData;
    // Should change requirement endpoint to be like policy (formData)
    if (resourceType === ResourceType.Policy) {
      formData = new FormData();
      formData.append('service_id', service_id);
      formData.append('service_instance_id', service_instance_id);
      formData.append('link', link);
      formData.append('evidence', evidence);
    } else if (resourceType === ResourceType.Requirement) {
      formData = { service_id, link };
    }
    return this.http.put(
      this.buildUrl((a) => a[urlKey], { resource_id, evidence_id }),
      formData
    );
  }

  deleteEvidence(resourceType: string, resource_id: string, evidence_id: string): Observable<any> {
    const urlKey = get(RESOURCE_PATHS, [resourceType, 'delete']);
    if (!urlKey) {
      return;
    }
    return this.http.delete(this.buildUrl((a) => a[urlKey], { resource_id, evidence_id }));
  }
}
