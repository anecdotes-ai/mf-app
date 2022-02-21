import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PluginStaticStateTipComponent } from './plugin-static-state-tip.component';
import { configureTestSuite } from 'ng-bullet';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { OnPremEventService } from 'core/services/on-prem-event-service/on-prem-event.service';
import { TipTypeEnum } from 'core';

describe('PluginStaticStateTipComponent', () => {
  configureTestSuite();

  let component: PluginStaticStateTipComponent;
  let fixture: ComponentFixture<PluginStaticStateTipComponent>;
  let onPremEventService: OnPremEventService;

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      declarations: [PluginStaticStateTipComponent],
      providers: [
        { provide: Router, useValue: {} },
        { provide: OnPremEventService, useValue: {} },
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PluginStaticStateTipComponent);
    component = fixture.componentInstance;
    component.service = { service_tooltips: [] };

    onPremEventService = TestBed.inject(OnPremEventService);
    onPremEventService.trackNavigationFromPluginToConnectorsEvent = jasmine.createSpy(
      'trackNavigationFromPluginToConnectors'
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('permanent tip should be displayed if service is on-prem', () => {
    // Arrange
    component.service = { service_is_onprem: true };
    fixture.detectChanges();

    // Act
    const permanentTip = fixture.debugElement.query(By.css('.permanent-tip')).nativeElement;

    //Assert
    expect(permanentTip).toBeTruthy();
  });

  it('permanent tip should not be displayed if service is on-prem', () => {
    // Arrange
    component.service = { service_is_onprem: false };
    fixture.detectChanges();

    // Act
    const permanentTip = fixture.debugElement.query(By.css('.permanent-tip'));

    //Assert
    expect(permanentTip).toBeFalsy();
  });

  it('tip should be displayed if service tips property is defined', () => {
    // Arrange
    component.service = {
      service_is_onprem: false,
      service_tooltips: [{ type: 'INFO' as TipTypeEnum, permanent: true, text: 'some-text' }],
    };
    fixture.detectChanges();

    // Act
    const serviceTips = fixture.debugElement.queryAll(By.css('.service-tip'));

    //Assert
    expect(serviceTips.length).toBeTruthy();
  });

  it('tip should not be displayed if service tips property is defined', () => {
    // Arrange
    component.service = {
      service_is_onprem: false,
      service_tooltips: [],
    };
    fixture.detectChanges();

    // Act
    const serviceTips = fixture.debugElement.queryAll(By.css('.service-tip'));

    //Assert
    expect(serviceTips.length).toBeFalsy();
  });

  it("should call onPremEventService.trackNavigationFromPluginToConnectorsEvent", () => {
    // Arrange

    // Act
    component.openOnPremTipLink();

    //Assert
    expect(onPremEventService.trackNavigationFromPluginToConnectorsEvent).toHaveBeenCalledWith();
  });
});
