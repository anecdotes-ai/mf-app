import { TestBed } from '@angular/core/testing';

import { EvidencePreviewService } from './evidence-preview.service';
import { ModalWindowService } from 'core/modules/modals';
import { EvidencePreviewHostComponent } from 'core/modules/shared-controls/components/preview/evidence-preview-host/evidence-preview-host.component';

describe('EvidencePreviewService', () => {
  let service: EvidencePreviewService;
  let modalWindowService: ModalWindowService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ModalWindowService, useValue: {} }],
    });
    service = TestBed.inject(EvidencePreviewService);

    modalWindowService = TestBed.inject(ModalWindowService);
    modalWindowService.openInSwitcher = jasmine.createSpy('openInSwitcher');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call modalWindowService.open when openEvidencePreviewModal is called', () => {
    // Arrange

    // Act
    service.openEvidencePreviewModal({});

    // Assert
    expect(modalWindowService.openInSwitcher).toHaveBeenCalledWith({
      componentsToSwitch: [
        {
          id: 'evidence-preview-modal',
          componentType: EvidencePreviewHostComponent,
          contextData: {},
        },
      ],
    });
  });
});
