import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MessageBusService } from 'core';
import { ControlsFacadeService, DataAggregationFacadeService } from 'core/modules/data/services';
import { configureTestSuite } from 'ng-bullet';
import { of, Subject } from 'rxjs';
import { SharedContextAccessorDirective } from '../../directives';
import { ControlContextService, ControlsFocusingService } from '../../services';
import { ControlsSwitcherModalsService } from './../../services/controls-switcher-modals/controls-switcher-modals.service';
import { ControlItemComponent } from './control-item.component';
import { GeneralEventService } from 'core/services/general-event-service/general-event.service';

describe('ControlItemComponent', () => {
  configureTestSuite();

  let component: ControlItemComponent;
  let fixture: ComponentFixture<ControlItemComponent>;

  let controlsFocusingServiceMock: ControlsFocusingService;
  let controlsFacadeServiceMock: ControlsFacadeService;
  let messageBusService: MessageBusService;
  let generalEventService: GeneralEventService;
  let dataAggregationService: DataAggregationFacadeService;

  beforeAll(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          { provide: ControlsFacadeService, useValue: {} },
          { provide: ControlContextService, useValue: {} },
          { provide: MessageBusService, useValue: {} },
          { provide: ControlsSwitcherModalsService, useValue: {} },
          { provide: ControlsFocusingService, useValue: {} },
          { provide: GeneralEventService, useValue: {} },
          { provide: DataAggregationFacadeService, useValue: {} },
        ],
        imports: [RouterTestingModule, TranslateModule.forRoot(), MatExpansionModule, BrowserAnimationsModule],
        declarations: [ControlItemComponent, SharedContextAccessorDirective],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlItemComponent);
    component = fixture.componentInstance;
    controlsFocusingServiceMock = TestBed.inject(ControlsFocusingService);
    controlsFocusingServiceMock.getSpecificControlExpandingStream = jasmine
      .createSpy('getSpecificControlExpandignStream')
      .and.callFake(() => of());
    controlsFacadeServiceMock = TestBed.inject(ControlsFacadeService);
    controlsFacadeServiceMock.getSingleControl = jasmine.createSpy('getSingleControl').and.callFake(() => of());
    controlsFacadeServiceMock.updateControlOwner = jasmine.createSpy('updateControlOwner');
    messageBusService = TestBed.inject(MessageBusService);
    messageBusService.getObservable = jasmine.createSpy('getObservable').and.callFake(() => of());

    dataAggregationService = TestBed.inject(DataAggregationFacadeService);

    component.controlInstance = {
      control_id: 'fake-control-id',
      control_name: 'some-name',
      control_category: 'some-category',
    };
    component.calculatedControl = {
      ...component.controlInstance,
    };
    component.framework = {
      framework_name: 'some-name',
    };

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('control focusing', () => {
    it('should subscribe to expansion focusing', () => {
      // Arrange
      // Act
      fixture.detectChanges();

      // Assert
      expect(controlsFocusingServiceMock.getSpecificControlExpandingStream).toHaveBeenCalledWith(
        component.controlInstance.control_id
      );
    });

    it('should expand component when control expanding is emitted', fakeAsync(() => {
      // Arrange
      const subject = new Subject<string>();
      controlsFocusingServiceMock.getSpecificControlExpandingStream = jasmine
        .createSpy('getSpecificControlExpandignStream')
        .and.callFake(() => subject);
      fixture.detectChanges();
      const matExpansionPanel = fixture.debugElement.query(By.directive(MatExpansionPanel)).componentInstance;
      matExpansionPanel.open = jasmine.createSpy('open');

      // Act
      fixture.detectChanges();
      subject.next(component.controlInstance.control_id);
      tick(700);

      // Assert
      expect(matExpansionPanel.open).toHaveBeenCalledWith();
    }));
  });
});
