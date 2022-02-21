import { Component, Input, OnInit } from '@angular/core';
import { RegularDateFormatMMMdyyyy } from 'core';
import { Risk } from 'core/modules/risk/models';
import { Observable } from 'rxjs';
import { RiskFacadeService } from 'core/modules/risk/services';

@Component({
  selector: 'app-risk-dates',
  templateUrl: './risk-dates.component.html',
  styleUrls: ['./risk-dates.component.scss'],
})
export class RiskDatesComponent implements OnInit {
  @Input()
  riskId: string;

  risk$: Observable<Risk>;

  dateFormat = RegularDateFormatMMMdyyyy;

  constructor(private riskFacade: RiskFacadeService) {
  }

  ngOnInit(): void {
    this.risk$ = this.riskFacade.getRiskById(this.riskId);
  }

  createDate(date: string): Date {
    return new Date(date);
  }

  buildTranslationKey(key: string): string {
    return `riskManagement.riskDates.${key}`;
  }
}
