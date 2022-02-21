import { TestBed } from '@angular/core/testing';
import { ControlsNavigator } from './controls-navigator.service';
import { ControlsFacadeService, FrameworksFacadeService, FrameworksEventService } from 'core/modules/data/services';
import { ControlsFocusingService } from '../controls-focusing/controls-focusing.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { CalculatedControl } from 'core/modules/data/models';
import { Framework } from 'core/modules/data/models/domain';
import { AppRoutes } from 'core';
import { ExploreControlsSource } from 'core';

describe('ControlsNavigator', () => {
  let serviceUnderTest: ControlsNavigator;

  let routerMock: Router;
  let controlsFocusingServiceMock: ControlsFocusingService;
  let frameworksFacadeServiceMock: FrameworksFacadeService;
  let controlsFacadeServiceMock: ControlsFacadeService;
  let frameworksEventService: FrameworksEventService;

  let fakeFramework: Framework;
  let fakeControl: CalculatedControl;
  let fakeRequirementId: string;
  let fakeEvidenceId: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ControlsNavigator,
        { provide: Router, useValue: {} },
        { provide: ControlsFocusingService, useValue: {} },
        { provide: FrameworksFacadeService, useValue: {} },
        { provide: ControlsFacadeService, useValue: {} },
        { provide: FrameworksEventService, useValue: {} },
      ],
    });
  });

  function assertNavigation(queryParams?: any): void {
    expect(routerMock.navigate).toHaveBeenCalledWith(
      [AppRoutes.Controls.replace(':framework', fakeFramework.framework_name)],
      {
        queryParams: queryParams === undefined ? {} : queryParams,
      }
    );
  }

  function assertNavigationWithApplicablity(controlIsAplicable: boolean): void {
    expect(routerMock.navigate).toHaveBeenCalledWith(
      [AppRoutes.Controls.replace(':framework', fakeFramework.framework_name)],
      {
        queryParams: {
          includeNotApplicable: controlIsAplicable ? 'yes' : 'no',
        },
      }
    );
  }

  beforeEach(() => {
    serviceUnderTest = TestBed.inject(ControlsNavigator);

    routerMock = TestBed.inject(Router);
    controlsFocusingServiceMock = TestBed.inject(ControlsFocusingService);
    frameworksFacadeServiceMock = TestBed.inject(FrameworksFacadeService);
    controlsFacadeServiceMock = TestBed.inject(ControlsFacadeService);
    frameworksEventService = TestBed.inject(FrameworksEventService);

    routerMock.navigate = jasmine.createSpy('navigate');
    frameworksFacadeServiceMock.getFrameworkById = jasmine
      .createSpy('getFrameworkById')
      .and.callFake(() => of(fakeFramework));
    controlsFacadeServiceMock.getControl = jasmine.createSpy('getControl').and.callFake(() => of(fakeControl));
    controlsFocusingServiceMock.focusControl = jasmine.createSpy('focusControl');
    controlsFocusingServiceMock.focusRequirement = jasmine.createSpy('focusRequirement');
    controlsFocusingServiceMock.focusEvidence = jasmine.createSpy('focusEvidence');
    frameworksEventService.trackExploreControlsClick  = jasmine.createSpy('trackExploreControlsClick');

    fakeFramework = { framework_id: 'fake-framework-id', framework_name: 'Fake Framework' };
    fakeControl = { control_id: 'fake-control-id', control_framework_id: 'fake-control_framework_id' };
    fakeRequirementId = 'fake-req-id';
    fakeEvidenceId = 'fake-ev-id';
  });

  [undefined, { someFilter: 'abc' }].forEach((filterTestCase) => {
    describe(`navigateToControlsPageAsync func when filter is ${filterTestCase ? 'specified' : 'undefined'}`, () => {
      it('should get framework by id', async () => {
        // Arrange
        // Act
        await serviceUnderTest.navigateToControlsPageAsync(fakeFramework.framework_id);

        // Assert
        expect(frameworksFacadeServiceMock.getFrameworkById).toHaveBeenCalledWith(fakeFramework.framework_id);
      });

      it('should call navigation with provided framework', async () => {
        // Arrange
        // Act
        await serviceUnderTest.navigateToControlsPageAsync(fakeFramework.framework_id, filterTestCase);

        // Assert
        assertNavigation(filterTestCase);
      });

      it('should track explore controls event', async () => {
        // Act
        await serviceUnderTest.navigateToControlsPageAsync(fakeFramework.framework_id, filterTestCase, ExploreControlsSource.FrameworkManager);

        // Assert
        expect(frameworksEventService.trackExploreControlsClick).toHaveBeenCalledWith(fakeFramework.framework_name, ExploreControlsSource.FrameworkManager);
      });
    });
  });

  describe('navigateToControlAsync func', () => {
    it('should get control by provided id', async () => {
      // Arrange
      // Act
      await serviceUnderTest.navigateToControlAsync(fakeControl.control_id);

      // Assert
      expect(controlsFacadeServiceMock.getControl).toHaveBeenCalledWith(fakeControl.control_id);
    });

    it('should get framework that provided control relates to', async () => {
      // Arrange
      // Act
      await serviceUnderTest.navigateToControlAsync(fakeControl.control_id);

      // Assert
      expect(frameworksFacadeServiceMock.getFrameworkById).toHaveBeenCalledWith(fakeControl.control_framework_id);
    });

    it('should call focusControl with control id', async () => {
      // Arrange
      // Act
      await serviceUnderTest.navigateToControlAsync(fakeControl.control_id);

      // Assert
      expect(controlsFocusingServiceMock.focusControl).toHaveBeenCalledWith(fakeControl.control_id);
    });

    [true, false].forEach((controlApplicabilityTestCase) => {
      describe(`when control applicability is ${controlApplicabilityTestCase}`, () => {
        it('should navigate to controls page with applicability filter', async () => {
          // Arrange
          fakeControl.control_is_applicable = controlApplicabilityTestCase;

          // Act
          await serviceUnderTest.navigateToControlAsync(fakeControl.control_id);

          // Assert
          assertNavigationWithApplicablity(controlApplicabilityTestCase);
        });
      });
    });
  });

  describe('navigateToRequirementAsync func', () => {
    it('should get control by provided id', async () => {
      // Arrange
      // Act
      await serviceUnderTest.navigateToRequirementAsync(fakeControl.control_id, fakeRequirementId);

      // Assert
      expect(controlsFacadeServiceMock.getControl).toHaveBeenCalledWith(fakeControl.control_id);
    });

    it('should get framework that provided control relates to', async () => {
      // Arrange
      // Act
      await serviceUnderTest.navigateToRequirementAsync(fakeControl.control_id, fakeRequirementId);

      // Assert
      expect(frameworksFacadeServiceMock.getFrameworkById).toHaveBeenCalledWith(fakeControl.control_framework_id);
    });

    it('should call focusRequirement with control id and requirement id', async () => {
      // Arrange
      // Act
      await serviceUnderTest.navigateToRequirementAsync(fakeControl.control_id, fakeRequirementId);

      // Assert
      expect(controlsFocusingServiceMock.focusRequirement).toHaveBeenCalledWith(
        fakeControl.control_id,
        fakeRequirementId
      );
    });

    [true, false].forEach((controlApplicabilityTestCase) => {
      describe(`when control applicability is ${controlApplicabilityTestCase}`, () => {
        it('should navigate to controls page with applicability filter', async () => {
          // Arrange
          fakeControl.control_is_applicable = controlApplicabilityTestCase;

          // Act
          await serviceUnderTest.navigateToRequirementAsync(fakeControl.control_id, fakeRequirementId);

          // Assert
          assertNavigationWithApplicablity(controlApplicabilityTestCase);
        });
      });
    });
  });

  describe('navigateToEvidenceAsync func', () => {
    it('should get control by provided id', async () => {
      // Arrange
      // Act
      await serviceUnderTest.navigateToEvidenceAsync(fakeControl.control_id, fakeEvidenceId);

      // Assert
      expect(controlsFacadeServiceMock.getControl).toHaveBeenCalledWith(fakeControl.control_id);
    });

    it('should get framework that provided control relates to', async () => {
      // Arrange
      // Act
      await serviceUnderTest.navigateToEvidenceAsync(fakeControl.control_id, fakeEvidenceId);

      // Assert
      expect(frameworksFacadeServiceMock.getFrameworkById).toHaveBeenCalledWith(fakeControl.control_framework_id);
    });

    it('should call focusEvidence with control id and requirement id', async () => {
      // Arrange
      // Act
      await serviceUnderTest.navigateToEvidenceAsync(fakeControl.control_id, fakeEvidenceId);

      // Assert
      expect(controlsFocusingServiceMock.focusEvidence).toHaveBeenCalledWith(fakeControl.control_id, fakeEvidenceId);
    });

    [true, false].forEach((controlApplicabilityTestCase) => {
      describe(`when control applicability is ${controlApplicabilityTestCase}`, () => {
        it('should navigate to controls page with applicability filter', async () => {
          // Arrange
          fakeControl.control_is_applicable = controlApplicabilityTestCase;

          // Act
          await serviceUnderTest.navigateToEvidenceAsync(fakeControl.control_id, fakeEvidenceId);

          // Assert
          assertNavigationWithApplicablity(controlApplicabilityTestCase);
        });
      });
    });
  });
});
