import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input, OnInit
} from '@angular/core';
import { RiskFacadeService } from 'core/modules/risk/services';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar/lib/perfect-scrollbar.interfaces';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-risk-supporting-documents',
  templateUrl: './risk-supporting-documents.component.html',
  styleUrls: ['./risk-supporting-documents.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RiskSupportingDocumentsComponent implements OnInit {
  @HostBinding('class')
  private classes = 'flex flex-col bg-navy-10 rounded-md max-h-60';

  evidenceIds$: Observable<string[]>;
  scrollbarConfig: PerfectScrollbarConfigInterface = {
    wheelPropagation: false,
  };

  @Input()
  riskId: string;

  constructor(private riskFacadeService: RiskFacadeService) { }

  ngOnInit(): void {
    this.evidenceIds$ = this.riskFacadeService
      .getRiskById(this.riskId).pipe(map((risk) => risk.evidence_ids));
  }

  buildTranslationKey(relativeKey: string): string {
    return `riskManagement.supportingDocuments.${relativeKey}`;
  }
}
