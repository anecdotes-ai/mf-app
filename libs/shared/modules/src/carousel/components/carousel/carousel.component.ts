import { AnimationBuilder, AnimationFactory, animate, style, AnimationPlayer } from '@angular/animations';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CarouselItemDirective } from '../../directives/carousel-item.directive';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselComponent implements AfterViewInit {
  private slideWidth: number;
  private animationPlayer: AnimationPlayer;
  private slidesToDisplay: number;

  @ViewChildren('slideItem', { read: ElementRef })
  private itemsElements: QueryList<ElementRef<HTMLElement>>;

  @ViewChild('carouselInner')
  private carouselInner: ElementRef<HTMLUListElement>;

  @HostBinding('class')
  private classes = 'grow w-full flex';

  carouselWrapperStyles: { [key: string]: number | string } = {};
  currentWrapperWidth: number;
  currentSlideIndex = 0;

  @ContentChildren(CarouselItemDirective)
  slides: QueryList<CarouselItemDirective>;

  @Input()
  buttonWidth = 50;

  @Input()
  columnGap = 0; // Space beetweeen slides

  @Input()
  carouselMaxWidthInPercents = 100;

  @Input()
  animationDuration = 300; // (ms) Default value taken from navigation-bar component

  @Input()
  animationType = 'linear';

  get setDisablingToNextButton(): boolean {
    return this.isDisabled().includes('next');
  }

  get setDisablingToPreviousButton(): boolean {
    return this.isDisabled().includes('prev');
  }

  constructor(private builder: AnimationBuilder, private cd: ChangeDetectorRef, private elRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.setCurrentWrapperWidth();
    this.cd.detectChanges();
    this.setItemWidth();
    this.setCarouselWidth();
  }

  /**
   * Buttons listen to this method and set 'disabled' mode using the condition
   */
  isDisabled(): string {
    switch (true) {
      case this.currentSlideIndex === 0 && this.currentSlideIndex + this.slidesToDisplay >= this.slides.length:
        return 'prev next';

      case this.currentSlideIndex + this.slidesToDisplay === this.slides.length:
        return 'next';

      case this.currentSlideIndex === 0:
        return 'prev';

      default:
        return '';
    }
  }

  /**
   * Method toggles the previous slide
   */
  prev(): void {
    if (this.currentSlideIndex === 0) {
      return;
    }

    this.currentSlideIndex--;
    this.onAnimate();
  }

  /**
   * Method toggles the next slide
   */
  next(): void {
    if (this.currentSlideIndex + this.slidesToDisplay === this.slides.length) {
      return;
    }

    this.currentSlideIndex++;
    this.onAnimate();
  }

  /**
   * Method listens for window resizing and rebuilds the carousel
   */
  @HostListener('window:resize', ['$event'])
  private onResize(): void {
    this.carouselWrapperStyles = { width: `${this.slideWidth}px` };
    this.cd.detectChanges();
    this.setCurrentWrapperWidth();
    this.setCarouselWidth();
    this.cd.detectChanges();
  }

  /**
   * Method sets the width of the carousel wrapper (inlude buttons)
   */
  private setCurrentWrapperWidth(): void {
    const wrapperWidth = (this.elRef.nativeElement as HTMLElement).getBoundingClientRect().width;
    if (this.carouselMaxWidthInPercents < 100) {
      this.currentWrapperWidth = (wrapperWidth / 100) * this.carouselMaxWidthInPercents;
    } else {
      this.currentWrapperWidth = wrapperWidth;
    }
  }

  /**
   * Method sets the width of the carousel
   * Listen window resize and set default state of the carousel (set currentSlide = 0) if the window is larger than it was
   */
  private setCarouselWidth(): void {
    const slidesCount: number = this.countSlidesToDisplay(this.currentWrapperWidth);
    this.slidesToDisplay = slidesCount;
    this.carouselWrapperStyles = {
      width: `${this.slideWidth * slidesCount}px`,
      maxWidth: `${this.slideWidth * this.itemsElements.length}px`,
    };

    this.cd.detectChanges();

    if (this.currentSlideIndex + slidesCount > this.itemsElements.length) {
      this.currentSlideIndex = 0;
      this.onAnimate();
    }
  }

  /**
   * Method sets the width of a slide
   */
  private setItemWidth(): void {
    this.slideWidth = this.itemsElements.first.nativeElement.getBoundingClientRect().width + this.columnGap;
  }

  /**
   * Method calculates the number of slides to be displayed
   */
  private countSlidesToDisplay(width: number): number {
    return Math.trunc((width - this.buttonWidth * 2) / this.slideWidth);
  }

  /**
   * Method calculates the offset and runs the animation
   */
  private onAnimate(): void {
    const offset = this.currentSlideIndex * this.slideWidth;
    const myAnimation: AnimationFactory = this.buildAnimation(offset);

    this.animationPlayer = myAnimation.create(this.carouselInner.nativeElement);
    this.animationPlayer.play();
  }

  private buildAnimation(offset: number): AnimationFactory {
    return this.builder.build([
      animate(this.animationDuration + 'ms ' + this.animationType, style({ transform: `translateX(-${offset}px)` })),
    ]);
  }
}
