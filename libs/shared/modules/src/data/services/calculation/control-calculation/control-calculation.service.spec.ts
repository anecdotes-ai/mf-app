import { TestBed } from '@angular/core/testing';
import {Control, ControlStatusEnum, EvidenceStatusEnum} from '../../../models/domain';
import { MANUAL } from 'core/modules/data/constants';
import { CalculatedRequirement } from '../../../models';

import { ControlCalculationService } from './control-calculation.service';

describe('ControlCalculationService', () => {
  let service: ControlCalculationService;
  let fakeControl: Control;
  let fakeControlRelatedRequirements: CalculatedRequirement[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ControlCalculationService],
    });
    service = TestBed.inject(ControlCalculationService);
    fakeControl = {
      control_requirement_ids: [],
      control_status: { status: "NOT_STARTED" as ControlStatusEnum }
    };
    fakeControlRelatedRequirements = [];
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Control number of missing evidence', () => {
    it('should be subtraction difference between control number of requirements and collected control number of requirements', () => {
      // Arrange
      fakeControlRelatedRequirements = [
        {
          requirement_applicability: true,
          requirement_related_evidences: [{ is_applicable: true }],
          requirement_name: '',
        },
        { requirement_applicability: true, requirement_related_evidences: [], requirement_name: '' },
      ];

      // Act
      const calculatedControl = service.calculateControl(fakeControl, fakeControlRelatedRequirements);

      // Assert
      expect(calculatedControl.control_number_of_missing_evidence).toEqual(1);
    });
  });

  describe('Control related requirements', () => {
    it('should contain all requirenments', () => {
      // Arrange
      const frst_requirenment_id = 'fst_req_id';
      const scnd_requirenment_id = 'scnd_req_id';
      fakeControlRelatedRequirements = [
        { requirement_id: frst_requirenment_id, requirement_name: 'fake1' },
        { requirement_id: scnd_requirenment_id, requirement_name: 'fake2' },
      ];
      fakeControl.control_requirement_ids = [frst_requirenment_id, scnd_requirenment_id];

      // Act
      const calculatedControl = service.calculateControl(fakeControl, fakeControlRelatedRequirements);

      // Assert
      expect(calculatedControl.control_calculated_requirements.length).toEqual(2);
    });
  });

  describe('Control number of requirenments', () => {
    it('should be equal to number of applicable requirements', () => {
      // Arrange
      fakeControlRelatedRequirements = [
        { requirement_applicability: true, requirement_related_evidences: [], requirement_name: '' },
        { requirement_applicability: true, requirement_related_evidences: [], requirement_name: '' },
        { requirement_applicability: false, requirement_related_evidences: [], requirement_name: '' },
      ];

      // Act
      const calculatedControl = service.calculateControl(fakeControl, fakeControlRelatedRequirements);

      // Assert
      expect(calculatedControl.control_number_of_requirements).toBe(2);
    });
  });

  describe('Automating services ids', () => {
    it('should contain not manual unique evidence service ids', () => {
      // Arrange
      const frst_service_id = 'first_not_manual_service';
      const scnd_service_id = 'second_not_manual_service';

      fakeControlRelatedRequirements = [
        {
          requirement_applicability: true,
          requirement_name: '',
          requirement_related_evidences: [
            { id: '1', is_applicable: true, service_id: MANUAL },
            { id: '2', is_applicable: true, service_id: frst_service_id },
          ],
        },
        {
          requirement_applicability: true,
          requirement_name: '',
          requirement_related_evidences: [
            { id: '3', is_applicable: true, service_id: scnd_service_id },
            { id: '4', is_applicable: true, service_id: scnd_service_id },
          ],
        },
      ];

      // Act
      const calculatedControl = service.calculateControl(fakeControl, fakeControlRelatedRequirements);

      // Assert
      [frst_service_id, scnd_service_id].forEach((testCase) =>
        expect(calculatedControl.automating_services_ids).toContain(testCase)
      );
      expect(calculatedControl.automating_services_ids.length).toBe(2);
    });
  });

  describe('Control has evidence collected', () => {
    it('should be true if control has applicable evidence', () => {
      // Arrange
      fakeControlRelatedRequirements = [
        {
          requirement_applicability: true,
          requirement_name: '',
          requirement_related_evidences: [{ id: '1', is_applicable: true }],
        },
      ];

      // Act
      const calculatedControl = service.calculateControl(fakeControl, fakeControlRelatedRequirements);

      // Assert
      expect(calculatedControl.control_has_automated_evidence_collected).toBeTrue();
    });

    it('should be false if control has no applicable evidence', () => {
      // Arrange
      fakeControlRelatedRequirements = [
        {
          requirement_applicability: true,
          requirement_name: '',
          requirement_related_evidences: [{ id: '1', is_applicable: false }],
        },
      ];

      // Act
      const calculatedControl = service.calculateControl(fakeControl, fakeControlRelatedRequirements);

      // Assert
      expect(calculatedControl.control_has_automated_evidence_collected).toBeFalse();
    });
  });

  // describe('Control collected applicable evidence ids', () => {
  //   it('should contain ids of not manual evidence', () => {
  //     // Arrange
  //     const frst_id = '1';
  //     const scnd_id = '2';

  //     fakeControlRelatedRequirements = [
  //       {
  //         requirement_applicability: true,
  //         requirement_name: '',
  //         requirement_related_evidences: [
  //           { id: frst_id, is_applicable: true, type: EvidenceTypeEnum.LIST },
  //           { id: scnd_id, is_applicable: true, type: EvidenceTypeEnum.APP },
  //         ],
  //       },
  //       {
  //         requirement_applicability: true,
  //         requirement_name: '',
  //         requirement_related_evidences: [{ id: '3', is_applicable: true, type: EvidenceTypeEnum.MANUAL }],
  //       },
  //     ];

  //     // Act
  //     const calculatedControl = service.calculateControl(fakeControl, fakeControlRelatedRequirements);

  //     // Assert
  //     [frst_id, scnd_id].forEach((testCase) =>
  //       expect(calculatedControl.control_collected_applicable_ids).toContain(testCase)
  //     );
  //     expect(calculatedControl.control_collected_applicable_ids.length).toEqual(2);
  //   });
  // });

  describe('Automating services display name', () => {
    it('should be equal to number of unique not manual service display names', () => {
      // Arrange
      fakeControlRelatedRequirements = [
        {
          requirement_applicability: true,
          requirement_name: '',
          requirement_related_evidences: [
            { id: '1', is_applicable: true, service_display_name: MANUAL, evidence: { evidence_service_display_name: MANUAL } },
            { id: '2', is_applicable: true, service_display_name: 'name', evidence: { evidence_service_display_name: 'name' } },
          ],
        },
        {
          requirement_applicability: true,
          requirement_name: '',
          requirement_related_evidences: [
            {
              id: '3',
              is_applicable: true,
              service_display_name: 'another name',
              evidence: { evidence_service_display_name: 'another name' },
            },
          ],
        },
      ];

      // Act
      const calculatedControl = service.calculateControl(fakeControl, fakeControlRelatedRequirements);

      // Assert
      expect(calculatedControl.automating_services_display_name.length).toEqual(2);
    });

    it('should contain unique not manual service display names', () => {
      // Arrange
      const frst_evidence_service_display_name = 'not manual first';
      const scnd_evidence_service_display_name = 'not manual second';

      fakeControlRelatedRequirements = [
        {
          requirement_applicability: true,
          requirement_name: '',
          requirement_related_evidences: [
            {
              id: '1',
              is_applicable: true,
              service_display_name: frst_evidence_service_display_name,
              evidence: {
                evidence_service_display_name: frst_evidence_service_display_name,
              },
            },
            {
              id: '2',
              is_applicable: true,
              service_display_name: scnd_evidence_service_display_name,
              evidence: {
                evidence_service_display_name: scnd_evidence_service_display_name,
              },
            },
            {
              id: '3',
              is_applicable: true,
              service_display_name: scnd_evidence_service_display_name,
              evidence: {
                evidence_service_display_name: scnd_evidence_service_display_name,
              },
            },
          ],
        },
        {
          requirement_applicability: true,
          requirement_name: '',
          requirement_related_evidences: [
            { id: '4', is_applicable: true, service_display_name: MANUAL, evidence: { evidence_service_display_name: MANUAL } },
          ],
        },
      ];

      // Act
      const calculatedControl = service.calculateControl(fakeControl, fakeControlRelatedRequirements);

      // Assert
      expect(calculatedControl.automating_services_display_name.length).toBe(2);
      expect(calculatedControl.automating_services_display_name).toContain(frst_evidence_service_display_name);
      expect(calculatedControl.automating_services_display_name).toContain(scnd_evidence_service_display_name);
    });
  });

  describe('Control number of requirements collected', () => {
    it('should be equal to number of applicable requirements that contain at least one applicable evidence', () => {
      // Arrange
      fakeControlRelatedRequirements = [
        {
          requirement_applicability: true,
          requirement_name: '',
          requirement_related_evidences: [{ is_applicable: true }, { is_applicable: true }],
        },
        {
          requirement_applicability: true,
          requirement_name: '',
          requirement_related_evidences: [{ is_applicable: true }],
        },
        {
          requirement_applicability: true,
          requirement_name: '',
          requirement_related_evidences: [{ is_applicable: false }],
        },
      ];

      // Act
      const calculatedControl = service.calculateControl(fakeControl, fakeControlRelatedRequirements);

      // Assert
      expect(calculatedControl.control_number_of_requirements_collected).toEqual(2);
    });
  });

  describe('Control number of total evidence collected', () => {
    it('should be equal to number of collected applicable evidence', () => {
      // Arrange
      fakeControlRelatedRequirements = [
        {
          requirement_applicability: true,
          requirement_name: '',
          requirement_related_evidences: [
            { id: 'first', is_applicable: true },
            { id: 'second', is_applicable: true },
          ],
        },
        {
          requirement_applicability: true,
          requirement_name: '',
          requirement_related_evidences: [{ id: 'third', is_applicable: false }],
        },
      ];

      // Act
      const calculatedControl = service.calculateControl(fakeControl, fakeControlRelatedRequirements);

      // Assert
      expect(calculatedControl.control_number_of_total_evidence_collected).toEqual(2);
    });
  });

  describe('Control any new evidence', () => {
    it('should be true when control has evidence with status NEW', () => {
      // Arrange
      fakeControlRelatedRequirements = [
        {
          requirement_applicability: true,
          requirement_name: '',
          requirement_related_evidences: [
            { id: '1', is_applicable: true, status: EvidenceStatusEnum.NEW },
            { id: '2', is_applicable: true },
          ],
        },
        {
          requirement_applicability: true,
          requirement_name: '',
          requirement_related_evidences: [{ id: '3', is_applicable: true }],
        },
      ];

      // Act
      const calculatedControl = service.calculateControl(fakeControl, fakeControlRelatedRequirements);

      // Assert
      expect(calculatedControl.control_any_new_evidence).toBeTrue();
    });

    [EvidenceStatusEnum.MITIGATED, EvidenceStatusEnum.NOTMITIGATED].forEach((statusEnum) => {
      it(`should be false when there are only evidence with ${statusEnum}`, () => {
        // Arrange
        fakeControlRelatedRequirements = [
          {
            requirement_applicability: true,
            requirement_name: '',
            requirement_related_evidences: [{ id: '1', is_applicable: true, status: statusEnum }],
          },
          {
            requirement_applicability: true,
            requirement_name: '',
            requirement_related_evidences: [{ id: '3', is_applicable: true }],
          },
        ];

        // Act
        const calculatedControl = service.calculateControl(fakeControl, fakeControlRelatedRequirements);

        // Assert
        expect(calculatedControl.control_any_new_evidence).toBeFalse();
      });
    });
  });

  describe('Control any marked evidence', () => {
    it('should be true when control has evidence with status NOTMITIGATED', () => {
      // Arrange
      fakeControlRelatedRequirements = [
        {
          requirement_applicability: true,
          requirement_name: '',
          requirement_related_evidences: [
            { id: '1', is_applicable: true, status: EvidenceStatusEnum.NOTMITIGATED },
            { id: '2', is_applicable: true },
          ],
        },
      ];

      // Act
      const calculatedControl = service.calculateControl(fakeControl, fakeControlRelatedRequirements);

      // Assert
      expect(calculatedControl.control_any_marked_evidence).toBeTrue();
    });

    [EvidenceStatusEnum.MITIGATED, EvidenceStatusEnum.NEW].forEach((statusEnum) => {
      it(`should be false when there are only evidence with ${statusEnum}`, () => {
        // Arrange
        fakeControlRelatedRequirements = [
          {
            requirement_applicability: true,
            requirement_name: '',
            requirement_related_evidences: [{ id: '1', is_applicable: true, status: statusEnum }],
          },
        ];

        // Act
        const calculatedControl = service.calculateControl(fakeControl, fakeControlRelatedRequirements);

        // Assert
        expect(calculatedControl.control_any_marked_evidence).toBeFalse();
      });
    });
  });

  describe('Control evidence names', () => {
    it('should contain all applicable evidence names', () => {
      // Arrange
      const frst_evidence_name = 'first applicable evidence';
      const scnd_evidence_name = 'second applicable evidence';

      fakeControlRelatedRequirements = [
        {
          requirement_applicability: true,
          requirement_name: '',
          requirement_related_evidences: [
            { is_applicable: true, name: frst_evidence_name },
            { is_applicable: true, name: scnd_evidence_name },
          ],
        },
        {
          requirement_applicability: true,
          requirement_name: '',
          requirement_related_evidences: [{ is_applicable: false, name: 'not applicable evidence' }],
        },
      ];

      // Act
      const calculatedControl = service.calculateControl(fakeControl, fakeControlRelatedRequirements);

      // Assert
      expect(calculatedControl.control_evidence_names).toContain(frst_evidence_name);
      expect(calculatedControl.control_evidence_names).toContain(scnd_evidence_name);
    });

    it('should be falsy when control does not contain any applicable evidence names', () => {
      // Arrange
      fakeControlRelatedRequirements = [
        { requirement_applicability: true, requirement_name: '', requirement_related_evidences: [] },
        {
          requirement_applicability: true,
          requirement_name: '',
          requirement_related_evidences: [{ is_applicable: false, name: 'not applicable evidence' }],
        },
      ];

      // Act
      const calculatedControl = service.calculateControl(fakeControl, fakeControlRelatedRequirements);

      // Assert
      expect(calculatedControl.control_evidence_names).toBeFalsy();
    });
  });

  describe('Control requirements names', () => {
    it('should contain applicable requirenment names', () => {
      // Arrange
      const frst_requirenment_name = 'first';
      const scnd_requirenment_name = 'second';

      fakeControlRelatedRequirements = [
        {
          requirement_applicability: true,
          requirement_related_evidences: [],
          requirement_name: frst_requirenment_name,
        },
        {
          requirement_applicability: true,
          requirement_related_evidences: [],
          requirement_name: scnd_requirenment_name,
        },
        { requirement_applicability: false, requirement_related_evidences: [], requirement_name: '' },
      ];

      // Act
      const calculatedControl = service.calculateControl(fakeControl, fakeControlRelatedRequirements);

      // Assert
      expect(calculatedControl.control_requirements_names).toContain(frst_requirenment_name);
      expect(calculatedControl.control_requirements_names).toContain(scnd_requirenment_name);
    });

    it('should be falsy when control requirenment names are empty', () => {
      // Arrange
      fakeControlRelatedRequirements = [
        { requirement_applicability: true, requirement_related_evidences: [], requirement_name: '' },
        { requirement_applicability: true, requirement_related_evidences: [], requirement_name: '' },
      ];

      // Act
      const calculatedControl = service.calculateControl(fakeControl, fakeControlRelatedRequirements);

      // Assert
      expect(calculatedControl.control_requirements_names).toBeFalsy();
    });

    it('should be falsy when control does not contain applicable requirenments', () => {
      // Arrange
      fakeControlRelatedRequirements = [
        { requirement_applicability: false, requirement_related_evidences: [], requirement_name: 'name' },
        { requirement_applicability: false, requirement_related_evidences: [], requirement_name: 'another name' },
      ];

      // Act
      const calculatedControl = service.calculateControl(fakeControl, fakeControlRelatedRequirements);

      // Assert
      expect(calculatedControl.control_requirements_names).toBeFalsy();
    });
  });

  describe('Control calculated requirements', () => {
    it('should have requirements sorted by requirement name', () => {
      // Arrange
      const frst_calculated_requirenment: CalculatedRequirement = { requirement_name: 'b_name' };
      const scnd_calculated_requirenment: CalculatedRequirement = { requirement_name: 'a_name' };
      const thrd_calculated_requirenment: CalculatedRequirement = { requirement_name: 'c_name' };
      fakeControlRelatedRequirements = [
        frst_calculated_requirenment,
        scnd_calculated_requirenment,
        thrd_calculated_requirenment,
      ];

      // Act
      const calculatedControl = service.calculateControl(fakeControl, fakeControlRelatedRequirements);

      // Assert
      expect(calculatedControl.control_calculated_requirements).toEqual([
        scnd_calculated_requirenment,
        frst_calculated_requirenment,
        thrd_calculated_requirenment,
      ]);
    });
  });
});
