import { Service } from 'core/modules/data/models/domain';
import { PluginConnectionFacadeService } from 'core/modules/plugins-connection/services/facades/plugin-connection-facade/plugin-connection-facade.service';
import { ComponentSwitcherDirective } from './../../../../component-switcher/directives/component-switcher/component-switcher.directive';
import { PluginConnectionStaticStateSharedContext } from './../../../models/plugin-static-content.model';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { PluginGenericConnectionComponent } from './plugin-generic-connection.component';
import { configureTestSuite } from 'ng-bullet';

class MockSwitcherDir {
  public sharedContext$ = new Subject<PluginConnectionStaticStateSharedContext>();

  goById = jasmine.createSpy('goById');
}

describe('PluginGenericConnectionComponent', () => {
  configureTestSuite();

  let component: PluginGenericConnectionComponent;
  let fixture: ComponentFixture<PluginGenericConnectionComponent>;
  let pluginConnectionFacade: PluginConnectionFacadeService;
  let switcher: MockSwitcherDir;

  let testService: Service;

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      declarations: [PluginGenericConnectionComponent],
      providers: [
        { provide: ComponentSwitcherDirective, useClass: MockSwitcherDir },
        { provide: PluginConnectionFacadeService, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PluginGenericConnectionComponent);
    component = fixture.componentInstance;

    pluginConnectionFacade = TestBed.inject(PluginConnectionFacadeService);
    switcher = TestBed.inject(ComponentSwitcherDirective) as any;

    testService = {
      service_id: 'testService',
      service_auth_url: 'testURL',
    };

    fixture.detectChanges();
  });

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Life cicle hooks', () => {
    describe('OnInit', () => {
      beforeEach(() => {
        pluginConnectionFacade.setState = jasmine.createSpy('setState');
      });

      it('should save Service data from switcher context', async () => {
        // Arrange
        switcher.sharedContext$.next({ service: testService });

        // Act
        await detectChanges();

        // Assert
        expect(component.service).toBe(testService);
      });
    });
  });

  describe('Event handlers', () => {
    const eventObject = {
      allValues: { first: 'aaa', second: 'bbb' },
      dirtyValues: { second: 'bbb' },
    };

    describe('installationHandler', () => {
      it('call connectPlugin from plugin connection facade service with proper values', async () => {
        // Arrange
        pluginConnectionFacade.connectPlugin = jasmine.createSpy('connectPlugin');
        switcher.sharedContext$.next({ service: testService });
        await detectChanges();

        // Act
        component.installationHandler(eventObject);

        // Assert
        expect(pluginConnectionFacade.connectPlugin).toHaveBeenCalledWith(testService, eventObject.allValues);
      });
    });

    describe('reconnectHandler', () => {
      it('call reconnect method from plugin connection facade service with proper values', async () => {
        // Arrange
        pluginConnectionFacade.reconnectPlugin = jasmine.createSpy('reconnectHandler');
        switcher.sharedContext$.next({ service: testService });
        await detectChanges();

        // Act
        component.installationHandler(eventObject);

        // Assert
        expect(pluginConnectionFacade.connectPlugin).toHaveBeenCalledWith(testService, eventObject.allValues);
      });
    });
  });
});
