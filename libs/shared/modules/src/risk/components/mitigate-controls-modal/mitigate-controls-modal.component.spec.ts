import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { WindowHelperService } from 'core/services';
import { has } from 'lodash';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { Risk } from '../../models';
import { CalculatedControl } from 'core/modules/data/models';
import { Framework } from 'core/modules/data/models/domain';
import { RiskFacadeService } from '../../services';
import { ControlsFacadeService, FrameworksFacadeService } from 'core/modules/data/services';
import { MitigateControlsModalComponent, MitigateControlsModalEnum } from './mitigate-controls-modal.component';
import { map } from 'rxjs/operators';

describe('MitigateControlsModalComponent', () => {
  configureTestSuite();
  let fixture: ComponentFixture<MitigateControlsModalComponent>;
  let component: MitigateControlsModalComponent;

  let controlsFacadeService: ControlsFacadeService;
  let riskFacadeService: RiskFacadeService;
  let frameworksFacadeService: FrameworksFacadeService;
  let translateService: TranslateService;
  let switcher: ComponentSwitcherDirective;

  const mockRisk: Risk = { id: 'risk-id', mitigation_control_ids: ['control-id'] };
  const mockControl: CalculatedControl = { control_id: 'control-id2' };
  const mockFrameworks: Framework[] = [{ framework_id: 'framework-id' }];
  const fakeContext = { risk: mockRisk };

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ControlsFacadeService, useValue: {} },
        { provide: RiskFacadeService, useValue: {} },
        { provide: FrameworksFacadeService, useValue: {} },
        { provide: TranslateService, useValue: {} },
        { provide: ComponentSwitcherDirective, useValue: {} },
        { provide: WindowHelperService, useValue: {} },
      ],
      declarations: [MitigateControlsModalComponent],
    });

    switcher = TestBed.inject(ComponentSwitcherDirective);
    switcher.sharedContext$ = of({}).pipe(map(() => fakeContext));
    switcher.goById = jasmine.createSpy('goById');
    switcher.changeContext = jasmine.createSpy('changeContext');

    translateService = TestBed.inject(TranslateService);
    translateService.instant = jasmine.createSpy('instant');

    controlsFacadeService = TestBed.inject(ControlsFacadeService);
    controlsFacadeService.getControlsByFrameworkId = jasmine.createSpy('getControlsByFrameworkId');

    riskFacadeService = TestBed.inject(RiskFacadeService);
    riskFacadeService.updateRiskMitigationControls = jasmine.createSpy('updateRiskMitigationControls');
    riskFacadeService.linkControlEvent = jasmine.createSpy('linkControlEvent').and.returnValue(undefined);

    frameworksFacadeService = TestBed.inject(FrameworksFacadeService);
    frameworksFacadeService.getApplicableFrameworks = jasmine
      .createSpy('getApplicableFrameworks')
      .and.callFake(() => of(mockFrameworks));

    fixture = TestBed.createComponent(MitigateControlsModalComponent);
    component = fixture.componentInstance;
  });

  it('should be able to create component instance', () => {
    expect(component).toBeDefined();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(MitigateControlsModalComponent);
      component = fixture.componentInstance;
    });

    it('should set frameworks with correct value', () => {
      // Act
      fixture.detectChanges();

      // Assert
      expect(component.frameworks).toEqual(mockFrameworks);
    });

    it('should set risk with correct value', () => {
      // Act
      fixture.detectChanges();

      // Assert
      expect(component.risk).toEqual(mockRisk);
    });

    it('should set correct values in form', () => {
      // Act
      fixture.detectChanges();

      // Assert
      expect(has(component.form.items, 'framework')).toBeTruthy();
      expect(has(component.form.items, 'control')).toBeTruthy();
    });
  });

  describe('linkControl', () => {
    const editedRiskMock: Risk = {
      id: mockRisk.id,
      mitigation_control_ids: [...mockRisk.mitigation_control_ids, mockControl.control_id],
    };

    it('should call updateRiskMitigationControls', async () => {
      // Arrange
      component.risk = mockRisk;
      // Act
      fixture.detectChanges();
      component.form.items['control'].setValue(mockControl);
      await component.linkControl();

      // // Assert
      expect(riskFacadeService.updateRiskMitigationControls).toHaveBeenCalledWith(
        mockRisk.id,
        editedRiskMock.mitigation_control_ids
      );
    });

    it('should call changeContext with edited risk', async () => {
      // Arrange
      component.risk = mockRisk;
      riskFacadeService.updateRiskMitigationControls = jasmine
        .createSpy('updateRiskMitigationControls')
        .and.returnValue(editedRiskMock);

      // Act
      fixture.detectChanges();
      await component.linkControl();

      // // Assert
      expect(switcher.changeContext).toHaveBeenCalledWith({ risk: editedRiskMock });
    });

    it('should call goById with success value', async () => {
      // Act
      fixture.detectChanges();
      await component.linkControl();

      // // Assert
      expect(switcher.goById).toHaveBeenCalledWith(MitigateControlsModalEnum.Success);
    });

    it('should call goById with error value when updateRiskMitigationControls throw error', async () => {
      // Arrange
      riskFacadeService.updateRiskMitigationControls = jasmine
        .createSpy('updateRiskMitigationControls')
        .and.throwError(new Error());

      // Act
      fixture.detectChanges();
      await component.linkControl();

      // // Assert
      expect(switcher.goById).toHaveBeenCalledWith(MitigateControlsModalEnum.Error);
    });
  });
});
