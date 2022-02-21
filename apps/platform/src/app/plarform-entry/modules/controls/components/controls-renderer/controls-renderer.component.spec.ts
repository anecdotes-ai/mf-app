import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CategoriesFacadeService, ControlsFacadeService, SnapshotsFacadeService } from 'core/modules/data/services';
import { DataFilterManagerService } from 'core/modules/data-manipulation/data-filter';
import { AnecdotesUnifiedFramework } from 'core/modules/data/constants';
import { of, Subject } from 'rxjs';
import { ControlsMultiSelectService } from '../../services/controls-multi-select/controls-multi-select.service';
import { ControlsRendererComponent } from './controls-renderer.component';
import { CalculatedControl, CategoryObject } from 'core/modules/data/models';
import { take } from 'rxjs/operators';
import { Component } from '@angular/core';
import { ControlContextService, ControlsFocusingService } from 'core/modules/shared-controls/services';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';

@Component({
  selector: 'app-virtual-scroll-renderer',
  template: '',
})
export class RendererComponentMock {
  scrollToId = jasmine.createSpy('scrollToId').and.callFake(() => Promise.resolve());
}

describe('ControlsRendererComponent', () => {
  configureTestSuite();
  
  let componentUnderTest: ControlsRendererComponent;
  let fixture: ComponentFixture<ControlsRendererComponent>;
  let dataFilterManager: DataFilterManagerService;
  let controlsFacadeMock: ControlsFacadeService;
  let categoriesFacadeService: CategoriesFacadeService;
  let controlsFocusingServiceMock: ControlsFocusingService;

  const filteringOptions = {};

  beforeAll(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ControlsRendererComponent, RendererComponentMock],
        providers: [
          { provide: DataFilterManagerService, useValue: {} },
          { provide: ControlContextService, useValue: {} },
          { provide: ControlsMultiSelectService, useValue: {} },
          { provide: ControlsFacadeService, useValue: {} },
          { provide: CategoriesFacadeService, useValue: {} },
          { provide: ControlsFocusingService, useValue: {} },
          { provide: SnapshotsFacadeService, useValue: {} },
        ],
        imports: [TranslateModule.forRoot(), RouterTestingModule],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlsRendererComponent);
    componentUnderTest = fixture.componentInstance;
    componentUnderTest.framework = AnecdotesUnifiedFramework;
    controlsFacadeMock = TestBed.inject(ControlsFacadeService);
    dataFilterManager = TestBed.inject(DataFilterManagerService);
    categoriesFacadeService = TestBed.inject(CategoriesFacadeService);
    dataFilterManager.getFilteringOptions = jasmine
      .createSpy('getFilteringOptions')
      .and.callFake(() => of(filteringOptions));
    controlsFacadeMock.getControlsByFrameworkId = jasmine
      .createSpy('getControlsByFrameworkId')
      .and.callFake(() => of([]));
    controlsFacadeMock.getControlAddedByUserEvent = jasmine
      .createSpy('getControlAddedByUserEvent')
      .and.callFake(() => of({}));
    controlsFocusingServiceMock = TestBed.inject(ControlsFocusingService);
    controlsFocusingServiceMock.getControlsFocusingStream = jasmine
      .createSpy('getControlsFocusingStream')
      .and.callFake(() => of());
    controlsFocusingServiceMock.finishControlFocusing = jasmine.createSpy('finishControlFocusing');
  });

  function detectChanges(): Promise<any> {
    fixture.detectChanges();
    return fixture.whenStable();
  }

  it('should create', () => {
    expect(componentUnderTest).toBeTruthy();
  });

  describe('#addedElement', () => {
    it('should set newlyAddedControls[control_id] to true', () => {
      // Arrange
      const control_id = 'some-id';

      // Act
      componentUnderTest.markAsAdded(control_id);

      // Assert
      expect(componentUnderTest.newlyAddedControls[control_id]).toBeTrue();
    });

    it('should set newlyAddedControls[control_id] to false', () => {
      // Arrange
      const control_id = 'some-id';
      componentUnderTest.newlyAddedControls[control_id] = true;

      // Act
      componentUnderTest.handleClickedControl({ control_id });

      // Assert
      expect(componentUnderTest.newlyAddedControls[control_id]).toBeUndefined();
    });
  });

  describe('#controlExpand', () => {
    it('should set controlId expand to true if controlExpanded true', () => {
      // Arrange
      // Act
      componentUnderTest.controlExpanded('bla', true);

      // Assert
      expect('bla' in componentUnderTest.controlsIdsToExpand).toBeTrue();
    });

    it('should delete controlId from expandedControlsIds if controlExpanded false', () => {
      // Act
      // expand true
      componentUnderTest.controlExpanded('bla', true);

      // expand false
      componentUnderTest.controlExpanded('bla', false);

      // Assert
      expect('bla' in componentUnderTest.controlsIdsToExpand).toBeFalse();
    });

    it('should do nothing if controlId is not expanded after controlExpanded false', () => {
      // Arrange
      // Act
      componentUnderTest.controlExpanded('bla', false);

      // Assert
      expect('bla' in componentUnderTest.controlsIdsToExpand).toBeFalse();
    });

    it('should do nothing if controlId is expanded after controlExpanded true', () => {
      // Arrange
      // Act
      componentUnderTest.controlExpanded('bla', true);
      componentUnderTest.controlExpanded('bla', true);

      // Assert
      expect('bla' in componentUnderTest.controlsIdsToExpand).toBeTrue();
    });
  });

  describe('buildRenderingItemsCallback()', () => {
    let items: CalculatedControl[];

    it('should return an empty array if "items" is not truthy', async () => {
      // Arrange
      items = undefined;

      // Act
      await detectChanges();
      const actual = componentUnderTest.buildRenderingItemsCallback(items);

      // Assert
      expect(actual).toEqual([]);
    });

    it('should return an array of controls and categories where category strings go before relevant controls', async () => {
      // Arrange
      const categories: CategoryObject[] = [
        {
          control_category: 'fake1',
          control_category_id: 0,
          controls: [{ control_name: 'first' }, { control_name: 'second' }],
        },
        {
          control_category: 'fake2',
          control_category_id: 0,
          controls: [{ control_name: 'third' }],
        },
      ];
      categoriesFacadeService.groupControlsByCategory = jasmine
        .createSpy('groupControlsByCategory')
        .and.returnValue(categories);

      const fakeInputItems = [{ control_name: 'first' }];

      // Act
      await detectChanges();
      const actual = componentUnderTest.buildRenderingItemsCallback(fakeInputItems);

      // Assert
      expect(actual).toEqual([
        'fake1',
        { control_name: 'first' },
        { control_name: 'second' },
        'fake2',
        { control_name: 'third' },
      ]);
      expect(categoriesFacadeService.groupControlsByCategory).toHaveBeenCalledWith(
        fakeInputItems,
        componentUnderTest.framework.framework_id
      );
    });
  });

  describe('allControlsStream$', () => {
    it('should reflect data from getControlsByFrameworkId', async () => {
      // Arrange
      const items: CalculatedControl[] = [{}];
      controlsFacadeMock.getControlsByFrameworkId = jasmine.createSpy().and.callFake(() => of(items));

      // Act
      await detectChanges();
      const actual = await componentUnderTest.allControlsStream$.pipe(take(1)).toPromise();

      // Assert
      expect(items).toBe(actual);
    });
  });

  describe('controlAddingStream$', () => {
    it('should reflect data from getControlAddedByUserEvent', async () => {
      // Arrange
      const control: CalculatedControl = {};
      controlsFacadeMock.getControlAddedByUserEvent = jasmine.createSpy().and.callFake(() => of(control));

      // Act
      await detectChanges();
      const actual = await componentUnderTest.controlAddingStream$.pipe(take(1)).toPromise();

      // Assert
      expect(control).toBe(actual);
    });
  });

  describe('isCategory()', () => {
    it('should return true for string', () => {
      // Arrange
      const item = 'some string';
      // Act
      const actual = componentUnderTest.isCategory(item);

      // Assert
      expect(actual).toBeTrue();
    });

    it('should return false for an object', () => {
      // Arrange
      const item = {};

      // Act
      const actual = componentUnderTest.isCategory(item);

      // Assert
      expect(actual).toBeFalse();
    });
  });

  describe('focusing', () => {
    let controlsFocusingSubject = new Subject<string>();

    beforeEach(() => {
      controlsFocusingSubject = new Subject<string>();
      controlsFocusingServiceMock.getControlsFocusingStream = jasmine
        .createSpy('getControlsFocusingStream')
        .and.callFake(() => controlsFocusingSubject);
    });

    function getRenderer(): RendererComponentMock {
      return fixture.debugElement.query(By.directive(RendererComponentMock)).componentInstance;
    }

    it('should subscribe to getControlsFocusingStream', () => {
      // Arrange
      // Act
      fixture.detectChanges();

      // Assert
      expect(controlsFocusingServiceMock.getControlsFocusingStream).toHaveBeenCalledWith();
    });

    it('should scroll to provided id', fakeAsync(() => {
      // Arrange
      const fakeControlId = 'fake-control-id';
      fixture.detectChanges();
      controlsFocusingSubject.next(fakeControlId);
      tick(1100);

      // Act
      // Assert
      expect(getRenderer().scrollToId).toHaveBeenCalledWith(fakeControlId);
    }), 2000);

    it('should finish focusing', fakeAsync(() => {
      // Arrange
      fixture.detectChanges();
      controlsFocusingSubject.next('fake');
      tick(1100);

      // Act
      // Assert
      expect(controlsFocusingServiceMock.finishControlFocusing).toHaveBeenCalled();
    }), 2000);
  });
});
