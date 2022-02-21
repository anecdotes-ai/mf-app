/* tslint:disable:no-unused-variable */
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TabSize } from '../../../types';
import { TabOptionComponent } from './tab-option.component';

@Component({
  selector: 'app-host',
  template: `
    <app-tab-option
      [size]="size"
      [progress]="progress"
      [progressColor]="progressColor"
      [svgIconPath]="svgIconPath"
      [count]="count"
      [selected]="selected"
    >
      {{ text }}
    </app-tab-option>
  `,
})
class HostComponent {
  size: TabSize;
  progress: number;
  progressColor: string;
  svgIconPath: string;
  count: number;
  selected: boolean;

  text: string;
}

describe('TabOptionComponent', () => {
  let hostComponent: HostComponent;
  let component: TabOptionComponent;
  let fixture: ComponentFixture<HostComponent>;

  function getTabOptionDebugElement(): DebugElement {
    return fixture.debugElement.query(By.directive(TabOptionComponent));
  }

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TabOptionComponent, HostComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    hostComponent = fixture.componentInstance;
    component = getTabOptionDebugElement().componentInstance;
    hostComponent.text = 'some fake text';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('circle progress', () => {
    [0, 10, 15].forEach((progressTestCase) => {
      it(`should be rendered when progress input is "${progressTestCase}"`, () => {
        // Arrange
        hostComponent.progress = progressTestCase;

        // Act
        fixture.detectChanges();

        // Assert
        expect(getTabOptionDebugElement().query(By.css('app-circle-progress'))).toBeDefined();
      });
    });

    [null, undefined, -1, -10, -15].forEach((progressTestCase) => {
      it(`should not be rendered when progress input is "${progressTestCase}"`, () => {
        // Arrange
        hostComponent.progress = progressTestCase;

        // Act
        fixture.detectChanges();

        // Assert
        expect(getTabOptionDebugElement().query(By.css('app-circle-progress'))).toBeFalsy();
      });
    });
  });

  describe('selected input', () => {
    it('should append selection-mark element', () => {
      // Arrange
      hostComponent.selected = true;

      // Act
      fixture.detectChanges();

      // Assert
      expect(getTabOptionDebugElement().query(By.css('.selection-mark'))).toBeTruthy();
    });

    it('should remove "selected" class for host if false', () => {
      // Arrange
      hostComponent.selected = false;

      // Act
      fixture.detectChanges();

      // Assert
      expect(getTabOptionDebugElement().query(By.css('.selection-mark'))).toBeFalsy();
    });
  });

  describe('count input', () => {
    function getCountDebugElement(): DebugElement {
      return getTabOptionDebugElement().query(By.css('span.count'));
    }

    [0, 1, 59, 333].forEach((countTestCase) => {
      it(`should be rendered next to text when is equal to "${countTestCase}"`, () => {
        // Arrange
        hostComponent.count = countTestCase;

        // Act
        fixture.detectChanges();

        // Assert
        expect(getCountDebugElement()).toBeTruthy();
        expect((getCountDebugElement().nativeElement as HTMLElement).innerText).toBe(`(${countTestCase})`);
      });
    });

    [null, undefined, -1, -59, -333].forEach((countTestCase) => {
      it(`should not be rendered next to text when is equal to "${countTestCase}"`, () => {
        // Arrange
        hostComponent.count = countTestCase;

        // Act
        fixture.detectChanges();

        // Assert
        expect(getCountDebugElement()).toBeFalsy();
      });
    });
  });

  describe('ng-content', () => {
    it('should be rendered in span.text', () => {
      // Arrange
      hostComponent.text = 'fake text';

      // Act
      fixture.detectChanges();

      // Assert
      expect((getTabOptionDebugElement().query(By.css('span.text')).nativeElement as HTMLElement).innerText).toBe(
        hostComponent.text
      );
    });
  });

  describe('svg-icon', () => {
    beforeEach(() => {
      hostComponent.svgIconPath = 'fake';
    });

    function getSvgIconTestCase(): DebugElement {
      return getTabOptionDebugElement().query(By.css('svg-icon'));
    }

    [0, 3, 5, 9].forEach((progressTestCase) => {
      it(`should not be rendered when progress is ${progressTestCase}`, () => {
        // Arrange
        hostComponent.progress = progressTestCase;

        // Act
        fixture.detectChanges();

        // Assert
        expect(getSvgIconTestCase()).toBeFalsy();
      });
    });

    it(`should not be rendered when svgIconPath is not defined`, () => {
      // Arrange
      hostComponent.svgIconPath = undefined;

      // Act
      fixture.detectChanges();

      // Assert
      expect(getSvgIconTestCase()).toBeFalsy();
    });

    [null, undefined].forEach((progressTestCase) => {
      it(`should be rendered when progress is ${progressTestCase}`, () => {
        // Arrange
        hostComponent.progress = progressTestCase;

        // Act
        fixture.detectChanges();

        // Assert
        expect(getSvgIconTestCase()).toBeTruthy();
      });
    });
  });
});
