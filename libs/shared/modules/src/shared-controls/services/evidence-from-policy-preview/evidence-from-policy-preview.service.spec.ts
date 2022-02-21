import { TestBed } from '@angular/core/testing';
import { ModalWindowService } from 'core/modules/modals';
import { EvidenceFromPolicyPreviewComponent } from '../../components/preview/evidence-from-policy-preview/evidence-from-policy-preview.component';
import { EvidenceFromPolicyModalsContext, EvidenceFromPolicyPreviewService } from './evidence-from-policy-preview.service';

describe('EvidenceFromPolicyPreviewService', () => {
  let service: EvidenceFromPolicyPreviewService;
  let modalWindowService: ModalWindowService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ModalWindowService, useValue: {} }],
    });
    service = TestBed.inject(EvidenceFromPolicyPreviewService);

    modalWindowService = TestBed.inject(ModalWindowService);
    modalWindowService.openInSwitcher = jasmine.createSpy('openInSwitcher');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call modalWindowService.open when openEvidenceFromPolicyPreviewModal is called', () => {
    // Arrange
    // Act
    service.openEvidenceFromPolicyPreviewModal({} as EvidenceFromPolicyModalsContext);

    // Assert
    expect(modalWindowService.openInSwitcher).toHaveBeenCalledWith({
      componentsToSwitch: [
        {
          id: 'evidence-from-policy-preview-modal',
          componentType: EvidenceFromPolicyPreviewComponent,
        },
      ],
      context: {},
    });
  });
});
