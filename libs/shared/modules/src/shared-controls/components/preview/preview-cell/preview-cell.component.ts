import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-preview-cell',
  templateUrl: './preview-cell.component.html',
  styleUrls: ['./preview-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewCellComponent {
  @Input()
  cellValue: string | string[];

  @HostBinding('class.full-data')
  @Input()
  viewFullData: boolean;

  @HostBinding('class')
  @Input()
  viewType: 'list' | 'log' | 'cfg' | 'url';

  @Input()
  cellGapped?: boolean;

  @Input()
  tooltipText?: string;

  @Input()
  isFirst?: boolean

  resolveCellValue(): string[] {
    if (Array.isArray(this.cellValue)) {
      if (this.cellValue.some((entry) => typeof entry === 'object' && entry !== null)) {
        return [JSON.stringify(this.cellValue, null, 2)];
      }

      if (!this.viewFullData) {
        return [this.cellValue.join(',')];
      }

      return this.cellValue;
    }

    return [this.cellValue];
  }
}
