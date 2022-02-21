import { AnimationBuilder } from '@angular/animations';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarouselComponent } from './carousel.component';
import { CarouselItemDirective } from '../../directives/carousel-item.directive';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { configureTestSuite } from 'ng-bullet';

@Component({
  selector: 'test-cmp',
  providers: [CarouselItemDirective],
  template: `
    <section class="wrapper-sec" style="width: 400px;">
      <app-carousel #carousel>
        <ng-container *ngFor="let item of items">
          <ng-container *carouselItem>
            <div class="slide">{{ item.title }}</div>
          </ng-container>
        </ng-container>
      </app-carousel>
    </section>
  `,
  styles: [
    `
      .slide {
        width: 100px;
        height: 100px;
        background-color: red;
      }
    `,
  ],
})
class TestWrapperComponent {
  @ViewChild('carousel') carouselRef: CarouselComponent;

  items = [{ title: 'Slide 1' }, { title: 'Slide 2' }, { title: 'Slide 3' }];
}

describe('CarouselComponent', () => {
  configureTestSuite();

  let fixture: ComponentFixture<TestWrapperComponent>;
  let wrapperComponent: TestWrapperComponent;

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
  }

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarouselComponent, TestWrapperComponent, CarouselItemDirective],
      providers: [{ provide: AnimationBuilder, useClass: NoopAnimationsModule }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [NoopAnimationsModule],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(TestWrapperComponent);
    wrapperComponent = fixture.debugElement.componentInstance;
  });

  function getButton(i: number): HTMLButtonElement {
    return fixture.debugElement.queryAll(By.css('.btn-item'))[i].nativeElement as HTMLButtonElement;
  }

  it('should create wrapper', () => {
    // Arrange
    // Act
    detectChanges();

    // Assert
    expect(wrapperComponent).toBeTruthy();
  });

  it('should wrap carousel component into wrapper component', () => {
    // Arrange
    const carousel = fixture.debugElement.query(By.css('.carousel-wrap')).nativeElement;

    // Act
    // Assert
    expect(carousel).toBeDefined();
  });

  describe('#isDisabled method', () => {
    beforeEach(() => {
      detectChanges();
    });

    it('should return "prev next" when all slides displayed', () => {
      // Arrange
      // Act
      const result = wrapperComponent.carouselRef.isDisabled();

      // Assert
      expect(result).toBe('prev next');
    });

    it('should set "disabled" attribute to buttons', () => {
      // Arrange
      // Act
      const button: HTMLButtonElement = getButton(0);

      // Assert
      expect(button.getAttribute('disabled')).toEqual('');
    });

    it('should remove "disabled" attribute from "next button" if all slides don`t displayed', () => {
      // Arrange
      const wrap: HTMLElement = fixture.debugElement.query(By.css('.wrapper-sec')).nativeElement;
      wrap.style.width = '200px';

      // Act
      window.dispatchEvent(new Event('resize'));

      const button = getButton(1);

      // Assert
      expect(button.getAttribute('disabled')).toBeNull();
    });
  });

  describe('#prev method', () => {
    it('should prevent any changes if current slide equal 0', () => {
      // Arrange
      detectChanges();
      const currentSlide = wrapperComponent.carouselRef.currentSlideIndex;

      // Act
      wrapperComponent.carouselRef.prev();
      const newCurrentSlide = wrapperComponent.carouselRef.currentSlideIndex;

      // Assert
      expect(newCurrentSlide).toBe(0);
      expect(newCurrentSlide).toEqual(currentSlide);
    });

    it('should flip to previous slide if current slide index is more than 0 during resizing', () => {
      // Arrange
      // Act
      detectChanges();

      const wrap: HTMLElement = fixture.debugElement.query(By.css('.wrapper-sec')).nativeElement;
      wrap.style.width = '100px';

      window.dispatchEvent(new Event('resize'));

      const nextButton = getButton(1);
      nextButton.click();

      const currentSlide = wrapperComponent.carouselRef.currentSlideIndex;
      detectChanges();

      const prevButton = getButton(0);
      prevButton.click();

      // Assert
      expect(wrapperComponent.carouselRef.currentSlideIndex).toBe(currentSlide - 1);
    });
  });

  describe('#next method', () => {
    it('should prevent any changes all slides displayed', () => {
      // Arrange
      detectChanges();
      const currentSlide = wrapperComponent.carouselRef.currentSlideIndex;

      // Act
      wrapperComponent.carouselRef.next();
      const newCurrentSlide = wrapperComponent.carouselRef.currentSlideIndex;

      // Assert
      expect(newCurrentSlide).toBe(0);
      expect(newCurrentSlide).toEqual(currentSlide);
    });

    it('should flip to next slide', () => {
      // Arrange
      // Act
      detectChanges();

      const wrap: HTMLElement = fixture.debugElement.query(By.css('.wrapper-sec')).nativeElement;
      wrap.style.width = '100px';

      window.dispatchEvent(new Event('resize'));

      const nextButton = getButton(1);
      nextButton.click();

      const currentSlide = wrapperComponent.carouselRef.currentSlideIndex;

      // Assert
      expect(currentSlide).toBe(1);
    });
  });

  describe('#setCurrentWrapperWidth method', () => {
    it('should calculate right wrapper width if carousel max width < 100%', () => {
      // Arrange
      // Act
      detectChanges();

      const wrap: number = (fixture.debugElement.query(By.css('section'))
        .nativeElement as HTMLElement).getBoundingClientRect().width;

      wrapperComponent.carouselRef.carouselMaxWidthInPercents = 50;
      window.dispatchEvent(new Event('resize'));

      // Assert
      expect(wrapperComponent.carouselRef.currentWrapperWidth).toBe(wrap / 2);
    });
  });

  describe('#setCarouselWidth method', () => {
    it('should set currentSlide equal 0 if carousel show all slides after window resize', () => {
      // Arrange
      // Act
      detectChanges();

      wrapperComponent.carouselRef.currentSlideIndex = 1;

      window.dispatchEvent(new Event('resize'));

      // Assert
      expect(wrapperComponent.carouselRef.currentSlideIndex).toBe(0);
    });
  });
});
