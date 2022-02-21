import { Dictionary } from '@ngrx/entity';
import { EvidenceInstance } from './evidenceInstance';

export interface EvidenceRunHistoryEntity {
    details_per_instance: Dictionary<{ instance_runs: Array<string>, service_display_name: string }>;
    history_per_run: Dictionary<EvidenceInstance[]>
}
