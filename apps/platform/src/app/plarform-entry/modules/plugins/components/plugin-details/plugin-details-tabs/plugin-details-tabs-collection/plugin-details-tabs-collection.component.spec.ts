import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageBusService } from 'core/services';
import { UserEventService } from 'core/services/user-event/user-event.service';
import { PluginDetailsTabsCollectionComponent } from './plugin-details-tabs-collection.component';
import {
  PluginsEventService,
} from 'core/modules/plugins-connection/services/plugins-event-service/plugins-event.service';
import { Service } from 'core/modules/data/models/domain';
import { TabNames } from 'core';

describe('PluginDetailsTabsCollectionComponent', () => {
  let component: PluginDetailsTabsCollectionComponent;
  let fixture: ComponentFixture<PluginDetailsTabsCollectionComponent>;
  let pluginsEventService: PluginsEventService;
  const service: Service = {service_display_name: 'some-name', service_families: ['1', '2']};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [PluginDetailsTabsCollectionComponent],
      providers: [{ provide: UserEventService, useValue: {} }, MessageBusService, {provide: PluginsEventService, useValue: {}}],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PluginDetailsTabsCollectionComponent);
    component = fixture.componentInstance;
    pluginsEventService = TestBed.inject(PluginsEventService);
    pluginsEventService.trackTabNavigation = jasmine.createSpy('trackTabNavigation');

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Amplitude events sending', ()=>{
    it('should call if tabChange() called and shouldSendEvent === true', () => {
      //Arrange
      component.shouldSendEvent = true;
      component.service = service;

      //Act
      component.tabChange('logs');

      //Assert
      expect(pluginsEventService.trackTabNavigation).toHaveBeenCalledWith(service, TabNames['logs']);
    });
  });
});
