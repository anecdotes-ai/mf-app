import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Directive({
  selector: '[openTooltipWhenOverflowedAndHovered]',
})
export class OpenTooltipWhenOverflowedAndHoveredDirective {
  @Input()
  openTooltipWhenOverflowedAndHovered: boolean;

  @Input()
  openOnWidthOverflow: boolean;

  @Input()
  openOnHeightOverflow: boolean;

  constructor(private elementRef: ElementRef<HTMLElement>, private tooltip: NgbTooltip) {
    tooltip.triggers = null;
  }

  @HostListener('mouseover')
  private onMouseOver(): void {
    if (this.openTooltipWhenOverflowedAndHovered) {
      if (this.doesOverflowWidth() || this.doesOverflowHeight()) {
        this.tooltip.open();
      }
    }
  }

  @HostListener('mouseleave')
  private onMouseLeave(): void {
    if (this.openTooltipWhenOverflowedAndHovered && (this.openOnWidthOverflow || this.openOnHeightOverflow)) {
      if (this.openTooltipWhenOverflowedAndHovered) {
        if (this.tooltip.isOpen()) {
          this.tooltip.close();
        }
      }
    }
  }

  private doesOverflowWidth(): boolean {
    return (
      this.openOnWidthOverflow &&
      this.elementRef.nativeElement.clientWidth !== this.elementRef.nativeElement.scrollWidth
    );
  }

  private doesOverflowHeight(): boolean {
    return (
      this.openOnHeightOverflow &&
      this.elementRef.nativeElement.clientHeight !== this.elementRef.nativeElement.scrollHeight
    );
  }
}
