import { TestBed } from '@angular/core/testing';
import { AccountFeatureEnum } from 'core/modules/data/models/domain';
import { ModalWindowService } from 'core/modules/modals';
import { ExclusiveFeatureModalComponent } from '../../components';
import { ExclusiveFeatureModalService } from './exclusive-feature-modal.service';

describe('ExclusiveFeatureModalService', () => {
  let serviceUnderTest: ExclusiveFeatureModalService;
  let modalWindowService: ModalWindowService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExclusiveFeatureModalService, { provide: ModalWindowService, useValue: {} }],
    });
    serviceUnderTest = TestBed.inject(ExclusiveFeatureModalService);

    modalWindowService = TestBed.inject(ModalWindowService);
    modalWindowService.openInSwitcher = jasmine.createSpy('openInSwitcher');
  });

  it('should be created', () => {
    expect(serviceUnderTest).toBeTruthy();
  });

  describe('#openExclusiveFeatureModal', () => {
    [AccountFeatureEnum.AdoptFramework, AccountFeatureEnum.PolicyTemplates].forEach((feature) => {
      it(`should call modalWindowService.openInSwitcher with proper parameters when context ${feature}`, () => {
        // Act
        serviceUnderTest.openExclusiveFeatureModal(feature);

        // Assert
        expect(modalWindowService.openInSwitcher).toHaveBeenCalledWith({
          componentsToSwitch: [
            {
              id: 'exclusive-feature-modal',
              componentType: ExclusiveFeatureModalComponent,
            },
          ],
          context: { feature },
        });
      });
    });
  });
});
