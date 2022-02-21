import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FrameworksPluginsListSearchComponent } from './frameworks-plugins-list-search.component';
import { configureTestSuite } from 'ng-bullet';
import { EvidenceFacadeService, PluginFacadeService } from 'core/modules/data/services';
import { Service } from 'core/modules/data/models/domain';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

const mockAllPluginsList: Service[] = [
  {
    service_display_name: 'mockServiceName1',
    service_id: 'mockServiceId1',
    service_status: 'SERVICE_INSTALLED',
    service_availability_status: 'AVAILABLE',
  },
  {
    service_display_name: 'mockServiceName2',
    service_id: 'mockServiceId2',
    service_status: 'SERVICE_INSTALLED',
    service_availability_status: 'AVAILABLE',
  },
  {
    service_display_name: 'mockServiceName3',
    service_id: 'mockServiceId3',
    service_status: 'SERVICE_INSTALLED',
    service_availability_status: 'AVAILABLE',
  },
];

describe('FrameworksPluginsListSearchComponent', () => {
  configureTestSuite();
  let component: FrameworksPluginsListSearchComponent;
  let fixture: ComponentFixture<FrameworksPluginsListSearchComponent>;
  let pluginFacadeService: PluginFacadeService;
  let evidenceFacadeService: EvidenceFacadeService;

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      declarations: [FrameworksPluginsListSearchComponent],
      providers: [
        {
          provide: PluginFacadeService,
          useValue: {},
        },
        {
          provide: EvidenceFacadeService,
          useValue: {},
        },
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameworksPluginsListSearchComponent);
    component = fixture.componentInstance;
    evidenceFacadeService = TestBed.inject(EvidenceFacadeService);
    evidenceFacadeService.getAllCalculatedEvidence = jasmine
      .createSpy('getAllCalculatedEvidence')
      .and.callFake(() => of([]));
    pluginFacadeService = TestBed.inject(PluginFacadeService);
    pluginFacadeService.getInstalledAndFailedPlugins = jasmine.createSpy('getInstalledAndFailedPlugins').and.callFake(() => of(mockAllPluginsList));
    detectChanges();
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

  describe('initialization', () => {
    it('should initialize component in right way', async () => {
      // Arrange
      // Act
      await detectChanges();

      // Assert
      expect(component.foundPlugins).toBeDefined();
      expect(component.allPlugins$).toBeDefined();
    });

    it('should call pluginFacade.getAllServices() in process of initialization and initialize foundPlugins field', () => {
      // Arrange
      // Act
      detectChanges();

      // Assert
      expect(pluginFacadeService.getInstalledAndFailedPlugins).toHaveBeenCalled();
      expect(component.foundPlugins.length).toEqual(3);
    });
  });
});
