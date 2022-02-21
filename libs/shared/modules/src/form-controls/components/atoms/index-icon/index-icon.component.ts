import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-index-icon',
  templateUrl: './index-icon.component.html',
  styleUrls: ['./index-icon.component.scss'],
})
export class IndexIconComponent {
  @Input()
  index: number;
}
