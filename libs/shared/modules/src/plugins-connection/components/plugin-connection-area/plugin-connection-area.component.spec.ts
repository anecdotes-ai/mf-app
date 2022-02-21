import { PluginFacadeService } from 'core/modules/data/services/facades';
import { PluginStaticStateComponent } from './../plugin-connection-states/plugin-static-state/plugin-static-state.component';
import { ComponentToSwitch } from './../../../component-switcher/models/component-to-switch';
import { ComponentSwitcherDirective } from './../../../component-switcher/directives/component-switcher/component-switcher.directive';
import { PluginConnectionFacadeService } from 'core/modules/plugins-connection/services/facades/plugin-connection-facade/plugin-connection-facade.service';
import { ConnectionStateSwitcherService } from './../../services/connection-state-switcher/connection-state-switcher.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PluginConnectionStates, PluginConnectionStaticStateSharedContext } from '../../models';
import { Observable, of, Subject } from 'rxjs';
import { PluginConnectionAreaComponent } from './plugin-connection-area.component';
import { Service } from 'core/modules/data/models/domain';
import { PluginConnectionEntity } from 'core/modules/plugins-connection/store/models';
import { Directive } from '@angular/core';

class ConnectionStateSwitcherServiceMock {
  get pluginConnectionStatePages(): ComponentToSwitch[] {
    return [
      {
        id: PluginConnectionStates.Generic_PluginSuccessfullyConnected,
        componentType: PluginStaticStateComponent,
      },
    ];
  }
}

@Directive({
  selector: '[componentsToSwitch]',
  exportAs: 'switcher',
})
class MockSwitcherDir {
  public sharedContext$ = new Subject<PluginConnectionStaticStateSharedContext>();

  goById = jasmine.createSpy('goById');
}

describe('PluginConnectionAreaComponent', () => {
  let component: PluginConnectionAreaComponent;
  let fixture: ComponentFixture<PluginConnectionAreaComponent>;
  let testingService: Service;
  let pluginConnectionFacade: PluginConnectionFacadeService;
  let connectionStateSwitcherService: ConnectionStateSwitcherService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PluginConnectionAreaComponent, MockSwitcherDir],
      providers: [
        { provide: ConnectionStateSwitcherService, useClass: ConnectionStateSwitcherServiceMock },
        {
          provide: PluginConnectionFacadeService,
          useValue: {
            getPluginConnectionEntity: (service: Service): Observable<PluginConnectionEntity> => {
              return of(null);
            },
          },
        },
        { provide: PluginFacadeService, useValue: {}},
        { provide: ComponentSwitcherDirective, useClass: MockSwitcherDir },
      ],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(PluginConnectionAreaComponent);
    pluginConnectionFacade = TestBed.inject(PluginConnectionFacadeService);
    connectionStateSwitcherService = TestBed.inject(ConnectionStateSwitcherService);

    testingService = {
      service_id: 'testing-service_id',
      service_auth_type: 'OAUTH',
      service_display_name: 'Display Name',
      service_type: 'GENERIC',
      service_status: 'SERVICE_INSTALLED',
    };

    // Setting pluginConnectionFacade mocks
    const pluginConnectionEntity: PluginConnectionEntity = {
      service_id: testingService.service_id,
      connection_state: PluginConnectionStates.Generic_PluginSuccessfullyConnected,
      instances_form_values: {},
    };
    pluginConnectionFacade.getPluginConnectionEntity = jasmine
      .createSpy('getPluginConnectionEntity')
      .and.returnValue(of(pluginConnectionEntity));

    // Setting connectionStateSwitcherService mocks
    spyOnProperty(connectionStateSwitcherService, 'pluginConnectionStatePages').and.returnValue([
      {
        id: PluginConnectionStates.Generic_PluginSuccessfullyConnected,
        componentType: PluginStaticStateComponent,
      },
    ]);

    // Initialize component with default data
    component = fixture.componentInstance;
    component.plugin = testingService;
    component.switcherSharedContext = {
      service: testingService,
    };
  });

  it('should create', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component).toBeTruthy();
  });
});
