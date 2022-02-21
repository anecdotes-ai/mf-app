import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { SubscriptionDetacher } from 'core/utils';
import { Subject } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { MutationObserverWrapper } from '../../services';

/** This component extends native functionality of an element.
 * Sets height of the element based on linesCount specified.
 * Adds ellipsis if inner text will overflow the element.
 */
@Component({
  selector: '[multilineTextWithElipsis]',
  templateUrl: './multiline-text-with-elipsis.component.html',
  styleUrls: ['./multiline-text-with-elipsis.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'multilineText'
})
export class MultilineTextWithElipsisComponent implements OnDestroy, OnChanges {
  private detacher = new SubscriptionDetacher();
  private changeDetectionSubject = new Subject();

  @ViewChild('container', { static: true })
  private containerElementRef: ElementRef;

  @Input()
  linesCount: number;

  @Input()
  multilineTextWithElipsis: boolean;

  @Output()
  overflowChange = new EventEmitter<boolean>(true);

  wrapperHeight: number;
  isOverflown: boolean;

  constructor(private cd: ChangeDetectorRef, private mutationObserverWrapper: MutationObserverWrapper) {}

  ngOnDestroy(): void {
    this.destroy();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('linesCount' in changes) {
      this.changeDetectionSubject.next();
    }

    if('multilineTextWithElipsis' in changes) {
      if(this.multilineTextWithElipsis) {
        this.setup();
      } else {
        this.destroy();
      }
    }
  }

  get isBlockWithTextOverflown(): boolean {
    return this.containerElementRef.nativeElement.scrollHeight > this.containerElementRef.nativeElement.offsetHeight;
  }

  private setup(): void {
    this.changeDetectionSubject.pipe(debounceTime(0), filter(() => this.multilineTextWithElipsis), this.detacher.takeUntilDetach()).subscribe(() => {
      this.calculateProps();
      this.cd.detectChanges();
    });

    this.mutationObserverWrapper
      .observeAllChanges(this.containerElementRef.nativeElement)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe(() => this.changeDetectionSubject.next());

    this.changeDetectionSubject.next();
  }

  private destroy(): void {
    this.detacher.detach();
  }

  @HostListener('window:resize')
  @HostListener('mouseover')
  @HostListener('mouseleave')
  private runCalculation(): void {
    this.changeDetectionSubject.next();
  }

  private calculateProps(): void {
    this.calculateContainerHeight();
    this.syncOverflowingState();
  }

  private calculateContainerHeight(): void {
    const containerComputedStyles = window.getComputedStyle(this.containerElementRef.nativeElement);
    const lineHeightInPx = this.getNumberWithoutUnits(containerComputedStyles.lineHeight);
    this.wrapperHeight = lineHeightInPx * this.linesCount;
    this.cd.detectChanges();
  }

  private syncOverflowingState(): void {
    const previousState = this.isOverflown;
    this.isOverflown =
      this.containerElementRef.nativeElement.scrollHeight > this.containerElementRef.nativeElement.offsetHeight;

    if (previousState !== this.isOverflown) {
      this.overflowChange.emit(this.isOverflown);
    }
  }

  private getNumberWithoutUnits(inpt: string): number {
    return parseFloat(inpt.substring(0, inpt.length - 2));
  }
}
