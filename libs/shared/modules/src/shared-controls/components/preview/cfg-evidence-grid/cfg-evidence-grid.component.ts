import { Component, Input } from '@angular/core';
import { GridView } from 'core/modules/grid';
import { EvidenceInstance } from 'core/modules/data/models/domain';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-cfg-evidence-grid',
  templateUrl: './cfg-evidence-grid.component.html',
  styleUrls: ['./cfg-evidence-grid.component.scss'],
})
export class CfgEvidenceGridComponent {
  @Input()
  displayedGridView: GridView;

  @Input()
  evidence: EvidenceInstance;

  @Input()
  evidenceDistinct$: Observable<EvidenceInstance>;

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
