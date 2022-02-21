import { Component, Input } from '@angular/core';
import { GridView } from 'core/modules/grid';
import { EvidenceInstance } from 'core/modules/data/models/domain';
import { Observable } from 'rxjs';
import { PreviewTypesEnum } from 'core/modules/shared-controls/components/preview/models/file-type.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-table-like-evidence-grid',
  templateUrl: './table-like-evidence-grid.component.html',
  styleUrls: ['./table-like-evidence-grid.component.scss'],
})
export class TableLikeEvidenceGridComponent {
  @Input()
  displayedGridView: GridView;

  @Input()
  evidence: EvidenceInstance;

  @Input()
  evidenceDistinct$: Observable<EvidenceInstance>;

  @Input()
  viewType: PreviewTypesEnum;

  get isGridNotEmpty(): boolean {
    return !!this.displayedGridView?.rows?.length;
  }

  rowIsGapped(rowId: number): Observable<boolean> {
    return this.evidenceDistinct$.pipe(
      map((value) => {
        if (!value.evidence_gap) {
          return false;
        }
        return value.evidence_gap.includes(rowId);
      })
    );
  }
}
