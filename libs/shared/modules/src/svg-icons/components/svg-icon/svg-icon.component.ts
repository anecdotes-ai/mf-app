import { Component, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { LoggerService } from 'core/services/logger/logger.service';
import { SvgRegistryService } from '../../services';

@Component({
  selector: 'svg-icon',
  template: '',
  styleUrls: ['./svg-icon.component.scss'],
})
export class SvgIconComponent implements OnChanges {
  @Input()
  src: string;

  @Input()
  stretch: boolean;

  @Input()
  svgClass: string;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private svgRegistry: SvgRegistryService,
    private logger: LoggerService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('src' in changes) {
      this.elementRef.nativeElement.innerHTML = null;
      this.appendSvg();
    }
  }

  private appendSvg(): void {
    if (this.src) {
      try {
        const svg = this.svgRegistry.getRequiredSvgElement(this.src);
        this.elementRef.nativeElement.appendChild(svg);
      } catch (e) {
        this.logger.error(e);
      }
    }
  }
}
