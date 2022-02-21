import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DashboardFrameworksResolverService } from './dashboard-frameworks-resolver.service';
import { FrameworkService } from 'core/modules/data/services';
import { DashboardFrameworksSectionData } from '../../models';
import { CalculatedControl } from 'core/modules/data/models';
import { ControlStatusEnum } from 'core/modules/data/models/domain';
import { FrameworkStatus } from 'core/modules/data/models';

describe('DashboardFrameworksResolverService', () => {
  let service: DashboardFrameworksResolverService;
  let spyGetProgressFramework: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FrameworkService],
    });
    service = TestBed.inject(DashboardFrameworksResolverService);

    // Spies
    spyGetProgressFramework = spyOn(DashboardFrameworksResolverService, 'getProgressFramework').and.callThrough();
  });

  it('should be created', () => {
    // Assert
    expect(service).toBeTruthy();
  });

  describe('Test: getProgressFramework', () => {
    it('should return amount of progress', () => {
      // Arrange
      const mockReadyForAudit = 10;
      const mockInProgress = 20;
      const mockApprovedByAuditor = 20;
      const mockApplicableControls = 100;
      const progressValue = spyGetProgressFramework(mockReadyForAudit + mockInProgress + mockApprovedByAuditor, mockApplicableControls);

      // Assert
      expect(progressValue).toEqual(50);
    });
  });

  describe('Test: getFrameworkTabs', () => {
    it('framework should have applicable value and method should return array with model TabModel', () => {
      // Arrange
      const mockRelatedControls: CalculatedControl[] = [
        {
          control_category: 'Governance',
          control_has_automated_evidence_collected: false,
          control_is_applicable: true,
          control_number_of_missing_evidence: 1,
          control_number_of_requirements: 1,
          control_number_of_requirements_collected: 0,
          control_number_of_total_evidence_collected: 0,
          control_related_frameworks: ['ISO 27001:2013'],
          control_status: { status: 'NOT_STARTED'},
        },
        {
          control_category: 'Security Operations',
          control_has_automated_evidence_collected: true,
          control_is_applicable: true,
          control_number_of_missing_evidence: 0,
          control_number_of_requirements: 1,
          control_number_of_requirements_collected: 1,
          control_number_of_total_evidence_collected: 1,
          control_related_frameworks: ['ISO 27001:2013', 'SOC2'],
          control_status: { status: 'IN_PROGRESS'}
        },
      ];
      const mockData: DashboardFrameworksSectionData = {
        frameworksSectionItems: [
          {
            framework: {
              framework_id: '123123123123123',
              framework_name: 'ISO 27001:2013',
              is_applicable: true,
              framework_status: FrameworkStatus.AVAILABLE,
              number_of_related_controls: 88,
            },
            relatedControls: mockRelatedControls,
          },
        ],
      };
      let actionRequiredControlsData = [];
      mockData.frameworksSectionItems
        .filter((_frameworkSectionItem) => _frameworkSectionItem.framework.is_applicable)
        .forEach((frameworkSectionItem, index) => {
          actionRequiredControlsData = frameworkSectionItem.relatedControls.filter(
            (control) =>
              control.control_is_applicable &&
              (
                control.control_status.status === ControlStatusEnum.INPROGRESS ||
                control.control_status.status === ControlStatusEnum.READY_FOR_AUDIT ||
                control.control_status.status === ControlStatusEnum.APPROVED_BY_AUDITOR
              )
          );

          // Assert
          expect(actionRequiredControlsData).toEqual([
            {
              control_category: 'Security Operations',
              control_has_automated_evidence_collected: true,
              control_is_applicable: true,
              control_number_of_missing_evidence: 0,
              control_number_of_requirements: 1,
              control_number_of_requirements_collected: 1,
              control_number_of_total_evidence_collected: 1,
              control_related_frameworks: ['ISO 27001:2013', 'SOC2'],
              control_status: { status: ControlStatusEnum.INPROGRESS },
            },
          ]);
          expect(service.getFrameworkTabs(mockData)).toEqual([
            {
              translationKey: 'ISO 27001:2013',
              icon: `frameworks/${frameworkSectionItem.framework.framework_id}-70px`,
              tabId: 0,
              context: {
                framework: frameworkSectionItem.framework,
                actionRequiredControls: actionRequiredControlsData,
                categoriesControls: frameworkSectionItem.relatedControls,
              },
              progress: 50,
              progressColor: '#ff3499'
            },
          ]);
        });
    });
  });
});
