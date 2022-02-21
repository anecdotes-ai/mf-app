import { Directive, ElementRef, Input, OnChanges, OnDestroy, Optional, SimpleChanges } from '@angular/core';
import { NgbPopover, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { fromEvent } from 'rxjs';
import { WindowHelperService } from 'core/services/window-helper/window-helper.service';
import { delayedPromise } from 'core/utils';
import { SubscriptionDetacher } from 'core/utils';
import { filter } from 'rxjs/operators';

export class ClassIdProvider {
  private static tooltipIndex = 0;
  private static popoverIndex = 0;

  getNextTooltipClassId(): string {
    const classId = `x-tooltip-${ClassIdProvider.tooltipIndex}`;
    ClassIdProvider.tooltipIndex++;
    return classId;
  }

  getNextPopoverClassId(): string {
    const classId = `x-popover-${ClassIdProvider.popoverIndex}`;
    ClassIdProvider.popoverIndex++;
    return classId;
  }
}

@Directive({
  selector: '[keepOnHover]',
})
export class KeepTooltipOrPopoverOnHoverDirective implements OnDestroy, OnChanges {
  private static delay = 100;

  private isHostHovered: boolean;
  private host: HTMLElement;
  private classId: string;
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  private tooltipDetacher: SubscriptionDetacher = new SubscriptionDetacher();
  private tooltipOrPopover: NgbTooltip | NgbPopover;
  private isTooltipOrPopoverHovered: boolean;
  private forceClose = false;

  @Input()
  keepOnHover: boolean;

  @Input()
  closeOnClick = false;

  constructor(
    @Optional() classIdProvider: ClassIdProvider,
    @Optional() tooltip: NgbTooltip,
    @Optional() popover: NgbPopover,
    htmlRef: ElementRef,
    private windowHelper: WindowHelperService
  ) {
    if (!classIdProvider) {
      // This workaround was made for testablity
      classIdProvider = new ClassIdProvider();
    }

    if (tooltip) {
      this.classId = classIdProvider.getNextTooltipClassId();
      tooltip.tooltipClass += this.concatClasses(tooltip.tooltipClass, this.classId);
      this.tooltipOrPopover = tooltip;
    } else if (popover) {
      this.classId = classIdProvider.getNextPopoverClassId();
      popover.popoverClass += this.concatClasses(popover.popoverClass, this.classId);
      this.tooltipOrPopover = popover;
    }

    if (this.tooltipOrPopover) {
      this.tooltipOrPopover.triggers = null;
    }

    this.host = htmlRef.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('keepOnHover' in changes) {
      this.destroyAllSubscriptions();

      if (this.keepOnHover) {
        fromEvent(this.host, 'mouseenter')
          .pipe(this.detacher.takeUntilDetach())
          .subscribe(this.hostMouseEnter.bind(this));
        fromEvent(this.host, 'mouseleave')
          .pipe(this.detacher.takeUntilDetach())
          .subscribe(this.hostMouseLeave.bind(this));
      }
    }
  }

  ngOnDestroy(): void {
    this.destroyAllSubscriptions();
  }

  private hostMouseEnter(): void {
    if (!this.tooltipOrPopover.isOpen()) {
      this.tooltipOrPopover.open();

      const tooltipOrPopoverWindow = this.windowHelper.getWindow().document.querySelector(`.${this.classId}`);

      if (tooltipOrPopoverWindow) {
        fromEvent(tooltipOrPopoverWindow, 'mouseenter')
          .pipe(this.tooltipDetacher.takeUntilDetach())
          .subscribe(this.tooltipOrPopoverMouseEnter.bind(this));

        fromEvent(tooltipOrPopoverWindow, 'mouseleave')
          .pipe(this.tooltipDetacher.takeUntilDetach())
          .subscribe(this.tooltipOrPopoverMouseLeave.bind(this));

        fromEvent(tooltipOrPopoverWindow, 'click')
          .pipe(filter(() => this.closeOnClick), this.tooltipDetacher.takeUntilDetach())
          .subscribe(this.tooltipOrPopoverMouseClick.bind(this));
      }
    }

    this.isHostHovered = true;
  }

  private async hostMouseLeave(): Promise<void> {
    this.isHostHovered = false;
    await delayedPromise(KeepTooltipOrPopoverOnHoverDirective.delay);
    this.closeToolTipOrPopover();
  }

  private tooltipOrPopoverMouseEnter(): void {
    this.isTooltipOrPopoverHovered = true;
  }

  private tooltipOrPopoverMouseClick(): void {
    if (this.closeOnClick) {
      this.forceClose = true;
    }
    try {
      this.closeToolTipOrPopover();
    } finally {
      this.forceClose = false;
    }
  }

  private async tooltipOrPopoverMouseLeave(): Promise<void> {
    this.isTooltipOrPopoverHovered = false;
    await delayedPromise(KeepTooltipOrPopoverOnHoverDirective.delay);
    this.closeToolTipOrPopover();
  }

  private closeToolTipOrPopover(): void {
    if ((!this.isTooltipOrPopoverHovered && !this.isHostHovered) || this.forceClose) {
      this.tooltipOrPopover.close();
      this.tooltipDetacher.detach(false);
    }
  }

  private destroyAllSubscriptions(): void {
    this.detacher.detach();
    this.tooltipDetacher.detach();
  }

  private concatClasses(classes: string, classToAdd: string): string {
    if (classes) {
      return ` ${classToAdd}`;
    }

    return classToAdd;
  }
}
