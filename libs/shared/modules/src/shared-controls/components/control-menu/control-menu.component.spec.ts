import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CalculatedControl } from 'core/modules/data/models';
import { ControlsFacadeService } from 'core/modules/data/services';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { ControlsReportService } from 'core/modules/shared-controls/services';
import { ControlsCustomizationModalService } from '../../modules/customization/control/services';
import { ControlMenuComponent } from './control-menu.component';

describe('ControlMenuComponent', () => {
  configureTestSuite();

  let componentUnderTest: ControlMenuComponent;
  let fixture: ComponentFixture<ControlMenuComponent>;

  let controlsFacadeServiceMock: ControlsFacadeService;
  let controlsCustomizationModalServiceMock: ControlsCustomizationModalService;
  let controlsReportServiceMock: ControlsReportService;

  const fakeControlId = 'fake_control_id';
  const fakeFrameworkId = 'fake_framework_id';
  let fakeCalculatedControl: CalculatedControl;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [ControlMenuComponent],
      providers: [
        { provide: ControlsFacadeService, useValue: {} },
        { provide: ControlsCustomizationModalService, useValue: {} },
        { provide: ControlsReportService, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlMenuComponent);
    componentUnderTest = fixture.componentInstance;

    controlsFacadeServiceMock = TestBed.inject(ControlsFacadeService);
    controlsCustomizationModalServiceMock = TestBed.inject(ControlsCustomizationModalService);
    controlsReportServiceMock = TestBed.inject(ControlsReportService);

    controlsFacadeServiceMock.getSingleControl = jasmine
      .createSpy('getSingleControl')
      .and.callFake(() => of(fakeCalculatedControl));


    fakeCalculatedControl = {
      control_id: fakeControlId,
    };
    componentUnderTest.controlId = fakeControlId;
    componentUnderTest.frameworkId = fakeFrameworkId;
  });

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('should create', () => {
    expect(componentUnderTest).toBeTruthy();
  });

  describe('calculatedControl', () => {
    it('should be got from control facaded by controlId input', async () => {
      // Arrange
      const expectedControlId = 'fake_id';
      const expectedCalculatedControl: CalculatedControl = {};
      componentUnderTest.controlId = expectedControlId;
      controlsFacadeServiceMock.getSingleControl = jasmine
        .createSpy('getSingleControl')
        .and.callFake(() => of(expectedCalculatedControl));

      // Act
      await detectChanges();

      // Assert
      expect(controlsFacadeServiceMock.getSingleControl).toHaveBeenCalledWith(expectedControlId);
      expect(componentUnderTest.calculatedControl).toBe(expectedCalculatedControl);
    });
  });

  describe('threeDotsMenuActions', () => {
    describe('edit action', () => {
      const menuActionIndex = 0;

      it('should have action that calls openEditCustomControlModal', async () => {
        // Arrange
        controlsCustomizationModalServiceMock.openEditCustomControlModal = jasmine.createSpy(
          'openEditCustomControlModal'
        );

        // Act
        await detectChanges();
        componentUnderTest.threeDotsMenuActions[menuActionIndex].action();

        // Assert
        expect(controlsCustomizationModalServiceMock.openEditCustomControlModal).toHaveBeenCalledWith(
          fakeFrameworkId,
          fakeControlId
        );
      });
    });

    describe('remove action', () => {
      const menuActionIndex = 1;

      describe('displayCondition', () => {
        it('should return true if control_is_custom is true', () => {
          // Arrange
          fakeCalculatedControl.control_is_custom = true;

          // Act
          const actual = componentUnderTest.threeDotsMenuActions[menuActionIndex].displayCondition(
            fakeCalculatedControl
          );

          // Assert
          expect(actual).toBeTrue();
        });

        it('should return false if control_is_custom is false', () => {
          // Arrange
          fakeCalculatedControl.control_is_custom = false;

          // Act
          const actual = componentUnderTest.threeDotsMenuActions[menuActionIndex].displayCondition(
            fakeCalculatedControl
          );

          // Assert
          expect(actual).toBeFalse();
        });
      });

      it('should have action that calls openRemoveCustomControlConfirmation', async () => {
        // Arrange
        controlsCustomizationModalServiceMock.openRemoveCustomControlConfirmation = jasmine.createSpy(
          'openRemoveCustomControlConfirmation'
        );

        // Act
        await detectChanges();
        componentUnderTest.threeDotsMenuActions[menuActionIndex].action();

        // Assert
        expect(controlsCustomizationModalServiceMock.openRemoveCustomControlConfirmation).toHaveBeenCalledWith(
          fakeControlId
        );
      });
    });

    describe('applicability action', () => {
      const menuActionIndex = 2;

      [true, false].forEach((applicabilityTestCase) => {
        describe(`when control applicability is ${applicabilityTestCase}`, () => {

          it(`should set flag isLoading to false after ngOnInit`, async () => {
            // Arrange
            // Act
            await detectChanges();
            componentUnderTest.ngOnInit();

            // Assert
            expect (componentUnderTest.isLoading).toBeFalse();
          });

          it(`should set isLoading false after calling function changeControlApplicability() proccess finished`, async () => {
            // Arrange
            fakeCalculatedControl.control_is_applicable = !applicabilityTestCase;
            controlsFacadeServiceMock.batchChangeApplicability = jasmine.createSpy('batchChangeApplicability');

            // Act
            await detectChanges();
            await componentUnderTest.threeDotsMenuActions[menuActionIndex].action();

            // Assert
            expect (componentUnderTest.isLoading).toBeFalse();
          });

          it(`should check that flag isLoading stay true if batchChangeApplicability is in progress`, async () => {
            // Arrange
            fakeCalculatedControl.control_is_applicable = !applicabilityTestCase;
            controlsFacadeServiceMock.batchChangeApplicability = jasmine.createSpy('batchChangeApplicability')
              .and
              .callFake(() => new Promise(() => {}) );

            // Act
            await detectChanges();
            componentUnderTest.threeDotsMenuActions[menuActionIndex].action();

            // Assert
            expect (componentUnderTest.isLoading).toBeTrue();
          });

          it(`should have action that calls batchChangeApplicability with ${applicabilityTestCase} value`, async () => {
            // Arrange
            fakeCalculatedControl.control_is_applicable = !applicabilityTestCase;
            controlsFacadeServiceMock.batchChangeApplicability = jasmine.createSpy('batchChangeApplicability');

            // Act
            await detectChanges();
            componentUnderTest.threeDotsMenuActions[menuActionIndex].action();

            // Assert
            expect(controlsFacadeServiceMock.batchChangeApplicability).toHaveBeenCalledWith(
              [fakeControlId],
              applicabilityTestCase
            );
          });
        });
      });
    });

    describe('generateReport action', () => {
      const menuActionIndex = 3;

      it('should have action that calls generateReport', async () => {
        // Arrange
        controlsReportServiceMock.generateReport = jasmine.createSpy('generateReport');

        // Act
        await detectChanges();
        componentUnderTest.threeDotsMenuActions[menuActionIndex].action();

        // Assert
        expect(controlsReportServiceMock.generateReport).toHaveBeenCalledWith([fakeControlId], fakeFrameworkId);
      });
    });
  });

  describe('threeDotsMenuClick', () => {
    it('should call stopPropagation', () => {
      // Arrange
      const fakeMouseEvent = new MouseEvent('click');
      spyOn(fakeMouseEvent, 'stopPropagation');

      // Act
      componentUnderTest.threeDotsMenuClick(fakeMouseEvent);

      // Assert
      expect(fakeMouseEvent.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('buildTranslationKey', () => {
    it('should build full key based on relative key', () => {
      // Arrange
      const fakeRelativeKey = 'fake';

      // Act
      const actual = componentUnderTest.buildTranslationKey(fakeRelativeKey);

      // Assert
      expect(actual).toBe(`controls.${fakeRelativeKey}`);
    });
  });
});
