import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Framework } from 'core/modules/data/models/domain';
import { LoaderManagerService, MessageBusService } from 'core';
import { TrackOperations, ActionDispatcherService, FrameworksFacadeService } from 'core/modules/data/services';
import { FrameworkStatus } from 'core/modules/data/models';
import {
  reducers,
  StartWithAnecdotesEssentialsAction,
  StartWithFrameworksAdoptionAction,
} from 'core/modules/data/store';
import { of } from 'rxjs';
import { ControlsEmptyStateComponent } from './controls-empty-state.component';

describe('ControlsEmptyStateComponent', () => {
  let component: ControlsEmptyStateComponent;
  let fixture: ComponentFixture<ControlsEmptyStateComponent>;
  let mockStore: MockStore;

  let actionDispatcher: ActionDispatcherService;
  let dispatchActionAsyncSpy: jasmine.Spy;

  let frameworksFacade: FrameworksFacadeService;
  let fakeFrameworks: Framework[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducers), TranslateModule.forRoot()],
      declarations: [ControlsEmptyStateComponent],
      providers: [
        provideMockStore(),
        LoaderManagerService,
        MessageBusService,
        { provide: ActionDispatcherService, useValue: {} },
        { provide: FrameworksFacadeService, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlsEmptyStateComponent);
    component = fixture.componentInstance;

    mockStore = TestBed.inject(MockStore);

    mockStore.dispatch = jasmine.createSpy('dispatch');

    actionDispatcher = TestBed.inject(ActionDispatcherService);
    dispatchActionAsyncSpy = actionDispatcher.dispatchActionAsync = jasmine.createSpy('dispatchActionAsync');

    frameworksFacade = TestBed.inject(FrameworksFacadeService);
    fakeFrameworks = [
      {
        framework_name: 'testedFrameworkName',
        is_applicable: true,
        framework_status: FrameworkStatus.AVAILABLE,
      },
    ];
    frameworksFacade.getAvailableFrameworks = jasmine
      .createSpy('getAvailableFrameworks')
      .and.callFake(() => of(fakeFrameworks));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    it('should correctly get all frameworks from store', (done) => {
      // Arrange
      fakeFrameworks = [
        { framework_id: 'some-framework', framework_status: FrameworkStatus.AVAILABLE },
        {
          framework_id: 'some-second-framework',
          framework_status: FrameworkStatus.AVAILABLE,
        },
      ];

      // Act
      fixture.detectChanges();

      // Assert
      component.frameworks$.subscribe((frameworks) => {
        expect(frameworks).toEqual([
          { framework_id: 'some-framework', framework_status: FrameworkStatus.AVAILABLE },
          { framework_id: 'some-second-framework', framework_status: FrameworkStatus.AVAILABLE },
        ]);
        done();
      });
    });
  });

  describe('#buildTranslationKey', () => {
    it('should return translationKey based on relativeKey', () => {
      // Arrange
      const relativeKey = 'someRelativeKey';

      // Act
      const actual = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toBe(`controls.emptyState.${relativeKey}`);
    });
  });

  describe('#selectFramework', () => {
    it('should add framework to selectedFrameworks if selectedFrameworks does not have it', () => {
      // Arrange
      component.selectedFrameworks = new Set();

      // Act
      component.selectFramework({ framework_id: 'some-framework' });

      // Assert
      expect(component.selectedFrameworks).toEqual(new Set([{ framework_id: 'some-framework' }]));
    });

    it('should delete framework from selectedFrameworks if selectedFrameworks has it', () => {
      // Arrange
      const framework = { framework_id: 'some-framework' };
      component.selectedFrameworks = new Set([framework]);

      // Act
      component.selectFramework(framework);

      // Assert
      expect(component.selectedFrameworks).toEqual(new Set());
    });
  });

  describe('#startWithAnecdotesEssentials', () => {
    it('should set isStartWithAnecdotesLoading to true', () => {
      // Act
      component.startWithAnecdotesEssentials();

      // Assert
      expect(component.isStartWithAnecdotesLoading).toBeTruthy();
    });

    it('should call actionDispatcher.dispatchActionAsync with StartWithAnecdotesEssentialsAction and proper key', () => {
      // Act
      component.startWithAnecdotesEssentials();

      // Assert
      expect(actionDispatcher.dispatchActionAsync).toHaveBeenCalledWith(
        new StartWithAnecdotesEssentialsAction(),
        TrackOperations.STARTED_WITH_ANECDOTES_ESSENTIALS
      );
    });

    it('should set isStartWithAnecdotesLoading to false after ngOnDestroy happens', fakeAsync(() => {
      // Arrange
      component.isStartWithAnecdotesLoading = true;

      // Act
      component.startWithAnecdotesEssentials();
      component.ngOnDestroy();
      tick();

      // Assert
      expect(component.isStartWithAnecdotesLoading).toBeFalsy();
    }));

    it('should emit startedWithAnecdotesEssentials after action has been dispatched successfully', fakeAsync(() => {
      // Arrange
      spyOn(component.startedWithAnecdotesEssentials, 'emit');

      // Act
      component.startWithAnecdotesEssentials();
      tick();

      // Assert
      expect(component.startedWithAnecdotesEssentials.emit).toHaveBeenCalled();
    }));
  });

  describe('#startWithFrameworkAdoption', () => {
    it('should set isStartWithFrameworkAdoptionLoading to true', () => {
      // Act
      component.startWithFrameworkAdoption();

      // Assert
      expect(component.isStartWithFrameworkAdoptionLoading).toBeTruthy();
    });

    it('should call actionDispatcher.dispatchActionAsync with StartWithFrameworksAdoptionAction and proper key', () => {
      // Arrange
      component.selectedFrameworks = new Set([{ framework_id: 'some-framework' }]);

      // Act
      component.startWithFrameworkAdoption();

      // Assert
      expect(actionDispatcher.dispatchActionAsync).toHaveBeenCalledWith(
        new StartWithFrameworksAdoptionAction([{ framework_id: 'some-framework' }]),
        TrackOperations.STARTED_WITH_FRAMEWORKS_ADOPTION
      );
    });

    it('should set isStartWithFrameworkAdoptionLoading to false after action has been dispatched successfully', fakeAsync(() => {
      // Arrange
      component.isStartWithFrameworkAdoptionLoading = true;

      // Act
      component.startWithFrameworkAdoption();
      component.ngOnDestroy();
      tick();

      // Assert
      expect(component.isStartWithFrameworkAdoptionLoading).toBeFalsy();
    }));

    it('should emit startedWithAnecdotesEssentials after action has been dispatched successfully', fakeAsync(() => {
      // Arrange
      spyOn(component.startedWithFrameworksAdoption, 'emit');
      component.selectedFrameworks = new Set([{ framework_id: 'some-framework' }]);

      // Act
      component.startWithFrameworkAdoption();
      tick();

      // Assert
      expect(component.startedWithFrameworksAdoption.emit).toHaveBeenCalledWith([{ framework_id: 'some-framework' }]);
    }));
  });
});
