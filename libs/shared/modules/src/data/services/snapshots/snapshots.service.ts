import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Control, ControlRequirement, CombinedEvidenceInstance, Policy, Framework } from '../../models/domain';
import { HttpClient } from '@angular/common/http';
import { AbstractService } from 'core/modules/data/services/abstract-http/abstract-service';
import { AppConfigService } from 'core/services/config/app.config.service';
import { ResourceType } from 'core/modules/data/models';

@Injectable()
export class SnapshotsService extends AbstractService {
  constructor(http: HttpClient, configService: AppConfigService) {
    super(http, configService);
  } 

  getControlSnapshot(control_id: string, snapshot_id: string): Observable<Control> {
    return this.http.get<Control>(this.builSnapshotUrl((t) => t.getEntitySnapshot, { resource_type: ResourceType.Control.toLocaleLowerCase(), resource_id: control_id , snapshot_id}));
  }

  getControlsSnapshots(snapshotIds: string[]): Observable<Control[] | Control> {
    return this.getMultipleSnapshot<Control[] | Control>(snapshotIds);
  }

  getRequirementsSnapshot(snapshotIds: string[]): Observable<ControlRequirement[] | ControlRequirement> {
    return this.getMultipleSnapshot<ControlRequirement[] | ControlRequirement>(snapshotIds);
  }

  getPoliciesSnapshot(snapshotIds: string[]): Observable<Policy[] | Policy> {
    return this.getMultipleSnapshot<Policy[] | Policy>(snapshotIds);
  }

  getEvidenceInstance(evidenceIds: string[]): Observable<CombinedEvidenceInstance[] | CombinedEvidenceInstance> {
    return this.getMultipleSnapshot<CombinedEvidenceInstance[] | CombinedEvidenceInstance>(evidenceIds);
  }

  getFrameworkSnapshot(snapshot_id: string): Observable<Framework> {
    return this.getMultipleSnapshot<Framework>([snapshot_id]);
  }

  private getMultipleSnapshot<T>(snapshotIds: string[]): Observable<T> {
    return this.http.post<T>(this.builSnapshotUrl((t) => t.getMultipleSnapshot), { snapshot_ids: snapshotIds });
  }
}
