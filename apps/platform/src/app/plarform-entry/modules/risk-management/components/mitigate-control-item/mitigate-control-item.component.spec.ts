import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { MitigateControlItem } from './mitigate-control-item.component';
import { RiskFacadeService } from 'core/modules/risk/services';
import { ControlsFacadeService } from 'core/modules/data/services';
import { ViewControlModalService } from 'core/modules/shared-controls';
import { Risk } from 'core/modules/risk/models';
import { CalculatedControl } from 'core/modules/data/models';

describe('MitigateControlItem', () => {
  configureTestSuite();

  let controlsFacadeServiceMock: ControlsFacadeService;
  let riskFacadeServiceMock: RiskFacadeService;
  let viewControlModalService: ViewControlModalService;
  let component: MitigateControlItem;
  let fixture: ComponentFixture<MitigateControlItem>;

  const mockRisk: Risk = { id: 'risk-id', mitigation_control_ids: ['control-id'] };
  const mockControl: CalculatedControl = { control_id: 'control-id' };

  beforeAll(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot()],
        declarations: [MitigateControlItem],
        providers: [
          { provide: RiskFacadeService, useValue: {} },
          { provide: ControlsFacadeService, useValue: {} },
          { provide: ViewControlModalService, useValue: {} },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    viewControlModalService = TestBed.inject(ViewControlModalService);
    viewControlModalService.openViewControlModal = jasmine.createSpy('viewControlModalService');
    controlsFacadeServiceMock = TestBed.inject(ControlsFacadeService);
    controlsFacadeServiceMock.getControl = jasmine.createSpy('getControl').and.returnValue(of(mockControl));
    riskFacadeServiceMock = TestBed.inject(RiskFacadeService);
    riskFacadeServiceMock.getRiskById = jasmine.createSpy('getRiskById').and.callFake(() => of(mockRisk));
    riskFacadeServiceMock.updateRiskMitigationControls = jasmine.createSpy('updateRiskMitigationControls');
    riskFacadeServiceMock.disconnectControlEvent = jasmine.createSpy('disconnectControlEvent');

    fixture = TestBed.createComponent(MitigateControlItem);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set risk with correct value', () => {
      // Act
      fixture.detectChanges();

      // Assert
      expect(component.risk).toEqual(mockRisk);
    });

    it('should set control with correct value', () => {
      // Act
      fixture.detectChanges();

      // Assert
      expect(component.control).toEqual(mockControl);
    });
  });

  describe('threeDotsMenuActions', () => {
    describe('removeControl action', () => {
      const menuActionIndex = 0;

      it('should call updateRiskMitigationControls when clicking on removeControl action', () => {
        // Arrange
        component.risk = mockRisk;
        component.control = mockControl;

        // Act
        fixture.detectChanges();
        component.threeDotsMenu[menuActionIndex].action();

        // Assert
        expect(riskFacadeServiceMock.updateRiskMitigationControls).toHaveBeenCalledWith(mockRisk.id, []);
      });
    });
  });
});
