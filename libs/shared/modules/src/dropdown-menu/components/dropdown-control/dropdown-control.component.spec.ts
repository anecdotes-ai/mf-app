import { OverlayModule } from '@angular/cdk/overlay';
import { Component, DebugElement, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { DropdownControlComponent } from '../dropdown-control/dropdown-control.component';

@Component({
  selector: 'app-host',
  template: `
    <app-dropdown-control
      [data]="data"
      [displayValueSelector]="displayValueSelector"
      [context]="context"
      [titleTranslationKey]="titleTranslationKey"
      [placeholderTranslationKey]="placeholderTranslationKey"
      [searchEnabled]="searchEnabled"
      [required]="required"
      [searchFieldPlaceholder]="searchFieldPlaceholder"
      [visibleItemsCount]="visibleItemsCount"
      [selectFirstValue]="selectFirstValue"
      (select)="select($event)"
    ></app-dropdown-control>
  `,
})

export class HostComponent {
  @Input()
  data: any[];

  @Input()
  displayValueSelector: (x: any) => string;

  @Input()
  context: any;

  @Input()
  titleTranslationKey: string;

  @Input()
  placeholderTranslationKey: string;

  @Input()
  searchEnabled = false;

  @Input()
  required: boolean;

  @Input()
  searchFieldPlaceholder: string;

  @Input()
  visibleItemsCount = 4;

  @Input()
  selectFirstValue: boolean;

  select = jasmine.createSpy('select');
}

describe('DropdownControlComponent', () => {
  configureTestSuite();

  let hostComponent: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let componentUnderTest: DropdownControlComponent;
  let componentUnderTestDebugElement: DebugElement;
  let dropdownOptions: any[];

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [HostComponent, DropdownControlComponent],
      imports: [TranslateModule.forRoot(), OverlayModule, PerfectScrollbarModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    hostComponent = fixture.componentInstance;
    componentUnderTestDebugElement = fixture.debugElement.query(By.directive(DropdownControlComponent));
    componentUnderTest = componentUnderTestDebugElement.componentInstance;
    dropdownOptions = ['fake1', 'fake2', 'fake3', 'fake4'];
    hostComponent.data = dropdownOptions;
    hostComponent.selectFirstValue = true;
    hostComponent.displayValueSelector = (x) => x;
  });

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  describe('buttonHeight property', () => {
    it('should be set to 40', () => {
      // Arrange
      // Act
      // Assert
      expect(componentUnderTest.buttonHeight).toBe(40);
    });
  });

  it('should create', () => {
    expect(hostComponent).toBeTruthy();
  });

  it('should have class block', async () => {
    // Arrange
    // Act
    await detectChanges();

    // Assert
    expect(componentUnderTestDebugElement.classes['block']).toBeTruthy();
  });

  describe('selectFirstValue input', () => {
    it('should be true by default', () => {
      // Arrange
      // Act
      // Assert
      expect(componentUnderTest.selectFirstValue).toBeTrue();
    });
  });

  describe('visibleItemsCount', () => {
    it('should be set to 4 by defaul', () => {
      // Arrange
      // Act
      // Assert
      expect(componentUnderTest.buttonHeight).toBe(40);
    });

    describe('when changed', () => {
      beforeEach(() => {
        hostComponent.visibleItemsCount = 34;
      });

      describe('listMaxHeight', () => {
        it('should be set as multiply of visibleItemsCount and buttonHeight', async () => {
          // Arrange
          // Act
          await detectChanges();

          // Assert
          expect(componentUnderTest.listMaxHeight).toBe(
            hostComponent.visibleItemsCount * componentUnderTest.buttonHeight
          );
        });
      });
    });
  });
});
