import { Component, Input, OnInit } from '@angular/core';

import { EvidenceLike } from 'core/modules/data/models';
import { Observable } from 'rxjs';
import { EvidenceFacadeService } from 'core/modules/data/services';

@Component({
  selector: 'app-evidence-view-item',
  templateUrl: './evidence-view-item.component.html',
  styleUrls: ['./evidence-view-item.component.scss'],
})
export class EvidenceViewItemComponent implements OnInit {
  @Input()
  evidenceId: string;

  evidence$: Observable<EvidenceLike>;

  constructor(private evidenceFacade: EvidenceFacadeService) {}

  ngOnInit(): void {
    this.evidence$ = this.evidenceFacade.getEvidenceLike(this.evidenceId);
  }
}
