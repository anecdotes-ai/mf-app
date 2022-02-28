import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { FrameworksFacadeService } from 'core/modules/data/services';
import { configureTestSuite } from 'ng-bullet';
import { LoaderManagerService } from 'core';
import { Framework } from 'core/modules/data/models/domain';
import { ControlsComponent } from './controls.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

@Component({
  selector: 'app-framework-controls-partition',
  template: '',
})
export class MockFrameworkControlsPartitionComponent {
  @Input()
  framework: Framework;
  focusAsync = jasmine.createSpy('focusAsync').and.returnValue(Promise.resolve());
  looseFocus = jasmine.createSpy('looseFocus');
}

describe('ControlsComponent', () => {
  const frameworkName = '123';
  const fakeFramework = {
    framework_id: 'id',
    framework_name: frameworkName,
  };

  let component: ControlsComponent;
  let fixture: ComponentFixture<ControlsComponent>;
  let mockStore: MockStore;
  let initialState: any;
  let loaderManager: LoaderManagerService;
  let facadeService: FrameworksFacadeService;

  configureTestSuite();

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [ControlsComponent, MockFrameworkControlsPartitionComponent],
      imports: [],
      providers: [
        provideMockStore(),
        { provide: LoaderManagerService, useValue: {} },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ framework: frameworkName }) }, paramMap: of(convertToParamMap({ framework: frameworkName })) },
        },
        { provide: FrameworksFacadeService, useValue: {} },
      ],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlsComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    loaderManager = TestBed.inject(LoaderManagerService);
    loaderManager.show = jasmine.createSpy('show');
    loaderManager.hide = jasmine.createSpy('hide');
    facadeService = TestBed.inject(FrameworksFacadeService);
    facadeService.getAllUsableAndApplicableFrameworks = jasmine
      .createSpy('getAllUsableAndApplicableFrameworks')
      .and.returnValue(of([{ framework_name: 'name' }, fakeFramework]));
    mockStore = TestBed.inject(MockStore);
    initialState = {
      evidencesState: {
        evidences: {
          entities: [],
        },
      },
      requirementState: {
        controlRequirements: {
          entities: [],
        },
      },
      servicesState: {
        isInitialized: true,
        entities: [],
      },
    };
  });

  it('should be created', () => {
    // Arrange
    // Act
    // Assert
    expect(component).toBeInstanceOf(ControlsComponent);
  });

  it('should display app-controls-header', async () => {
    // Arrange
    const adoptedFramework: Framework = {
      framework_id: 'fakeid',
      is_applicable: true,
    };
    mockStore.setState({
      ...initialState,
      frameworksState: {
        initialized: true,
        ids: [adoptedFramework.framework_id],
        entities: {
          [adoptedFramework.framework_id]: adoptedFramework,
        },
      },
      controlsState: {
        areAllLoaded: true,
        controlFrameworkMapping: {},
        controlsByFramework: {
          'My Controls': {
            ids: [],
            entities: {
              '728341854728341932': {
                control_is_applicable: true,
              },
            },
          },
        },
      },
    });

    // Act
    fixture.detectChanges();
    await fixture.whenStable();

    // Assert
    expect(fixture.debugElement.query(By.css('app-controls-header'))).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getAllUsableAndApplicableFrameworks', () => {
      // Arrange
      // Act
      component.ngOnInit();

      // Assert
      expect(facadeService.getAllUsableAndApplicableFrameworks).toHaveBeenCalled();
    });

    it('should call selectFramework with framework name', () => {
      // Arrange
      component.selectFramework = jasmine.createSpy('selectFramework');

      // Act
      component.ngOnInit();

      // Assert
      expect(component.selectFramework).toHaveBeenCalledWith(fakeFramework);
    });
  });

  describe('frameworkTrackBy', () => {
    it('should return framework id when framework is defined', () => {
      // Arrange
      const framework: Framework = {
        framework_id: 'fakeid',
        is_applicable: true,
      };
      const index = 123;

      // Act
      const actual = component.frameworkTrackBy(index, framework);

      // Assert
      expect(actual).toBe(framework.framework_id);
    });

    it('should return index when framework is not defined', () => {
      // Arrange
      const framework: Framework = undefined;
      const index = 123;

      // Act
      const actual = component.frameworkTrackBy(index, framework);

      // Assert
      expect(actual).toBe(index);
    });

    it('should return index when framework is null', () => {
      // Arrange
      const framework: Framework = null;
      const index = 123;

      // Act
      const actual = component.frameworkTrackBy(index, framework);

      // Assert
      expect(actual).toBe(index);
    });
  });

  describe('selectFramework', () => {
    let framework: Framework;

    beforeEach(() => {
      framework = {
        framework_id: 'fakeid',
        is_applicable: true,
      };
      mockStore.setState({
        ...initialState,
        frameworksState: {
          initialized: true,
          ids: [framework.framework_id],
          entities: {
            [framework.framework_id]: framework,
          },
        },
        controlsState: {
          areAllLoaded: true,
          controlFrameworkMapping: {},
          controlsByFramework: {
            'My Controls': {
              ids: [],
              entities: {
                '728341854728341932': {
                  control_is_applicable: true,
                },
              },
            },
          },
        },
      });
    });

    it('should add framework to displayedFrameworks', async () => {
      // Arrange
      // Act
      await component.selectFramework(framework);

      // Assert
      expect(component.displayedFrameworks).toContain(framework);
    });

    it('should focus framework controls partition component of provided framework', async () => {
      // Arrange
      // Act
      fixture.detectChanges();
      await fixture.whenStable();
      const frameworkPartitionComponentDebugElement = fixture.debugElement.query(
        By.css('app-framework-controls-partition')
      );

      // Assert
      expect(frameworkPartitionComponentDebugElement).toBeTruthy();
      expect(
        (frameworkPartitionComponentDebugElement.componentInstance as MockFrameworkControlsPartitionComponent).framework
      ).toEqual(fakeFramework);
      expect(
        (frameworkPartitionComponentDebugElement.componentInstance as MockFrameworkControlsPartitionComponent)
          .focusAsync
      ).toHaveBeenCalled();
    });

    it('should remove focus from previously selected framework controls partition component', async () => {
      // Arrange
      const anotherFramework: Framework = {
        framework_id: 'second-fakeid',
        is_applicable: true,
      };

      // Act
      await component.selectFramework(anotherFramework);
      fixture.detectChanges();
      await fixture.whenStable();
      await component.selectFramework(framework);
      fixture.detectChanges();
      await fixture.whenStable();
      const frameworkPartitionComponentDebugElements = fixture.debugElement.queryAll(
        By.css('app-framework-controls-partition')
      );

      // Assert
      expect(frameworkPartitionComponentDebugElements).toBeTruthy();
      expect(
        frameworkPartitionComponentDebugElements.find((x) => x.componentInstance.framework === anotherFramework)
      ).toBeUndefined();
    });
  });

  describe('#handleControlsLoaded', () => {
    it('should emit controlsLoaded', () => {
      // Arrange
      spyOn(component.controlsLoaded, 'emit');

      // Act
      component.handleControlsLoaded();

      // Assert
      expect(component.controlsLoaded.emit).toHaveBeenCalled();
    });
  });
});
