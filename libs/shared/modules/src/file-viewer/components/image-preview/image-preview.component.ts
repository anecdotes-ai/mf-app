import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImagePreviewComponent implements OnChanges {
  @Input()
  file: File;

  previewSrc: SafeUrl;

  constructor(private cd: ChangeDetectorRef, private domSanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('file' in changes) {
      this.getPreviewSrc(changes['file'].currentValue);
    }
  }

  private getPreviewSrc(file: File): void {
    const reader = new FileReader();

    reader.onloadend = () => {
      this.previewSrc = this.domSanitizer.bypassSecurityTrustUrl(reader.result as string);
      this.cd.detectChanges();
    };

    reader.readAsDataURL(file);
  }
}
