import { PluginNavigationService } from 'core/services/plugin-navigation-service/plugin-navigation-service.service';
import { Service, ServiceAvailabilityStatusEnum, ServiceStatusEnum } from 'core/modules/data/models/domain';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BigPluginItemComponent } from './big-plugin-item.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WindowHelperService } from 'core';
import { PluginService } from 'core/modules/data/services';
import { Router } from '@angular/router';
import { configureTestSuite } from 'ng-bullet';
import { Component, DebugElement, Input, ViewChild } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { PluginsEventService } from 'core/modules/plugins-connection/services/plugins-event-service/plugins-event.service';

class MockPluginNavigationService {
  navigateToPluginDetails(service_id: string): void {}
  navigateToPluginDetailsInNewTab(service_id: string): void {}
}

@Component({
  template: `<app-big-plugin-item #bigPlugin [pluginData]="plugin"></app-big-plugin-item>`,
})
class TestComponent {
  @ViewChild('bigPlugin')
  bigPluginComponent: BigPluginItemComponent;

  @Input() plugin: Service;
}

describe('BigPluginItemComponent', () => {
  configureTestSuite();

  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let pluginService: PluginService;
  let pluginNavigationService: MockPluginNavigationService;
  let windowHelper: WindowHelperService;
  let router: Router;
  let pluginsEventService: PluginsEventService;

  const routerMock = {
    navigate: jasmine.createSpy('navigate'),
  };

  const windowMock = {
    openUrlInNewTab: jasmine.createSpy('openUrlInNewTab'),
  };

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [BigPluginItemComponent, TestComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        PluginService,
        { provide: PluginService, useValue: {} },
        { provide: PluginNavigationService, useClass: MockPluginNavigationService },
        { provide: Router, useValue: routerMock },
        { provide: WindowHelperService, useValue: windowMock },
        { provide: PluginsEventService, useValue: {} }
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    pluginService = TestBed.inject(PluginService);
    windowHelper = TestBed.inject(WindowHelperService);
    pluginNavigationService = TestBed.inject(PluginNavigationService);

    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    component.plugin = { service_id: 'test-id', service_status: ServiceStatusEnum.INSTALLATIONFAILED };
    pluginService.getServiceIconLinkSync = jasmine.createSpy('getServiceIconLinkSync').and.returnValue('');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onInit', () => {
    it('should set serviceIcon property', async () => {
      // Arrange
      const icon = 'iconPath';

      pluginService.getServiceIconLinkSync = jasmine.createSpy('getServiceIconLinkSync').and.returnValue(icon);

      // Act
      await detectChanges();

      // Assert
      expect(component.bigPluginComponent.serviceIcon).toBe(icon);
    });
  });

  describe('Mouse Down handler', () => {
    let bigPluginComponent: DebugElement;
    const leftBtnPressedEvent = new MouseEvent('mousedown', { button: 0 });
    const middleBtnPressedEvent = new MouseEvent('mousedown', { button: 1 });

    beforeEach(() => {
      bigPluginComponent = fixture.debugElement.query(By.directive(BigPluginItemComponent));
      router.navigate = jasmine.createSpy('navigate');
      windowHelper.openUrlInNewTab = jasmine.createSpy('openUrlInNewTab');
      pluginNavigationService.navigateToPluginDetails = jasmine.createSpy('navigateToPluginDetails');
      pluginNavigationService.navigateToPluginDetailsInNewTab = jasmine.createSpy('navigateToPluginDetailsInNewTab');
      pluginsEventService = TestBed.inject(PluginsEventService);
      pluginsEventService.trackPluginClick = jasmine.createSpy('trackPluginClick');
    });

    it(`should not call navigateToPluginDetails service method when plugin is not in ${ServiceAvailabilityStatusEnum.AVAILABLE} status`, async () => {
      // Arrange
      component.plugin = { ...component.plugin, service_availability_status: ServiceAvailabilityStatusEnum.COMINGSOON };

      // Act
      await detectChanges();

      bigPluginComponent.triggerEventHandler('mousedown', {});

      // Assert
      expect(pluginNavigationService.navigateToPluginDetails).not.toHaveBeenCalled();
    });

    it(`should call navigateToPluginDetails method when plugin is in ${ServiceAvailabilityStatusEnum.AVAILABLE} status, and left mouse btn pressed in event`, async () => {
      // Arrange
      component.plugin = { ...component.plugin, service_availability_status: ServiceAvailabilityStatusEnum.AVAILABLE };

      // Act
      await detectChanges();

      const bigPluginAreClicked = new MouseEvent('mousedown', leftBtnPressedEvent);
      bigPluginComponent.triggerEventHandler('mousedown', bigPluginAreClicked);

      // Assert
      expect(pluginNavigationService.navigateToPluginDetails).toHaveBeenCalledWith(component.plugin.service_id);
    });

    it(`should call navigateToPluginDetails method when plugin is in ${ServiceAvailabilityStatusEnum.AVAILABLE} status, and middle mouse btn pressed in event`, async () => {
      // Arrange
      component.plugin = { ...component.plugin, service_availability_status: ServiceAvailabilityStatusEnum.AVAILABLE };

      // Act
      await detectChanges();

      const bigPluginAreClicked = new MouseEvent('mousedown', middleBtnPressedEvent);
      bigPluginComponent.triggerEventHandler('mousedown', bigPluginAreClicked);

      // Assert
      expect(pluginNavigationService.navigateToPluginDetailsInNewTab).toHaveBeenCalledWith(component.plugin.service_id);
    });

    it(`should call navigateToPluginDetails method when plugin is in ${ServiceAvailabilityStatusEnum.AVAILABLE} status, and middle mouse btn pressed in event`, async () => {
      // Arrange
      component.plugin = {
        ...component.plugin,
        service_availability_status: ServiceAvailabilityStatusEnum.AVAILABLE,
        service_status: ServiceStatusEnum.INSTALLED,
        service_evidence_list: [{}, {}],
        service_display_name: 'some-name',
        service_families: ['1', '2']};

      // Act
      await detectChanges();

      const bigPluginAreClicked = new MouseEvent('mousedown', middleBtnPressedEvent);
      bigPluginComponent.triggerEventHandler('mousedown', bigPluginAreClicked);

      // Assert
      expect(pluginsEventService.trackPluginClick).toHaveBeenCalledWith(component.plugin);
    });
  });

  describe('Host Bindings', () => {
    let bigPluginComponent: DebugElement;
    beforeEach(() => {
      bigPluginComponent = fixture.debugElement.query(By.directive(BigPluginItemComponent));
    });

    it(`should set class clickable when service availability status is ${ServiceAvailabilityStatusEnum.AVAILABLE}`, async () => {
      // Arrange
      component.plugin = { ...component.plugin, service_availability_status: ServiceAvailabilityStatusEnum.AVAILABLE };

      // Act
      await detectChanges();

      // Assert
      expect(bigPluginComponent.classes['clickable']).toBeTruthy();
    });

    it(`should not set class clickable when service availability status is not ${ServiceAvailabilityStatusEnum.AVAILABLE}`, async () => {
      // Arrange
      component.plugin = { ...component.plugin, service_availability_status: ServiceAvailabilityStatusEnum.COMINGSOON };

      // Act
      await detectChanges();

      // Assert
      expect(bigPluginComponent.classes['clickable']).toBeFalsy();
    });

    it(`should set id for host element according to service_id`, async () => {
      // Arrange
      component.plugin = { ...component.plugin, service_availability_status: ServiceAvailabilityStatusEnum.COMINGSOON };

      // Act
      await detectChanges();

      // Assert
      expect(bigPluginComponent.attributes['id']).toEqual(component.plugin.service_id);
    });
  });

  describe('statusBtn', () => {
    it('should have transparent background', async () => {

      // Act
      await detectChanges();

      // Assert
      expect(getComputedStyle(fixture.debugElement.query(By.css('.status-btn')).nativeElement).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    });
  });

  async function detectChanges(): Promise<any> {
    fixture.detectChanges();
    await fixture.whenStable();
  }
});
