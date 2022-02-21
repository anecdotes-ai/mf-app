import { CalculatedControl } from 'core/modules/data/models';
import { TestBed } from '@angular/core/testing';
import { DashboardCategoriesResolverService } from './dashboard-categories-resolver.service';
import { HttpClientModule } from '@angular/common/http';
import { Category } from '../../models';
import { ControlStatusEnum } from 'core/modules/data/models/domain';
import { getPercents } from 'core/utils/percentage.function';

describe('DashboardCategoriesResolverService', () => {
  let service: DashboardCategoriesResolverService;
  let mockCategory: Category;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(DashboardCategoriesResolverService);

    // MockData
    mockCategory = {
      category_name: 'Security Operations',
      control_automated: 9,
      framework_id: 'PCI-DSS v3.2.1',
      progress_status: [
        {
          descriptionTranslateKey: 'contentRows.notStarted',
          field: 'status',
          fieldValue: ControlStatusEnum.NOTSTARTED,
          hideIconWrapper: true,
          icon: 'status_not_started',
          value: 2,
          valueTypeToRepresent: 'NUMBER',
        },
        {
          descriptionTranslateKey: 'contentRows.inProgress',
          field: 'status',
          fieldValue: ControlStatusEnum.INPROGRESS,
          hideIconWrapper: true,
          icon: 'status_in_progress',
          value: 2,
          valueTypeToRepresent: 'NUMBER',
        },
        {
          descriptionTranslateKey: 'contentRows.compliant',
          field: 'status',
          fieldValue: ControlStatusEnum.COMPLIANT,
          hideIconWrapper: true,
          icon: 'status_complete',
          value: 8,
          valueTypeToRepresent: 'NUMBER',
        },
      ],
      status_indications: 83,
      values: [
        { control_status: { status: ControlStatusEnum.NOTSTARTED }, control_is_applicable: true },
        { control_status: { status: ControlStatusEnum.NOTSTARTED }, control_is_applicable: true },
        { control_status: { status: ControlStatusEnum.INPROGRESS }, control_is_applicable: true },
        { control_status: { status: ControlStatusEnum.NOTSTARTED }, control_is_applicable: true },
        { control_status: { status: ControlStatusEnum.APPROVED_BY_AUDITOR }, control_is_applicable: true },
        { control_status: { status: ControlStatusEnum.READY_FOR_AUDIT }, control_is_applicable: true },
        { control_status: { status: ControlStatusEnum.READY_FOR_AUDIT }, control_is_applicable: true },
        { control_status: { status: ControlStatusEnum.READY_FOR_AUDIT }, control_is_applicable: true },
        { control_status: { status: ControlStatusEnum.APPROVED_BY_AUDITOR }, control_is_applicable: true },
      ],
    };
  });

  it('should be created', () => {
    // Assert
    expect(service).toBeTruthy();
  });

  describe('Test: groupInCategories', () => {
    const mockControls = [
      {
        control_category: 'Governance',
        control_has_automated_evidence_collected: true,
        control_is_applicable: true,
      },
      {
        control_category: 'Data Protection',
        control_has_automated_evidence_collected: true,
        control_is_applicable: true,
      },
      {
        control_category: 'Physical Security',
        control_has_automated_evidence_collected: true,
        control_is_applicable: true,
      },
      {
        control_category: 'Secure Development',
        control_has_automated_evidence_collected: true,
        control_is_applicable: true,
      },
      {
        control_category: 'Human Resources',
        control_has_automated_evidence_collected: true,
        control_is_applicable: true,
      },
      {
        control_category: 'Network Security',
        control_has_automated_evidence_collected: true,
        control_is_applicable: true,
      },
      {
        control_category: 'Security Operations',
        control_has_automated_evidence_collected: true,
        control_is_applicable: true,
      },
      {
        control_category: 'Secure Development',
        control_has_automated_evidence_collected: false,
        control_is_applicable: true,
      },
      {
        control_category: 'Access Control',
        control_has_automated_evidence_collected: true,
        control_is_applicable: true,
      },
      {
        control_category: 'Logging & Incident Response',
        control_has_automated_evidence_collected: true,
        control_is_applicable: true,
      },
    ];
    const expectedCategories = [
      {
        category_name: 'Governance',
        control_automated: 1,
        values: [{ control_category: 'Governance', control_has_automated_evidence_collected: true, control_is_applicable: true }],
      },
      {
        category_name: 'Data Protection',
        control_automated: 1,
        values: [
          { control_category: 'Data Protection', control_has_automated_evidence_collected: true, control_is_applicable: true },
        ],
      },
      {
        category_name: 'Physical Security',
        control_automated: 1,
        values: [
          {
            control_category: 'Physical Security',
            control_has_automated_evidence_collected: true,
            control_is_applicable: true,
          },
        ],
      },
      {
        category_name: 'Secure Development',
        control_automated: 1,
        values: [
          {
            control_category: 'Secure Development',
            control_has_automated_evidence_collected: true,
            control_is_applicable: true,
          },
          {
            control_category: 'Secure Development',
            control_has_automated_evidence_collected: false,
            control_is_applicable: true,
          },
        ],
      },
      {
        category_name: 'Human Resources',
        control_automated: 1,
        values: [
          { control_category: 'Human Resources', control_has_automated_evidence_collected: true, control_is_applicable: true },
        ],
      },
      {
        category_name: 'Network Security',
        control_automated: 1,
        values: [
          { control_category: 'Network Security', control_has_automated_evidence_collected: true, control_is_applicable: true },
        ],
      },
      {
        category_name: 'Security Operations',
        control_automated: 1,
        values: [
          {
            control_category: 'Security Operations',
            control_has_automated_evidence_collected: true,
            control_is_applicable: true,
          },
        ],
      },
      {
        category_name: 'Access Control',
        control_automated: 1,
        values: [
          { control_category: 'Access Control', control_has_automated_evidence_collected: true, control_is_applicable: true },
        ],
      },
      {
        category_name: 'Logging & Incident Response',
        control_automated: 1,
        values: [
          {
            control_category: 'Logging & Incident Response',
            control_has_automated_evidence_collected: true,
            control_is_applicable: true,
          },
        ],
      },
    ];
    const expectedCategoriesFromBaseLine = [
      {
        category_name: 'Access Control',
        control_automated: 1,
        values: [
          { control_category: 'Access Control', control_has_automated_evidence_collected: true, control_is_applicable: true },
        ],
      },
      {
        category_name: 'Data Protection',
        control_automated: 1,
        values: [
          { control_category: 'Data Protection', control_has_automated_evidence_collected: true, control_is_applicable: true },
        ],
      },
      {
        category_name: 'Governance',
        control_automated: 1,
        values: [{ control_category: 'Governance', control_has_automated_evidence_collected: true, control_is_applicable: true }],
      },
      {
        category_name: 'Human Resources',
        control_automated: 1,
        values: [
          { control_category: 'Human Resources', control_has_automated_evidence_collected: true, control_is_applicable: true },
        ],
      },
      {
        category_name: 'Logging & Incident Response',
        control_automated: 1,
        values: [
          {
            control_category: 'Logging & Incident Response',
            control_has_automated_evidence_collected: true,
            control_is_applicable: true,
          },
        ],
      },
      {
        category_name: 'Network Security',
        control_automated: 1,
        values: [
          { control_category: 'Network Security', control_has_automated_evidence_collected: true, control_is_applicable: true },
        ],
      },
      {
        category_name: 'Physical Security',
        control_automated: 1,
        values: [
          {
            control_category: 'Physical Security',
            control_has_automated_evidence_collected: true,
            control_is_applicable: true,
          },
        ],
      },
      {
        category_name: 'Secure Development',
        control_automated: 1,
        values: [
          {
            control_category: 'Secure Development',
            control_has_automated_evidence_collected: true,
            control_is_applicable: true,
          },
          {
            control_category: 'Secure Development',
            control_has_automated_evidence_collected: false,
            control_is_applicable: true,
          },
        ],
      },
      {
        category_name: 'Security Operations',
        control_automated: 1,
        values: [
          {
            control_category: 'Security Operations',
            control_has_automated_evidence_collected: true,
            control_is_applicable: true,
          },
        ],
      },
    ];
    it('should return only categories from baseLine if baseLine === true', () => {
      // Arrange
      const mockControlsExtraCat = [
        ...mockControls,
        ,
        {
          control_category: 'CustomCat',
          control_has_automated_evidence_collected: true,
          control_is_applicable: true,
        },
        {
          control_category: 'CustomCat',
          control_has_automated_evidence_collected: true,
          control_is_applicable: true,
        },
      ];

      // Act
      const categories = service.groupInCategories(mockControlsExtraCat, true);

      // Assert
      expect(categories).toEqual(expectedCategoriesFromBaseLine);
    });
    it('should return all categories from if baseLine === false', () => {
      // Arrange
      const mockControlsExtraCat = [
        ...mockControls,
        ,
        {
          control_category: 'Zzz',
          control_has_automated_evidence_collected: true,
          control_is_applicable: true,
        },
        {
          control_category: 'Zzz',
          control_has_automated_evidence_collected: true,
          control_is_applicable: true,
        },
      ];
      const expectedControlsNoBase = [
        ...expectedCategories,
        {
          category_name: 'Zzz',
          control_automated: 2,
          values: [
            {
              control_category: 'Zzz',
              control_has_automated_evidence_collected: true,
              control_is_applicable: true,
            },
            {
              control_category: 'Zzz',
              control_has_automated_evidence_collected: true,
              control_is_applicable: true,
            },
          ],
        },
      ];

      // Act
      const categories = service.groupInCategories(mockControlsExtraCat, false);

      // Assert
      expect(categories).toEqual(expectedControlsNoBase);
    });
    it('should return all categories from baseline if baseLine === true and not all categories are in data', () => {
      // Arrange
      const mockControlsReduced = [...mockControls];
      const popedItem = mockControlsReduced.pop();

      const indx = expectedCategoriesFromBaseLine.findIndex((x) => x.category_name === popedItem.control_category);
      expectedCategoriesFromBaseLine[indx] = { ...expectedCategoriesFromBaseLine[indx], control_automated: 0, values: [] };

      // Act
      const categories = service.groupInCategories(mockControlsReduced, true);

      // Assert
      expect(categories).toEqual(expectedCategoriesFromBaseLine);
    });
  });

  describe('Test: filterControlsInCategories', () => {
    it('should call method getRelatedContentRows and return it result', () => {
      // Arrange
      const categories = [mockCategory, mockCategory];
      const filterControlsInCategories = service.filterControlsInCategories(categories);

      // Act
      const handlingCategories = categories.map((category) => {
        const categoryWithOnlyApplicableControls = {
          ...category,
          values: category.values.filter((c) => c.control_is_applicable),
        };
        return service.getRelatedContentRows(categoryWithOnlyApplicableControls);
      });

      // Assert
      expect(filterControlsInCategories).toEqual(handlingCategories);
    });
  });

  describe('Test: joinProgressToCategory', () => {
    let categories: Category[];
    const frameworkId = 'PCI-DSS v3.2.1';

    beforeEach(() => {
      categories = [mockCategory, mockCategory];
    });

    it('should return categories with new property "framework_id", "status_indications","progress_status" and calculate  ', () => {
      // Arrange
      // Act
      service.joinProgressToCategory(categories, frameworkId);

      // Assert
      categories.forEach((category) => {
        expect(category).toEqual(
          jasmine.objectContaining({
            category_name: 'Security Operations',
            control_automated: 9,
            framework_id: frameworkId,
            progress_status: jasmine.anything()
          })
        );
      });
    });

    it('should calculate "status_indications" by (In progress + ready for audit + approved by auditor) / all controls logic', () => {
      // Arrange
      // Act
      service.joinProgressToCategory(categories, frameworkId);

      // Assert
      categories.forEach((category) => {
        expect(category).toEqual(
          jasmine.objectContaining({
            status_indications: 67,
          })
        );
      });
    });

    it('should return percentage', () => {
      // Arrange
      const sumNecessaryControls = 55;
      const totalCollection = 100;

      // Act
      const percentage = Number(getPercents(sumNecessaryControls, totalCollection));

      // Assert
      expect(percentage).toBe(55);
    });
  });

  describe('filterControlsByFramework()', () => {
    it('should return only controls related to provided framework', () => {
      // Arrange
      const controls : CalculatedControl[] =
      [
        {
          control_category: 'Access Control',
          control_has_automated_evidence_collected: true,
          control_is_applicable: true,
          control_related_frameworks_names : {'name1':[]}

        },
        {
          control_category: 'Data Protection',
          control_has_automated_evidence_collected: true,
          control_is_applicable: true,
          control_related_frameworks_names : {'name2':[]}

        },
        {
          control_category: 'Physical Security',
          control_has_automated_evidence_collected: true,
          control_is_applicable: true,
          control_related_frameworks_names : {'name3':[]}
        }
      ];

      const expectedControls : CalculatedControl[] = [{
        control_category: 'Access Control',
        control_has_automated_evidence_collected: true,
        control_is_applicable: true,
        control_related_frameworks_names : {'name1':[]}
      }];

      // Act
      const filtratedControls = service.filterControlsByFramework(controls, {framework_name: 'name1'});

      // Assert
      expect(filtratedControls).toEqual(expectedControls);
    });
  });
});
