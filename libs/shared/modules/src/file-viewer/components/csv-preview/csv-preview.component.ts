import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnChanges, Optional, SimpleChanges } from '@angular/core';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-csv-preview',
  templateUrl: './csv-preview.component.html',
  styleUrls: ['./csv-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CsvPreviewComponent implements OnChanges {
  @Input()
  file: File;

  @HostBinding('class.use-scroll')
  parentScroll: HTMLElement;

  parsedRows: { index: number, value: string }[];

  constructor(private cd: ChangeDetectorRef, @Optional() parentPerfectScrollBar: PerfectScrollbarComponent) {
    this.parentScroll = parentPerfectScrollBar?.directiveRef.elementRef.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('file' in changes) {
      this.getParsedRows(changes['file'].currentValue);
    }
  }

  private getParsedRows(file: File): void {
    const reader = new FileReader();

    reader.onloadend = () => {
      const rows = (reader.result as string).split(/\r?\n|\r/);
      this.parsedRows = rows.map((value, index) => ({ index, value }));
      this.cd.detectChanges();
    };

    reader.readAsText(file);
  }
}
