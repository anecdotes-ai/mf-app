import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardPluginsComponent } from './dashboard-plugins.component';
import { PluginService } from 'core/modules/data/services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleChange, SimpleChanges } from '@angular/core';
import { ConnectedPluginsData } from '../../models';

describe('DashboardPluginsComponent', () => {
  let component: DashboardPluginsComponent;
  let fixture: ComponentFixture<DashboardPluginsComponent>;
  let pluginService: PluginService;
  let mockConnectedPluginsData: ConnectedPluginsData[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [DashboardPluginsComponent],
      providers: [{ provide: PluginService, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    pluginService = TestBed.inject(PluginService);

    fixture = TestBed.createComponent(DashboardPluginsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Mocks
    mockConnectedPluginsData = [
      {
        service_id: 'github',
        service_evidence_list: [{}],
        service_number_of_evidence: 1,
        service_icon: 'github-icon',
        service_route: '/service_route/github',
      },
      {
        service_id: 'aws',
        service_evidence_list: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
        service_number_of_evidence: 12,
        service_icon: 'aws-icon',
        service_route: '/service_route/aws',
      },
    ];
  });

  it('should create', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    // Assert
    expect(component).toBeTruthy();
  });

  describe('Test: ngOnChanges', () => {
    it('should assign changes[data].currentValue  to recentlyConnectedServices and assign value to newEvidenceAmount ', async () => {
      // Arrange
      const changes: SimpleChanges = {
        data: new SimpleChange(null, mockConnectedPluginsData, true),
      };

      // Act
      component.ngOnChanges(changes);
      await fixture.whenStable();

      // Assert
      expect(component.recentlyConnectedServices).toEqual(changes['data'].currentValue);
      expect(typeof component.newEvidenceAmount).toEqual('number');
    });

    it('newEvidenceAmount should be undefined when changes[data].currentValue is null', async () => {
      // Arrange
      const changes: SimpleChanges = {
        data: new SimpleChange(null, null, true),
      };

      // Act
      component.ngOnChanges(changes);
      await fixture.whenStable();

      // Assert
      expect(component.newEvidenceAmount).toBeUndefined();
    });
  });

  describe('Test: buildTranslationKey', () => {
    it('should return relativeKey with dashboard.plugins. prefix', () => {
      // Arrange
      const relativeKey = 'anyText';

      // Act
      const actual = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toBe(`dashboard.plugins.${relativeKey}`);
    });
  });
});
