import { TestBed } from '@angular/core/testing';
import { MANUAL } from '../../../constants';
import { ControlRequirement, EvidenceInstance } from '../../../models/domain';
import { RequirementCalculationService } from './requirement-calculation.service';

describe('Service: RequirementCalculation', () => {
  let serviceUnderTest: RequirementCalculationService;

  const fakeRequirement: ControlRequirement = {
    requirement_id: 'fake-id',
    requirement_name: 'fake-name',
    requirement_applicability: true,
    requirement_has_pending_slack_task: true,
    requirement_help: 'fake-requirement-help',
    evidence_that_fulfil: ['fake-evidence-1', 'fake-evidence-2'],
    evidence_automation: true,
    requirement_edited_by: 'fake-requirement_edited_by',
    requirement_last_edit_time: '',
    requirement_evidence_ids: ['fake-evidence-id'],
    requirement_is_custom: true,
    requirement_note_exists: true,
  };

  const mappingTestCases: [string, (req: ControlRequirement) => any][] = [
    ['requirement_id', (req) => req.requirement_id],
    ['requirement_name', (req) => req.requirement_name],
    ['requirement_applicability', (req) => req.requirement_applicability],
    ['requirement_has_pending_slack_task', (req) => req.requirement_has_pending_slack_task],
    ['requirement_help', (req) => req.requirement_help],
    ['evidence_automation', (req) => req.evidence_automation],
    ['requirement_edited_by', (req) => req.requirement_edited_by],
    ['requirement_evidence_ids', (req) => req.requirement_evidence_ids],
    ['requirement_is_custom', (req) => req.requirement_is_custom],
    ['requirement_note_exists', (req) => req.requirement_note_exists],
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequirementCalculationService],
    });

    serviceUnderTest = TestBed.inject(RequirementCalculationService);
  });

  // describe('fields mapping', () => {
  //   mappingTestCases.forEach(([propertyName, selector]) => {
  //     it(`should return CalculatedControl where ${propertyName} assigned with value from ControlRequirement`, () => {
  //       // Arrange
  //       // Act
  //       const calculatedRequirement = serviceUnderTest.calculateRequirement(fakeRequirement, []);

  //       // Assert
  //       expect(selector(calculatedRequirement)).toEqual(selector(fakeRequirement));
  //     });
  //   });

  //   [undefined, null, []].forEach((requirementRelatedEvidence) => {
  //     it(`should return empty array for requirement_related_evidences if requirementRelatedEvidence param is ${JSON.stringify(
  //       requirementRelatedEvidence
  //     )}`, () => {
  //       // Arrange
  //       // Act
  //       const calculatedRequirement = serviceUnderTest.calculateRequirement(
  //         fakeRequirement,
  //         requirementRelatedEvidence
  //       );

  //       // Assert
  //       expect(calculatedRequirement.requirement_related_evidences).toEqual([]);
  //     });
  //   });

  //   it('should return sorted evidence by service_id and evidence_name and MANUAL evidence goes last', () => {
  //     // Arrange
  //     const requirementRelatedEvidence: EvidenceInstance[] = [ // should be sorted incorrectly
  //       { evidence_name: 'manualFile.json', evidence_service_id: MANUAL },
  //       { evidence_name: 'airplaneGithub', evidence_service_id: 'github' },
  //       { evidence_name: 'kingdomSnowflake', evidence_service_id: 'snowflake' },
  //       { evidence_name: 'SomethingGithub', evidence_service_id: 'github' }, // when evidence has name with uppercase
  //       { evidence_name: 'coffeeGitlab', evidence_service_id: 'gitlab' },
  //       { evidence_name: 'somethingGithub', evidence_service_id: 'github' }, // when evidence has name with lowercase
  //       { evidence_name: 'SameManualFile.json', evidence_service_id: MANUAL },
  //     ];

  //     // Act
  //     const calculatedRequirement = serviceUnderTest.calculateRequirement(fakeRequirement, requirementRelatedEvidence);

  //     // Assert
  //     expect(calculatedRequirement.requirement_related_evidences.map(x => x.name)).toEqual([
  //       'airplaneGithub',
  //       'SomethingGithub',
  //       'somethingGithub',
  //       'coffeeGitlab',
  //       'kingdomSnowflake',
  //       'manualFile.json',
  //       'SameManualFile.json'
  //     ]);
  //   });
  // });
});
