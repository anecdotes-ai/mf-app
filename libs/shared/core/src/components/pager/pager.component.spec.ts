import { SimpleChanges } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import { PagerComponent } from './pager.component';

describe('PagerComponent', () => {
  configureTestSuite();

  let component: PagerComponent;
  let fixture: ComponentFixture<PagerComponent>;
  let data: any[];
  let changes: SimpleChanges;

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const getPageElement = (page: number) => {
    return fixture.debugElement.query(By.css(`.page:nth-child(${page})`)).nativeElement;
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const getPagerButtonElement = (page: number) => {
    return fixture.debugElement.query(By.css(`.pager button:nth-child(${page})`)).nativeElement;
  };

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [PagerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagerComponent);
    component = fixture.componentInstance;
    data = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    changes = {
      data: {
        previousValue: undefined,
        firstChange: true,
        currentValue: data,
        isFirstChange: () => true,
      },
    };

    component.itemsPerPage = 5;
    component.data = data;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnChanges', () => {
    it('should set currentPageIndex to 0 if data in changes', () => {
      // Arrange
      component.currentPageIndex = 5;

      // Act
      component.ngOnChanges(changes);

      // Assert
      expect(component.currentPageIndex).toEqual(0);
    });

    it('should correctly split pages if data in changes', () => {
      // Arrange

      // Act
      component.ngOnChanges(changes);

      // Assert
      expect(component.pages).toEqual([
        ['1', '2', '3', '4', '5'],
        ['6', '7', '8', '9', '10'],
      ]);
    });

    it('should correctly set multipage class on host if data in changes and pages count are greater than 1', () => {
      // Arrange

      // Act
      component.ngOnChanges(changes);
      fixture.detectChanges();

      // Assert
      expect(fixture.debugElement.nativeElement.classList.contains('multipage')).toBeTrue();
    });
  });

  describe('#goToPage', () => {
    it('should set correct page', () => {
      // Arrange

      // Act
      component.goToPage(4);

      // Assert
      expect(component.currentPageIndex).toEqual(4);
    });
  });

  describe('css class bindings', () => {
    it('should set hidden-page class to all pages except active one', () => {
      // Arrange

      // Act
      component.ngOnChanges(changes);
      fixture.detectChanges();

      // Assert
      const firstPage = getPageElement(1);
      const secondPage = getPageElement(2);
      expect(firstPage.classList.contains('hidden-page')).toBeFalse();
      expect(secondPage.classList.contains('hidden-page')).toBeTrue();
    });

    it('should set active-page class to active pager button', () => {
      // Arrange

      // Act
      component.ngOnChanges(changes);
      fixture.detectChanges();

      // Assert
      const firstPagerButton = getPagerButtonElement(1);
      const secondPagerButton = getPagerButtonElement(2);
      expect(firstPagerButton.classList.contains('active-page')).toBeTrue();
      expect(secondPagerButton.classList.contains('active-page')).toBeFalse();
    });
  });
});
