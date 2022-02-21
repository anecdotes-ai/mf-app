import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EvidenceListFilterComponent } from './evidence-list-filter.component';
import { DataAggregationFacadeService, PluginFacadeService, RequirementsFacadeService } from 'core/modules/data/services';
import { configureTestSuite } from 'ng-bullet';
import { CalculatedRequirement, EvidenceLike } from 'core/modules/data/models';
import { Service } from 'core/modules/data/models/domain';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

const mockEvidencePool: EvidenceLike[] = [
  {
    id: 'fakeEvidenceId1',
    name: 'fakeEvidenceName1',
  },
  {
    id: 'fakeEvidenceId2',
    name: 'fakeEvidenceName2',
  },
  {
    id: 'fakeEvidenceId3',
    name: 'fakeEvidenceName3',
  },
];

const mockPluginsList: Service[] = [
  {
    service_id: 'fakeServiceId1',
    service_display_name: 'fakeServiceName1',
  },
  {
    service_id: 'fakeServiceId2',
    service_display_name: 'fakeServiceName2',
  },
  {
    service_id: 'fakeServiceId3',
    service_display_name: 'fakeServiceName3',
  },
  {
    service_id: 'fakeServiceId4',
    service_display_name: 'fakeServiceName4',
  },
];

const mockRequirement: CalculatedRequirement = {
  requirement_id: 'fakeRequirementId',
  requirement_name: 'fakeRequirementName',
};

const mockPluginName = 'fakePluginName';

describe('EvidenceListFilterComponent', () => {
  configureTestSuite();

  let component: EvidenceListFilterComponent;
  let fixture: ComponentFixture<EvidenceListFilterComponent>;
  let pluginsFacade: PluginFacadeService;
  let dataAggregationFacadeService: DataAggregationFacadeService;
  let requirementsFacade: RequirementsFacadeService;

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvidenceListFilterComponent],
      providers: [
        {
          provide: PluginFacadeService,
          useValue: {},
        },
        {
          provide: DataAggregationFacadeService,
          useValue: {},
        },
        {
          provide: RequirementsFacadeService,
          useValue: {},
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidenceListFilterComponent);
    component = fixture.componentInstance;
    pluginsFacade = TestBed.inject(PluginFacadeService);
    dataAggregationFacadeService = TestBed.inject(DataAggregationFacadeService);
    requirementsFacade = TestBed.inject(RequirementsFacadeService);
    pluginsFacade.getAllServices = jasmine.createSpy('getAllServices').and.callFake(() => of(mockPluginsList));
    dataAggregationFacadeService.getEvidenceRelevantForFramework = jasmine
      .createSpy('getEvidenceRelevantForFramework')
      .and.callFake(() => of(mockEvidencePool));
    requirementsFacade.getRequirement = jasmine.createSpy('getRequirement').and.callFake(() => of(mockRequirement));
    component.handleSearch = jasmine.createSpy('handleSearch').and.callThrough();
    component.handlePluginFilter = jasmine.createSpy('handlePluginFilter').and.callThrough();
    component.handleSort = jasmine.createSpy('handleSort').and.callThrough();
  });

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('should create', () => {
    // Arrange

    // Act
    detectChanges();

    // Assert
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', function () {
    it('should initialize component in right way', function () {
      // Arrange

      // Act
      detectChanges();

      // Assert
      expect(component.pluginFilterControl).toBeDefined();
      expect(component.filteredEvidences$).toBeDefined();
      expect(component.allEvidences$).toBeDefined();
    });
  });

  describe('#actions', function () {
    it('should call handlePluginFilter() if select was performed', function () {
      // Arrange

      // Act
      detectChanges();
      fixture.debugElement.query(By.css('app-dropdown-control')).triggerEventHandler('select', mockPluginName);

      // Assert
      expect(component.handlePluginFilter).toHaveBeenCalled();
    });

    it('should call handleSearch() if search was performed', function () {
      // Arrange

      // Act
      detectChanges();
      fixture.debugElement.query(By.css('app-data-search')).triggerEventHandler('search', mockEvidencePool[2]);

      // Assert
      expect(component.handleSearch).toHaveBeenCalled();
    });
    
    it('should call handleSort() if search was performed', function () {
      // Arrange

      // Act
      detectChanges();
      fixture.debugElement.query(By.css('app-data-sort')).triggerEventHandler('sort', mockEvidencePool[1]);

      // Assert
      expect(component.handleSort).toHaveBeenCalled();
    });
  });
});
