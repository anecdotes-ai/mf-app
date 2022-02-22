/* tslint:disable:no-unused-variable */
import { Component } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MessageBusService, SearchMessageBusMessages, WindowHelperService } from 'core';
import { RoleEnum } from 'core/modules/auth-core/models/domain/user';
import { RoleService } from 'core/modules/auth-core/services/role/role.service';
import { DataFilterManagerService } from 'core/modules/data-manipulation/data-filter';
import { DataSearchComponent, SearchInstancesManagerService } from 'core/modules/data-manipulation/search';
import { AnecdotesUnifiedFramework } from 'core/modules/data/constants';
import { CalculatedControl, FrameworkStatus } from 'core/modules/data/models';
import { Framework } from 'core/modules/data/models/domain';
import {
  FrameworkService,
  FrameworksFacadeService,
  OperationsTrackerService,
} from 'core/modules/data/services';
import { State } from 'core/modules/data/store';
import { VisibleForRoleDirective } from 'core/modules/directives/visible-for-role/visible-for-role.directive';
import { ControlsCustomizationModalService } from 'core/modules/shared-controls/modules/customization/control/services';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { ControlFilterObject } from './../../models/control-filter-object';
import { ControlsHeaderComponent } from './controls-header.component';

@Component({
  selector: 'app-data-search',
  template: '',
})
export class DataSearchMockComponent {}

describe('ControlsHeaderComponent', () => {
  configureTestSuite();
  let component: ControlsHeaderComponent;
  let fixture: ComponentFixture<ControlsHeaderComponent>;

  let dataFilterManager: DataFilterManagerService;
  let mockControlsArray: CalculatedControl[];
  let testFramework: Framework;

  let mockStore: MockStore<State>;
  let defaultMockStateObject: State;
  let frameworkService: FrameworkService;
  let filterManager: DataFilterManagerService;
  let windowHelperService: WindowHelperService;
  let messageBus: MessageBusService;
  let operationTracker: OperationsTrackerService;
  let initialState: any;
  let frameworksFacade: FrameworksFacadeService;
  const roleToReturnFromRoleService = 'fake-role';

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      providers: [
        DataFilterManagerService,
        provideMockStore(),
        FrameworkService,
        MessageBusService,
        OperationsTrackerService,
        SearchInstancesManagerService,
        {
          provide: WindowHelperService,
          useValue: {
            openUrlInNewTab: jasmine.createSpy('openUrlInNewTab'),
            getWindow: jasmine.createSpy('getWindow').and.returnValue({
              localStorage: { getItem: jasmine.createSpy('getItem') },
            }),
          },
        },

        { provide: FrameworksFacadeService, useValue: {} },
        { provide: ControlsCustomizationModalService, useValue: {} },
        {
          provide: RoleService,
          useValue: {
            getCurrentUserRole: () => roleToReturnFromRoleService,
          },
        },
        { provide: FrameworkService, useValue: {} },
      ],
      declarations: [ControlsHeaderComponent, DataSearchMockComponent, VisibleForRoleDirective],
    }).compileComponents();
  }));

  beforeEach(inject(
    [MockStore, DataFilterManagerService],
    (
      injectedStore: MockStore<State>,
      injectedfilterManager: DataFilterManagerService
    ) => {
      dataFilterManager = TestBed.inject(DataFilterManagerService);
      frameworkService = TestBed.inject(FrameworkService);
      messageBus = TestBed.inject(MessageBusService);
      windowHelperService = TestBed.inject(WindowHelperService);
      operationTracker = TestBed.inject(OperationsTrackerService);

      frameworksFacade = TestBed.inject(FrameworksFacadeService);
      frameworksFacade.getAllUsableAndApplicableFrameworks = jasmine
        .createSpy('getAllUsableAndApplicableFrameworks ')
        .and.returnValue(
          of([
            { ...AnecdotesUnifiedFramework },
            {
              framework_name: 'testedFrameworkName',
              is_applicable: true,
              framework_status: FrameworkStatus.AVAILABLE,
            },
          ])
        );

      mockControlsArray = [{ control_id: '3456' }, { control_id: '5678' }];
      fixture = TestBed.createComponent(ControlsHeaderComponent);
      component = fixture.componentInstance;
      component.controls = mockControlsArray;

      mockStore = injectedStore;
      filterManager = injectedfilterManager;

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

      testFramework = {
        framework_name: 'Test Framework Name',
        framework_id: 'testId123',
      };

      defaultMockStateObject = {
        ...initialState,
        frameworksState: {
          initialized: true,
          entities: {
            ['12345']: {
              framework_id: '12345',
              framework_name: 'Test Name',
              is_applicable: true,
              framework_status: FrameworkStatus.AVAILABLE,
            },

            ['123456']: {
              framework_id: '123456',
              framework_name: 'Test Name2',
              is_applicable: true,
              framework_status: FrameworkStatus.COMINGSOON,
            },
          },
          ids: ['12345', '123456'],
        },
        usersState: {
          entities: {
            ['userId']: {
              email: 'testUser@gmail.com',
              role: RoleEnum.Admin,
            },
          },
          ids: ['userId'],
          isLoaded: true,
        },
        controlsState: {
          controlsByFramework: {},
          areAllLoaded: true,
          controlFrameworkMapping: {},
        },
      };

      mockStore.setState(defaultMockStateObject);
      TestBed.inject(FrameworkService).getFrameworkIconLink = jasmine
        .createSpy('getFrameworkIconLink')
        .and.returnValue('');
    }
  ));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getCurrentFrameworkIcon', () => {
    const iconPath = 'iconPath';
    beforeEach(() => {
      // Arrange
      frameworkService.getFrameworkIconLink = jasmine.createSpy('getFrameworkIconLink').and.returnValue('iconPath');

      mockStore.setState({
        ...initialState,
        frameworksState: {
          initialized: false,
          entities: {},
          ids: [],
        },
        usersState: {
          entities: {
            ['userId']: {
              email: 'testUser@gmail.com',
              role: RoleEnum.Admin,
            },
          },
          ids: ['userId'],
          isLoaded: true,
        },
      });
    });

    it('should get framework icon if selectedFramework exists', async () => {
      // Arrange
      component.selectedFramework = { framework_id: '1234' };

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      const icon = component.getCurrentFrameworkIcon();

      // Assert
      expect(frameworkService.getFrameworkIconLink).toHaveBeenCalled();
      expect(icon).toBe(iconPath);
    });

    // it('should not get framework icon if selectedFramework does not exist', async () => {
    //   // Act
    //   fixture.detectChanges();
    //   await fixture.whenStable();

    //   component.getCurrentFrameworkIcon();

    //   // Assert
    //   expect(frameworkService.getFrameworkIconLink).not.toHaveBeenCalled();
    // });
  });

  describe('isAnecdotesFramework', () => {
    beforeEach(() => {
      component.selectedFramework = testFramework;
    });

    it('should determine whether the selectedFremework is anecdotes unified framework. should return false when framework is not anecdotes unified framework', async () => {
      // Arrange
      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      const result = component.isAnecdotesFramework;

      // Assert
      expect(result).toBeFalse();
    });

    it('should return true when framework is anecdotes unified framework', async () => {
      // Arrange
      testFramework.framework_id = AnecdotesUnifiedFramework.framework_id;
      component.selectedFramework = testFramework;

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      const result = component.isAnecdotesFramework;

      // Assert
      expect(result).toBeTrue();
    });
  });


  describe('#ngOnDestroy', () => {
    it('should emit destroy$ true and filterManager should call close method', async () => {
      // Arrange
      component.selectedFramework = { framework_name: 'name' };
      fixture.detectChanges();
      await fixture.whenStable();

      const closeSpy = jasmine.createSpy('closeSpy');
      dataFilterManager.close = closeSpy;

      // Act
      component.ngOnDestroy();

      // Assert
      expect(closeSpy).toHaveBeenCalledWith(true);
    });
  });

  describe('#searchData', () => {
    it('should send data through the message bus', async () => {
      // Arrange
      spyOn(messageBus, 'sendMessage');
      const anyDataToTest = { anyParam: 'Any value', secondParam: 123 };

      // Act
      component.searchData(anyDataToTest);

      // Assert
      expect(messageBus.sendMessage).toHaveBeenCalledWith(SearchMessageBusMessages.CONTROLS_SEARCH, anyDataToTest);
    });
  });

  describe('#resetAllFilters', () => {
    it('should call reset method from filter manager', async () => {
      // Arrange
      component.selectedFramework = { framework_name: 'name' };
      const controlFilterObject: ControlFilterObject[] = [
        {
          control_id: 'testId',
          control_has_automated_evidence_collected: true,
        },
      ] as Array<any>;

      spyOn(filterManager, 'getDataFilterEvent').and.returnValue(of(controlFilterObject));
      spyOn(dataFilterManager, 'reset');

      fixture.detectChanges();
      await fixture.whenStable();

      const searchComponent = fixture.debugElement.query(By.directive(DataSearchMockComponent))
        .componentInstance as DataSearchComponent;
      searchComponent.reset = jasmine.createSpy('reset');

      // Act
      component.resetAllFilters();

      // Assert
      expect(dataFilterManager.reset).toHaveBeenCalled();
      expect(searchComponent.reset).toHaveBeenCalled();
    });
  });
});
