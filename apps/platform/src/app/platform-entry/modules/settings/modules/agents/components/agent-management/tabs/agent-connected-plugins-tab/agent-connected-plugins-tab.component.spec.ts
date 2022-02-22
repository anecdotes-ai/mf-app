import { PluginFacadeService } from 'core/modules/data/services/facades/plugin-facade/plugin-facade.service';
import { PluginNavigationService } from 'core/services/plugin-navigation-service/plugin-navigation-service.service';
import { PluginService } from 'core/modules/data/services/plugin/plugin.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgentConnectedPluginsTabComponent } from './agent-connected-plugins-tab.component';
import { TranslateModule } from '@ngx-translate/core';
import { OnPremEventService } from 'core/services/on-prem-event-service/on-prem-event.service';
import { Service } from 'core/modules/data/models/domain';

describe('AgentConnectedPluginsTabComponent', () => {
  let component: AgentConnectedPluginsTabComponent;
  let fixture: ComponentFixture<AgentConnectedPluginsTabComponent>;
  let onPremEventService: OnPremEventService;
  let pluginNavigationService: PluginNavigationService;

  const plugin: Service = { service_id: 'id' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [AgentConnectedPluginsTabComponent],
      providers: [
        { provide: PluginFacadeService, useValue: {} },
        { provide: PluginService, useValue: {} },
        { provide: PluginNavigationService, useValue: {} },
        { provide: OnPremEventService, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentConnectedPluginsTabComponent);
    component = fixture.componentInstance;

    onPremEventService = TestBed.inject(OnPremEventService);
    onPremEventService.trackPluginNameClickEvent = jasmine.createSpy('trackPluginNameClickEvent');
    onPremEventService.trackViewEvidenceClickEvent = jasmine.createSpy('trackViewEvidenceClickEvent');

    pluginNavigationService = TestBed.inject(PluginNavigationService);
    pluginNavigationService.navigateToPluginDetails = jasmine.createSpy('navigateToPluginDetails');
    pluginNavigationService.redirectToEvidencePool = jasmine.createSpy('redirectToEvidencePool');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onPremEventService.trackPluginNameClickEvent', () => {
    // Arrange
    // Act
    component.navigateToPluginPage(plugin);

    // Assert
    expect(onPremEventService.trackPluginNameClickEvent).toHaveBeenCalledWith(plugin);
  });

  it('should call onPremEventService.trackViewEvidenceClickEvent', () => {
    // Arrange
    // Act
    component.redirectToEvidencePool(plugin);

    // Assert
    expect(onPremEventService.trackViewEvidenceClickEvent).toHaveBeenCalledWith(plugin);
  });
});
