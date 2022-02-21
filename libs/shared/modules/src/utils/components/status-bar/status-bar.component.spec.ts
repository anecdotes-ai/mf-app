import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { StatusBarDefinition } from '../../types';
import { configureTestSuite } from 'ng-bullet';
import { StatusBarComponent } from './status-bar.component';
import { By } from '@angular/platform-browser';

describe('StatusBarComponent', () => {
  configureTestSuite();

  let componentUnderTests: StatusBarComponent;
  let fixture: ComponentFixture<StatusBarComponent>;

  beforeAll(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [StatusBarComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusBarComponent);
    componentUnderTests = fixture.componentInstance;
  });

  it('should create', () => {
    expect(componentUnderTests).toBeTruthy();
  });

  describe('rendering', () => {
    beforeEach(() => {
      componentUnderTests.statusBarSections = [
        {
          cssClass: 'fake-1',
          width: 30,
          amount: 30,
        },
        {
          cssClass: 'fake-2',
          width: 45,
          amount: 45,
        },
        {
          cssClass: 'fake-3',
          width: 25,
          amount: 25,
        },
      ];
    });

    it('should render divs with classes from sections', () => {
      // Arrange
      // Act
      fixture.detectChanges();

      // Assert
      fixture.debugElement.queryAll(By.css('div')).forEach((divDebugElement, index) => {
        expect(divDebugElement.classes[componentUnderTests.statusBarSections[index].cssClass]).toBeTruthy();
      });
    });

    it('should render divs with width from sections', () => {
      // Arrange
      // Act
      fixture.detectChanges();

      // Assert
      fixture.debugElement.queryAll(By.css('div')).forEach((divDebugElement, index) => {
        expect(divDebugElement.styles['width']).toBe(componentUnderTests.statusBarSections[index].width + '%');
      });
    });
  });

  describe('definition input changes', () => {
    it('should set an empty array for statusBarSections when definition is null', () => {
      // Arrange
      // Act
      componentUnderTests.definition = null;

      // Assert
      expect(componentUnderTests.statusBarSections).toEqual([]);
    });

    it('should set an empty array for statusBarSections when definition is empty', () => {
      // Arrange
      // Act
      componentUnderTests.definition = [];

      // Assert
      expect(componentUnderTests.statusBarSections).toEqual([]);
    });

    describe('percents calculation', () => {
      let overallCount: number;
      let defintion: StatusBarDefinition[];

      beforeEach(() => {
        defintion = [
          {
            count: 34,
            cssClass: 'fake-3',
          },
          {
            count: 50,
            cssClass: 'fake-4',
          },
          {
            count: 21,
            cssClass: 'fake-6',
          },
        ];
        overallCount = defintion.reduce((prev, curr) => prev + curr.count, 0);

        componentUnderTests.definition = defintion;
      });

      it('should calculate width in percents for definition as ((statusBarSection.count / overallCount) * 100)', () => {
        // Arrange
        const secondSection = componentUnderTests.statusBarSections[1];

        // Act
        // Assert
        expect(secondSection.width).toBe((defintion[1].count / overallCount) * 100);
      });

      it('should assign cssClass for section that equals to cssClass in defintion', () => {
        // Arrange
        const secondSection = componentUnderTests.statusBarSections[1];

        // Act
        // Assert
        expect(secondSection.cssClass).toBe(defintion[1].cssClass);
      });

      it('should assign amout for section that equals to count in defintion', () => {
        // Arrange
        const secondSection = componentUnderTests.statusBarSections[1];

        // Act
        // Assert
        expect(secondSection.amount).toBe(defintion[1].count);
      });

      describe('summ of all width', () => {
        it('should equal to 100', () => {
          // Arrange
          const actualSumm = componentUnderTests.statusBarSections.reduce((prev, curr) => prev + curr.width, 0);

          // Act
          // Assert
          expect(actualSumm).toBe(100);
        });
      });
    });
  });
});
