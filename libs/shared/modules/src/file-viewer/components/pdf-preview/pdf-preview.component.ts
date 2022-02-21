import { 
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-pdf-preview',
  templateUrl: './pdf-preview.component.html',
  styleUrls: ['./pdf-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdfPreviewComponent implements OnChanges {
  @Input()
  file: File;

  @HostBinding('class.use-scroll')
  @Input()
  useScroll = false;

  previewSrc: Uint8Array;

  constructor( private cd: ChangeDetectorRef ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if ('file' in changes) {
      this.getPreviewSrc(changes['file'].currentValue);
    }
  }

  private getPreviewSrc(file: File): void {
    const reader = new FileReader();

    reader.onloadend = () => {
      this.previewSrc = reader.result as Uint8Array;
      this.cd.detectChanges();
    };

    reader.readAsArrayBuffer(file);
  }
}
