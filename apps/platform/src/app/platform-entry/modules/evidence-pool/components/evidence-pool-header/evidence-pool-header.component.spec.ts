import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { DataSearchComponent, SearchInstancesManagerService } from 'core/modules/data-manipulation/search';
import { DataFilterManagerService } from 'core/modules/data-manipulation/data-filter';
import { FrameworkService } from 'core/modules/data/services';
import { ControlsCustomizationModalService } from 'core/modules/shared-controls/modules/customization/control/services/controls-customization-modal-service/controls-customization-modal.service';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { EvidencePoolHeaderComponent } from './evidence-pool-header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageBusService } from 'core';
import { RootTranslationkey } from './../../constants/translation-keys.constant';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-data-search',
  template: ``,
})
class MockDataSearchComponent {
  @Output()
  search = new EventEmitter();

  @Output()
  inputText = new EventEmitter<InputEvent>();
}

describe('EvidencePoolHeaderComponent', () => {
  configureTestSuite();

  let component: EvidencePoolHeaderComponent;
  let fixture: ComponentFixture<EvidencePoolHeaderComponent>;

  let filterManager: DataFilterManagerService;
  let toggled: boolean;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [EvidencePoolHeaderComponent, MockDataSearchComponent],
      providers: [
        MessageBusService,
        SearchInstancesManagerService,
        { provide: DataFilterManagerService, useValue: {} },
        { provide: ControlsCustomizationModalService, useValue: {} },
        { provide: FrameworkService, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidencePoolHeaderComponent);
    component = fixture.componentInstance;

    filterManager = TestBed.inject(DataFilterManagerService);
    filterManager.getToggledEvent = jasmine.createSpy('getToggledEvent').and.callFake(() => of(toggled));
    filterManager.close = jasmine.createSpy('close');
    filterManager.open = jasmine.createSpy('open');
    filterManager.reset = jasmine.createSpy('reset');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    it('should set false to filtersBtnDisplayed if filter is opened', () => {
      // Arrange
      toggled = true;

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.filtersBtnDisplayed).toBeFalse();
    });

    it('should set true to filtersBtnDisplayed if filter is closed', () => {
      // Arrange
      toggled = false;

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.filtersBtnDisplayed).toBeTrue();
    });

    it('should set padding-right class to host if filter is closed', () => {
      // Arrange
      toggled = false;

      // Act
      fixture.detectChanges();

      // Assert
      expect(fixture.debugElement.classes['padding-right']).toBeTruthy();
    });
  });

  describe('#filtersButtonClick', () => {
    it('should open filter', () => {
      // Act
      component.filtersButtonClick();

      // Assert
      expect(filterManager.open).toHaveBeenCalled();
    });
  });

  // describe('#resetAllFilters', () => {
  //   it('should reset filters', () => {
  //     // Act
  //     fixture.detectChanges();
  //     component.resetAllFilters();

  //     // Assert
  //     expect(filterManager.reset).toHaveBeenCalled();
  //   });

  //   it('should reset search', () => {
  //     // Arrange
  //     fixture.detectChanges();
  //     const searchComponent = fixture.debugElement.query(By.directive(DataSearchComponent))
  //       .componentInstance as DataSearchComponent;
  //     spyOn(searchComponent, 'reset');

  //     // Act
  //     component.resetAllFilters();

  //     // Assert
  //     expect(searchComponent.reset).toHaveBeenCalled();
  //   });
  // });

  describe('#buildTranslationKey', () => {
    it('should correctly build translation key', () => {
      // Arrange
      const relativeKey = 'some-key';

      // Act
      const actual = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toEqual(`${RootTranslationkey}.header.${relativeKey}`);
    });
  });

  it('should display search if isEmptyState === false', async () => {
    // Arrange
    component.isEmptyStateWithNoEvidence = false;
    fixture.detectChanges();
    // Act
    fixture.detectChanges();
    await fixture.whenStable();

    // Assert
    const itemsWrapper = fixture.debugElement.query(By.css('.items-wrapper'));
    expect(itemsWrapper).toBeTruthy();
  });
  // test that randomly fails
  //it('should not display search if isEmptyState === true', async () => {
  //  // Arrange
  //  component.isEmptyStateWithNoEvidence = true;
  //  fixture.detectChanges();
  //  // Act
  //  fixture.detectChanges();
  //  await fixture.whenStable();
  //
  //  // Assert
  //  const itemsWrapper = fixture.debugElement.query(By.css('.items-wrapper'));
  //  expect(itemsWrapper).toBeFalsy();
  //});
});
