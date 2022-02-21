/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement, Input } from '@angular/core';

import { PreviewCellComponent } from './preview-cell.component';
import { configureTestSuite } from 'ng-bullet';
import { GapMarkComponent } from 'core/modules/gap/components';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-searchable-text',
  template: '',
})
class SearchableTextMockComponent {
  @Input()
  text: string;
}

@Component({
  selector: 'app-host',
  template: `
    <app-preview-cell
      [cellValue]="cellValue"
      [viewFullData]="viewFullData"
      [viewType]="viewType"
      [cellGapped]="cellGapped"
      [isFirst]="isFirst"
    ></app-preview-cell>
  `,
})
class HostComponent {
  @Input()
  cellValue: string | string[];

  @Input()
  viewFullData: boolean;

  @Input()
  viewType: string;

  @Input()
  cellGapped: boolean;

  @Input()
  isFirst: boolean;
}

describe('PreviewCellComponent', () => {
  configureTestSuite();

  let hostComponent: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let componentUnderTest: PreviewCellComponent;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchableTextMockComponent, HostComponent, PreviewCellComponent, GapMarkComponent],
      imports: [TranslateModule.forRoot()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    hostComponent = fixture.componentInstance;
    componentUnderTest = fixture.debugElement.query(By.directive(PreviewCellComponent)).componentInstance;
    fixture.detectChanges();
  });

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function getPreviewCellDebugElement(): DebugElement {
    return fixture.debugElement.query(By.directive(PreviewCellComponent));
  }

  it('should create', () => {
    expect(hostComponent).toBeTruthy();
    expect(componentUnderTest).toBeTruthy();
  });

  describe('full-data class', () => {
    it('should be set when viewFullData input is true', async () => {
      // Arrange
      hostComponent.viewFullData = true;

      // Act
      await detectChanges();

      // Assert
      expect(getPreviewCellDebugElement().classes['full-data']).toBeTruthy();
    });

    it('should not be set when viewFullData input is false', async () => {
      // Arrange
      hostComponent.viewFullData = false;

      // Act
      await detectChanges();

      // Assert
      expect(getPreviewCellDebugElement().classes['full-data']).toBeFalsy();
    });
  });

  describe('viewType input', () => {
    ['list', 'log', 'cfg', 'url'].forEach((viewType) => {
      it(`should set ${viewType} class`, async () => {
        // Arrange
        hostComponent.viewType = viewType;

        // Act
        await detectChanges();

        // Assert
        expect(getPreviewCellDebugElement().classes[viewType]).toBeTruthy();
      });
    });
  });

  describe('span with cell', () => {
    it('should display span with cell if viewFullData is false', async () => {
      // Arrange
      hostComponent.viewFullData = false;
      hostComponent.cellValue = 'fake-cell';

      // Act
      await detectChanges();
      const expectedSpan = getPreviewCellDebugElement().query(By.css('span'));

      // Assert
      expect(expectedSpan).toBeTruthy();
      expect(expectedSpan.nativeElement.innerText).toBe(hostComponent.cellValue);
    });
  });

  describe('&nbsp; (non-breaking space)', () => {
    [null, undefined, ''].forEach((testCase) => {
      it(`should be dispayed when viewFullData is true and cell is '${testCase}'`, async () => {
        // Arrange
        hostComponent.cellValue = testCase;
        hostComponent.viewFullData = true;

        // Act
        await detectChanges();

        // Assert
        expect(getPreviewCellDebugElement().query(By.css('span.main-span')).nativeElement.innerText).toBe(
          String.fromCharCode(160)
        );
      });
    });
  });

  describe('app-searchable-text', () => {
    beforeEach(() => {
      hostComponent.viewFullData = true;
      hostComponent.cellValue = 'fake-string';
    });

    it('should be displayed when viewFullData is true and cell is not empty string', async () => {
      // Arrange
      // Act
      await detectChanges();

      // Assert
      expect(getPreviewCellDebugElement().query(By.directive(SearchableTextMockComponent))).toBeTruthy();
    });

    [
      { viewFullData: true, cell: '' },
      { viewFullData: false, cell: 'not-empty-string' },
    ].forEach((testCase) => {
      it(`should not be displayed when viewFullData is ${testCase.viewFullData} and cell is '${testCase.cell}'`, async () => {
        // Arrange
        hostComponent.viewFullData = testCase.viewFullData;
        hostComponent.cellValue = testCase.cell;

        // Act
        await detectChanges();

        // Assert
        expect(getPreviewCellDebugElement().query(By.directive(SearchableTextMockComponent))).toBeFalsy();
      });
    });
  });

  describe('resolveCellValue method', () => {
    describe(`cellValue is array`, () => {
      it('should return cellValue and viewFullData is true', async () => {
        // Arrange
        hostComponent.viewFullData = true;
        hostComponent.cellValue = ['fake'];

        // Act
        await detectChanges();
        const actualReturnValue = componentUnderTest.resolveCellValue();

        // Assert
        expect(actualReturnValue).toBe(hostComponent.cellValue);
      });

      it('should return array with single value that joins array elements when viewFullData is false', async () => {
        // Arrange
        hostComponent.viewFullData = false;
        hostComponent.cellValue = ['foo', 'bar'];

        // Act
        await detectChanges();
        const actualReturnValue = componentUnderTest.resolveCellValue();

        // Assert
        expect(actualReturnValue).toEqual(['foo,bar']);
      });
    });

    describe(`cellValue is not array`, () => {
      it('should return array with one element of cellValue', async () => {
        hostComponent.cellValue = 'foo';

        // Act
        await detectChanges();
        const actualReturnValue = componentUnderTest.resolveCellValue();

        // Assert
        expect(actualReturnValue).toEqual([hostComponent.cellValue]);
      });
    });

    [true, false].forEach((viewFullData) => {
      describe(`obj arg is array with at least one object as entry, viewFullData is ${viewFullData}, takeFirstValue is true`, () => {
        it('should return first value from array', async () => {
          hostComponent.viewFullData = viewFullData;
          hostComponent.cellValue = [{ foo: 'foo' }, 'bar'] as any;

          // Act
          await detectChanges();
          const actualReturnValue = componentUnderTest.resolveCellValue();

          // Assert
          expect(actualReturnValue).toEqual([JSON.stringify([{ foo: 'foo' }, 'bar'], null, 2)]);
        });
      });
    });

    describe('gap mark show', () => {
      it('gap mark should appear', async () => {
        hostComponent.cellGapped = true;
        hostComponent.isFirst = true;
        await detectChanges();
        const appMark = fixture.debugElement.nativeElement.querySelector('app-gap-mark');
        expect(appMark).not.toBeNull();
      });

      [{cellGapped: true, isFirst: false},
        {cellGapped: false, isFirst: false},
        {cellGapped: false, isFirst: true}].forEach((values) => {
        it('when isFirst is ${values.isFirst} and cellGapped ${values.cellGapped}, gap mark shouldnt appear', async () => {
          hostComponent.cellGapped = values.cellGapped;
          hostComponent.isFirst = values.isFirst;
          await detectChanges();
          const appMark = fixture.debugElement.nativeElement.querySelector('app-gap-mark');
          expect(appMark).toBeNull();
        });
      });
    });
  });
});
