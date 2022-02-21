import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PolicyManagerContentComponent, PolicyType } from './policy-manager-content.component';
import { configureTestSuite } from 'ng-bullet';
import { SearchInstancesManagerService } from 'core/modules/data-manipulation/search';
import { FrameworksFacadeService, PoliciesFacadeService } from 'core/modules/data/services';
import { MessageBusService } from 'core';
import { DataFilterManagerService } from 'core/modules/data-manipulation/data-filter';
import { NEVER, Observable, of } from 'rxjs';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Framework } from 'core/modules/data/models/domain';
import { CalculatedPolicy, ResourceStatusEnum } from 'core/modules/data/models';
import { PolicyTypesEnum } from 'core/modules/data/models';

describe('PolicyManagerContentComponent', () => {
  configureTestSuite();
  let component: PolicyManagerContentComponent;
  let fixture: ComponentFixture<PolicyManagerContentComponent>;

  let filterManager: DataFilterManagerService;
  let messageBusService: MessageBusService;
  let policiesFacade: PoliciesFacadeService;
  let searchInstancesManagerService: SearchInstancesManagerService;
  let frameworksFacade: FrameworksFacadeService;

  let frameworks: Framework[] = [
    { framework_name: 'some-framework-1' },
    { framework_name: 'some-framework-2' },
    { framework_name: 'some-framework-3' },
    { framework_name: 'some-framework-4' },
    { framework_name: 'some-framework-5' },
  ];

  let policies: CalculatedPolicy[] = [
    {
      policy_name: 'some-policy-1',
      policy_type: PolicyTypesEnum.Procedure,
      status: ResourceStatusEnum.ON_HOLD,
      policy_related_frameworks_names: {
        'some-framework-1': [],
        'some-framework-3': [],
        'some-framework-4': [],
      },
    },
    {
      policy_name: 'some-policy-1',
      policy_type: PolicyTypesEnum.Policy,
      status: ResourceStatusEnum.APPROVED,
      policy_related_frameworks_names: {
        'some-framework-1': [],
        'some-framework-2': [],
        'some-framework-3': [],
      },
    },
    {
      policy_name: 'some-policy-1',
      policy_type: PolicyTypesEnum.Procedure,
      status: ResourceStatusEnum.PENDING,
      policy_related_frameworks_names: {
        'some-framework-1': [],
        'some-framework-2': [],
        'some-framework-5': [],
      },
    },
    {
      policy_name: 'some-policy-1',
      policy_type: PolicyTypesEnum.Policy,
      status: ResourceStatusEnum.NOTSTARTED,
      policy_related_frameworks_names: {
        'some-framework-1': [],
        'some-framework-2': [],
        'some-framework-4': [],
      },
    },
    {
      policy_name: 'some-policy-1',
      policy_type: PolicyTypesEnum.Procedure,
      status: ResourceStatusEnum.APPROVED,
      policy_related_frameworks_names: {
        'some-framework-1': [],
        'some-framework-3': [],
        'some-framework-4': [],
      },
    },
    {
      policy_name: 'some-policy-1',
      policy_type: PolicyTypesEnum.Policy,
      status: ResourceStatusEnum.ON_HOLD,
      policy_related_frameworks_names: {
        'some-framework-1': [],
        'some-framework-2': [],
        'some-framework-3': [],
      },
    },
  ];

  let policiesGroupedByTypes: PolicyType[] = [
    {
      type: PolicyTypesEnum.Policy,
      policies: [
        {
          policy_name: 'some-policy-1',
          policy_type: PolicyTypesEnum.Policy,
          status: ResourceStatusEnum.APPROVED,
          policy_related_frameworks_names: {
            'some-framework-1': [],
            'some-framework-2': [],
            'some-framework-3': [],
          },
        },
        {
          policy_name: 'some-policy-1',
          policy_type: PolicyTypesEnum.Policy,
          status: ResourceStatusEnum.NOTSTARTED,
          policy_related_frameworks_names: {
            'some-framework-1': [],
            'some-framework-2': [],
            'some-framework-4': [],
          },
        },
        {
          policy_name: 'some-policy-1',
          policy_type: PolicyTypesEnum.Policy,
          status: ResourceStatusEnum.ON_HOLD,
          policy_related_frameworks_names: {
            'some-framework-1': [],
            'some-framework-2': [],
            'some-framework-3': [],
          },
        },
      ],
    },
    {
      type: PolicyTypesEnum.Procedure,
      policies: [
        {
          policy_name: 'some-policy-1',
          policy_type: PolicyTypesEnum.Procedure,
          status: ResourceStatusEnum.ON_HOLD,
          policy_related_frameworks_names: {
            'some-framework-1': [],
            'some-framework-3': [],
            'some-framework-4': [],
          },
        },
        {
          policy_name: 'some-policy-1',
          policy_type: PolicyTypesEnum.Procedure,
          status: ResourceStatusEnum.PENDING,
          policy_related_frameworks_names: {
            'some-framework-1': [],
            'some-framework-2': [],
            'some-framework-5': [],
          },
        },
        {
          policy_name: 'some-policy-1',
          policy_type: PolicyTypesEnum.Procedure,
          status: ResourceStatusEnum.APPROVED,
          policy_related_frameworks_names: {
            'some-framework-1': [],
            'some-framework-3': [],
            'some-framework-4': [],
          },
        },
      ],
    },
    {
      type: PolicyTypesEnum.Other,
      policies: [],
    },
  ];

  @Component({
    selector: 'app-data-search',
    template: ``,
  })
  class MockedDataSearchComponent {
    private _data: any[];

    @Output()
    search = new EventEmitter();

    @Input()
    get data(): any[] {
      return this._data;
    }

    set data(v: any[]) {
      if (v !== this._data) {
        this._data = v;
      }
    }

    reset(): void {}
  }

  let dataSearchComponentMock: MockedDataSearchComponent = new MockedDataSearchComponent();

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [PolicyManagerContentComponent, MockedDataSearchComponent],
      providers: [
        {
          provide: SearchInstancesManagerService,
          useValue: {
            getSearchScopeKey(_: HTMLElement): string {
              return '';
            },
            getDataSearch(_: string): Observable<any> {
              return of('fef');
            },
            getSearchResultsPaginator(_: string): Observable<any> {
              return of();
            },
          },
        },
        { provide: PoliciesFacadeService, useValue: {} },
        { provide: MessageBusService, useValue: {} },
        { provide: DataFilterManagerService, useValue: {} },
        { provide: FrameworksFacadeService, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyManagerContentComponent);
    component = fixture.componentInstance;

    filterManager = TestBed.inject(DataFilterManagerService);
    filterManager.close = jasmine.createSpy('close');
    filterManager.getDataFilterEvent = jasmine.createSpy('getDataFilterEvent').and.returnValue(of([]));
    filterManager.open = jasmine.createSpy('open');
    filterManager.setData = jasmine.createSpy('setData');
    filterManager.refreshFilter = jasmine.createSpy('refreshFilter');
    filterManager.setFilterDefinition = jasmine.createSpy('setFilterDefinition');

    messageBusService = TestBed.inject(MessageBusService);
    messageBusService.getObservable = jasmine.createSpy('getObservable').and.returnValue(NEVER);
    messageBusService.getFeedByKeyPrefix = jasmine
      .createSpy('getFeedByKeyPrefix')
      .and.returnValue(NEVER);

    policiesFacade = TestBed.inject(PoliciesFacadeService);
    policiesFacade.getAllApplicablePolicies = jasmine
      .createSpy('getAllApplicablePolicies')
      .and.returnValue(of(policies));
    policiesFacade.getAllApplicableWithCategoriesOrderAndSort = jasmine
      .createSpy('getAllApplicableWithCategoriesOrderAndSort')
      .and.returnValue(of(policies));

    searchInstancesManagerService = TestBed.inject(SearchInstancesManagerService);
    searchInstancesManagerService.getDataSearch = jasmine
      .createSpy('getDataSearch')
      .and.returnValue(of(dataSearchComponentMock));

    frameworksFacade = TestBed.inject(FrameworksFacadeService);
    frameworksFacade.getApplicableFrameworks = jasmine
      .createSpy('getApplicableFrameworks')
      .and.returnValue(of(frameworks));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // describe('OnInit', () => {
  //   it('should call all necessary methods and init all necessary props', async () => {
  //     // Arrange
  //     // Act
  //     fixture.detectChanges();
  //     await fixture.whenStable();

  //     // Assert
  //     expect(component.tabs).toBeTruthy();
  //   });
  // });

  // describe('toggleTab', () => {
  //   it('should set allData to search and filter if currentTabId === "All"', async () => {
  //     // Arrange
  //     // Act
  //     await component.ngOnInit();
  //     component.toggleTab({ tabId: 'All', filterDefinitionValue: undefined });

  //     // Assert
  //     expect(filterManager.setData).toHaveBeenCalledWith(policies);
  //     expect(filterManager.refreshFilter).toHaveBeenCalled();
  //     expect(filterManager.setFilterDefinition).toHaveBeenCalled();
  //   });

  //   it('should set policy type data to search and filter if currentTabId !== "All"', async () => {
  //     // Arrange
  //     // Act
  //     await component.ngOnInit();
  //     const categoryData = policiesGroupedByTypes.find((category) => category.type === 'Procedure').policies;
  //     component.toggleTab({ tabId: 'Procedure', filterDefinitionValue: undefined });

  //     // Assert
  //     expect(filterManager.setData).toHaveBeenCalledWith(categoryData);
  //     expect(filterManager.refreshFilter).toHaveBeenCalled();
  //     expect(filterManager.setFilterDefinition).toHaveBeenCalled();
  //   });
  // });
});
