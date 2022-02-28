import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataFeatureState } from 'core/modules/data/store';
import { DashboardFacadeService } from 'core/modules/data/services';
import { Service, ServiceStatusEnum, Framework } from 'core/modules/data/models/domain';
import { CalculatedControl } from 'core/modules/data/models';
import { FrameworkSectionItem } from '../../models';
import { TranslateModule } from '@ngx-translate/core';
import { ConnectedPluginsData } from '../../models';
import { DashboardComponent } from './dashboard.component';
import { DashboardHeaderContentResolverService } from '../../services';
import { UserEventService } from 'core/services/user-event/user-event.service';
import { LoaderManagerService, MessageBusService } from 'core';

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;
  let component: DashboardComponent;
  let mockStore: MockStore<DataFeatureState>;
  let mockEmptyInnerStates: any;

  let spyPrivateLoadDashboardData: jasmine.Spy;
  let spyFillHeaderData: jasmine.Spy;
  let spyFilterConnectedServices: jasmine.Spy;
  let spyFilterFrameworkSectionData: jasmine.Spy;
  let spyMockStore: jasmine.Spy;

  let mockServices: Service[];
  let connectedServices: ConnectedPluginsData[];
  let headerContentResolver: DashboardHeaderContentResolverService;
  let mockControls: CalculatedControl[];
  let mockFrameworks: Framework[];
  let mockDashboardStateSelector: Observable<any>;
  let mockControlsFrameworksMap: { [key: string]: string };

  let dashboardFacade: DashboardFacadeService;

  const dashboardData = {
    controlsFrameworksMapping: {},
    anecdotesControls: [],
    frameworksControls: [],
    frameworks: [],
    applicableFrameworksIds: [],
    services: [],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideMockStore(),
        DashboardHeaderContentResolverService,
        LoaderManagerService,
        UserEventService,
        MessageBusService,
        { provide: DashboardFacadeService, useValue: {} },
      ],
      declarations: [DashboardComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    headerContentResolver = TestBed.inject(DashboardHeaderContentResolverService);
    // Mock store arrangement

    mockStore = TestBed.inject(MockStore);
    mockEmptyInnerStates = { isLoaded: false, ids: [], entities: {} };
    mockStore.setState({
      dashboardState: {
        services: mockEmptyInnerStates,
        controls: mockEmptyInnerStates,
        frameworks: mockEmptyInnerStates,
        isDashboardEntitiesLoaded: false,
      },
      controlsState: {
        controlFrameworksMapping: {},
        controlsByFramework: {},
        areAllLoaded: false,
        controls: { entities: {}, ids: [] },
      },
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
    } as any);

    // MockData
    mockDashboardStateSelector = mockStore.select((t) => t.dashboardState);
    mockServices = [
      {
        service_status: ServiceStatusEnum.REMOVED,
        service_id: 'github',
        service_evidence_list: [{}, {}, {}, {}, {}],
        service_availability_status: 'AVAILABLE',
        service_last_update: new Date(2012, 9, 23),
      },
      {
        service_status: ServiceStatusEnum.REMOVED,
        service_id: 'aws',
        service_evidence_list: [{}, {}, {}, {}, {}],
        service_availability_status: 'AVAILABLE',
        service_last_update: new Date(2013, 9, 23),
      },
      {
        service_status: ServiceStatusEnum.REMOVED,
        service_id: 'okta',
        service_evidence_list: [{}, {}, {}, {}, {}],
        service_availability_status: 'COMINGSOON',
        service_last_update: new Date(2015, 9, 23),
      },
    ];
    connectedServices = [
      {
        service_id: 'github',
        service_number_of_evidence: 5,
      },
      {
        service_id: 'okta',
        service_number_of_evidence: 10,
      },
    ];
    mockControls = [
      {
        control_has_automated_evidence_collected: true,
        control_number_of_total_evidence_collected: 6,
        control_related_frameworks: ['ISO 27001:2013'],
        control_collected_automated_applicable_evidence_ids: ['4453', '343534', '345435'],
        control_related_frameworks_names: {'SOC 2': ['CC1.1', 'CC1.2', 'CC1.3', 'CC1.4']},
      },
      {
        control_has_automated_evidence_collected: true,
        control_number_of_total_evidence_collected: 5,
        control_related_frameworks: ['ISO 27001:2013', 'SOC2'],
        control_collected_automated_applicable_evidence_ids: ['4453', '5463546', '345435'],
        control_related_frameworks_names: {'SOC 2': ['CC1.1', 'CC1.2', 'CC1.3', 'CC1.4']},
      },
    ];
    mockControlsFrameworksMap = {
      223: 'ISO 27001:2013',
      221: 'ISO 27001:2013',
      222: 'ISO 27001:2013',
    };
    mockFrameworks = [{ framework_id: 'ISO 27001:2013' }, { framework_id: 'PCI-DSS v3.2.1' }, { framework_id: 'SOC2' }];

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;

    dashboardFacade = TestBed.inject(DashboardFacadeService);
    dashboardFacade.getDashboardData = jasmine.createSpy('getDashboardData').and.returnValue(of(dashboardData));

    //  Spies
    spyPrivateLoadDashboardData = spyOn<any>(component, 'loadDashboardData').and.callThrough();
    spyFilterConnectedServices = spyOn(component, 'filterConnectedServices').and.callThrough();
    spyFillHeaderData = spyOn(component, 'fillHeaderData').and.callThrough();
    spyFilterFrameworkSectionData = spyOn(component, 'filterFrameworkSectionData').and.callThrough();
    spyMockStore = spyOn<any>(mockStore, 'dispatch');
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should be able to create component instance', () => {
    // Assert
    expect(component).toBeDefined();
  });

  // describe('Test: loadDashboardData', () => {
  //   // it('allDashboardData$ should have [controls, services, frameworks]', async () => {
  //   //   // Arrange
  //   //   const controlsModel: CalculatedControl[] = [];
  //   //   const servicesModel: Service[] = [];
  //   //   const frameworksModel: Framework[] = [];

  //   //   // Act
  //   //   fixture.detectChanges();
  //   //   await fixture.whenStable();
  //   //   spyPrivateLoadDashboardData();

  //   //   //  Assert
  //   //   component.allDashboardData$.subscribe((_allDashboardData) => {
  //   //     expect(_allDashboardData).toContain([...controlsModel]);
  //   //     expect(_allDashboardData).toContain([...servicesModel]);
  //   //     expect(_allDashboardData).toContain([...frameworksModel]);
  //   //   });
  //   // });

  //   it('should call FillHeaderData, FilterFrameworkSectionData, FilterConnectedServices with arguments', async () => {
  //     // Act
  //     fixture.detectChanges();
  //     await fixture.whenStable();
  //     spyPrivateLoadDashboardData();

  //     //  Assert
  //     component.allDashboardData$.pipe(
  //       map((state) => {
  //         const services: Service[] = Object.values(mockStore['dashboardState'].services.entities);
  //         const frameworks: Framework[] = Object.values(mockStore['dashboardState'].frameworks.entities);
  //         const controls: CalculatedControl[] = Object.values(mockStore['dashboardState'].controls.entities);

  //         expect(component.headerData$).toEqual(spyFillHeaderData(services, controls, frameworks));
  //         expect(component.frameworksSectionData$).toEqual(
  //           spyFilterFrameworkSectionData(frameworks, controls, services)
  //         );
  //         expect(component.connectedServicesData$).toEqual(spyFilterConnectedServices(services));
  //       })
  //     );
  //   });
  // });

  // describe('Test: fillHeaderData', () => {
  //   it('automatedEvidences should return number', async () => {
  //     // Act
  //     spyPrivateLoadDashboardData();
  //     fixture.detectChanges();
  //     await fixture.whenStable();
  //     component.fillHeaderData(
  //       mockServices,
  //       mockControls,
  //       mockFrameworks.map((ef) => ef.framework_id),
  //       mockControlsFrameworksMap
  //     );

  //     // Arrange
  //     mockControls
  //       .filter((control) => control.control_has_automated_evidence_collected)
  //       .map((control) => control.control_number_of_total_evidence_collected)
  //       .reduce((a, b) => {
  //         // Assert
  //         expect(typeof a).toEqual('number');
  //         expect(typeof b).toEqual('number');
  //         return a + b;
  //       }, 0);
  //   });

  //   it('should return completedControls', async () => {
  //     // Act
  //     const resultVariable = component.fillHeaderData(
  //       mockServices,
  //       mockControls,
  //       mockFrameworks.map((ef) => ef.framework_id),
  //       mockControlsFrameworksMap
  //     );

  //     // Arrange
  //     const applicableControls = mockControls.filter((control) => control.control_is_applicable);

  //     // Assert
  //     const completedControls = {
  //       completedControls: applicableControls.filter((control) => {
  //         expect(control).toEqual({ control_status: ControlStatusEnum.COMPLIANT });
  //         return control.control_status === ControlStatusEnum.COMPLIANT;
  //       }).length,
  //     };
  //     expect(resultVariable.approvedRequirements).toEqual(completedControls.completedControls);
  //   });
  // });

  describe('Test: filterConnectedServices()', () => {
    it('should return ConnectedData', async () => {
      // Arrange
      const mockConnectedData = [
        {
          service_status: ServiceStatusEnum.INSTALLED,
          service_id: 'github',
          service_number_of_evidence: 5,
          service_availability_status: 'AVAILABLE',
          service_last_update: new Date(2012, 9, 23),
        },
        {
          service_status: ServiceStatusEnum.INSTALLED,
          service_id: 'aws',
          service_number_of_evidence: 5,
          service_availability_status: 'AVAILABLE',
          service_last_update: new Date(2013, 9, 23),
        },
      ];

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(spyFilterConnectedServices).toBeDefined();
      expect(spyFilterConnectedServices(connectedServices)).toEqual([]);
      expect(spyFilterConnectedServices(mockConnectedData)).toEqual(mockConnectedData.reverse());
    });
  });

  describe('Test: filterFrameworkSectionData()', () => {
    it('should return DashboardFrameworksSectionData', () => {
      // Arrange
      const frameworksSectionData: FrameworkSectionItem[] = mockFrameworks.map<FrameworkSectionItem>((framework) => ({
        framework,
        relatedControls: mockControls.filter((control) =>
          control.control_related_frameworks_names.hasOwnProperty(framework.framework_name)
        ),
      }));

      // Act
      const frameworksSectionItems = spyFilterFrameworkSectionData(mockFrameworks, mockControls);

      // Assert
      expect(frameworksSectionItems).toEqual({
        frameworksSectionItems: frameworksSectionData,
      });
    });
  });
});
