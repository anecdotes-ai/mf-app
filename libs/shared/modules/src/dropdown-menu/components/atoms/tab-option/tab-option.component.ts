import { Component, HostBinding, Input } from '@angular/core';
import { TabSize } from '../../../types';

@Component({
  selector: 'app-tab-option',
  templateUrl: './tab-option.component.html',
  styleUrls: ['./tab-option.component.scss'],
})
export class TabOptionComponent {
  @HostBinding('class')
  private get classes(): string {
    return `font-main text-base hover:text-opacity-100 ${this.size} inline-flex flex-column justify-center items-center cursor-pointer relative`;
  }

  @Input()
  size: TabSize = 'small';

  @Input()
  progress: number;

  @Input()
  progressColor: string;

  @Input()
  svgIconPath: string;

  @Input()
  count: number;

  @HostBinding('class.font-bold')
  @HostBinding('class.text-navy-90')
  @Input()
  selected: boolean;

  isNullOrUndefined(value: unknown): boolean {
    return value === null || value === undefined;
  }
}
