import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-newly-added-label',
  templateUrl: './newly-added-label.component.html',
  styleUrls: ['./newly-added-label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewlyAddedLabelComponent {
  constructor() {}
}
