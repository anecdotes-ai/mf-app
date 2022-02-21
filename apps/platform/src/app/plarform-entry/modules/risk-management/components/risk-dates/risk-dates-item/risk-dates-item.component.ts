import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-risk-dates-item',
  templateUrl: './risk-dates-item.component.html',
  styleUrls: ['./risk-dates-item.component.scss'],
})
export class RiskDatesItemComponent {
  @Input()
  title: string;

  @Input()
  value: string;
}
