import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PoliciesFacadeService } from 'core/modules/data/services';
import { MessageBusService } from 'core';
import { spyOnMessageBusMethods } from 'core/utils/testing';
import { PolicyComponent } from './policy.component';
import { CustomizationModalService } from 'core/modules/customization/services';
import { AccountFeaturesService, ExclusiveFeatureModalService } from 'core/modules/account-features';
import { configureTestSuite } from 'ng-bullet';
import { PolicyModalService } from 'core/modules/shared-policies/services';
import { of } from 'rxjs';
import { PolicyManagerEventService } from 'core/services/policy-manager-event-service/policy-manager-event.service';
import { EvidenceCollectionModalService } from 'core/modules/shared-controls';

describe('PolicyComponent', () => {
  configureTestSuite();

  let component: PolicyComponent;
  let fixture: ComponentFixture<PolicyComponent>;
  let messageBusService: MessageBusService;
  let accountFeatures: AccountFeaturesService;
  let exclusiveModel: ExclusiveFeatureModalService;
  let policiesFacade: PoliciesFacadeService;
  let policyManagerEventService: PolicyManagerEventService;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [PolicyComponent],
      providers: [
        { provide: MessageBusService, useValue: {} },
        { provide: CustomizationModalService, useValue: {} },
        { provide: PoliciesFacadeService, useValue: {} },
        { provide: AccountFeaturesService, useValue: {} },
        { provide: ExclusiveFeatureModalService, useValue: {} },
        { provide: PolicyModalService, useValue: {} },
        { provide: PolicyManagerEventService, useValue: {} },
        { provide: EvidenceCollectionModalService, useValue: {} }
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyComponent);

    messageBusService = TestBed.inject(MessageBusService);
    spyOnMessageBusMethods(messageBusService);

    accountFeatures = TestBed.inject(AccountFeaturesService);

    exclusiveModel = TestBed.inject(ExclusiveFeatureModalService);
    exclusiveModel.openExclusiveFeatureModal = jasmine.createSpy('openExclusiveFeatureModal');

    policiesFacade = TestBed.inject(PoliciesFacadeService);
    policiesFacade.downloadPolicyTemplate = jasmine.createSpy('downloadPolicyTemplate');

    policyManagerEventService = TestBed.inject(PolicyManagerEventService);
    policyManagerEventService.trackUploadPolicyFileEvent = jasmine.createSpy('trackUploadPolicyFileEvent');
    policyManagerEventService.trackDownloadPolicyTemplateEvent = jasmine.createSpy('trackDownloadPolicyTemplateEvent');

    component = fixture.componentInstance;
    component.policy = { policy_id: 'policy1', policy_name: 'policyName' };
  });

  describe('#downloadTemplate', () => {
    it(`should call exclusiveModel.openExclusiveFeatureModal when doesAccountHaveFeature is false`, async () => {
      // Arrange
      accountFeatures.doesAccountHaveFeature = jasmine.createSpy('doesAccountHaveFeature').and.returnValue(of(false));

      // Act
      fixture.detectChanges();
      await fixture.whenStable();
      component.downloadTemplate();

      // Assert
      expect(policyManagerEventService.trackDownloadPolicyTemplateEvent).toHaveBeenCalledWith(component.policy);
      expect(exclusiveModel.openExclusiveFeatureModal).toHaveBeenCalled();
    });

    it(`should call policiesFacade.downloadPolicyTemplate when doesAccountHaveFeature is true`, async () => {
      // Arrange
      accountFeatures.doesAccountHaveFeature = jasmine.createSpy('doesAccountHaveFeature').and.returnValue(of(true));

      // Act
      fixture.detectChanges();
      await fixture.whenStable();
      component.downloadTemplate();

      // Assert
      expect(policyManagerEventService.trackDownloadPolicyTemplateEvent).toHaveBeenCalledWith(component.policy);
      expect(policiesFacade.downloadPolicyTemplate).toHaveBeenCalled();
    });
  });
});
