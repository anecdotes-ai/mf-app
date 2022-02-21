import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PolicyPreviewComponent } from './policy-preview.component';
import { PoliciesFacadeService } from 'core/modules/data/services';
import { PolicyModalService } from 'core/modules/shared-policies/services';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { configureTestSuite } from 'ng-bullet';

describe('PolicyPreviewComponent', () => {
  configureTestSuite();

  let component: PolicyPreviewComponent;
  let fixture: ComponentFixture<PolicyPreviewComponent>;
  let policiesFacade: PoliciesFacadeService;
  let policyModal: PolicyModalService;

  const policy = {
    policy_id: 'blobi'
  };

  beforeAll(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [PolicyPreviewComponent],
      providers: [
        { provide: PolicyModalService, useValue: {} },
        { provide: PoliciesFacadeService, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyPreviewComponent);
    component = fixture.debugElement.componentInstance;

    policiesFacade = TestBed.inject(PoliciesFacadeService);
    policiesFacade.getPolicy = jasmine.createSpy('getPolicy').and.callFake(() => of(policy));

    policyModal = TestBed.inject(PolicyModalService);
    policyModal.addPolicySettingsModal = jasmine.createSpy('addPolicySettingsModal').and.callFake(() => {});
  });

  describe('#openFullDocumentClick', () => {
    it('should call `viewDocument` emitter', () => {
      // Arange
      spyOn(component.viewDocument, 'emit');

      // Act
      component.openFullDocumentClick();

      // Assert
      expect(component.viewDocument.emit).toHaveBeenCalledWith();
    });
  });

  describe('#openPolicySettings', () => {
    it('should call policyModalService.addPolicySettingsModal with policyId', () => {
      // Arange
      component.policy = policy;

      // Act
      component.openPolicySettings();

      // Assert
      expect(policyModal.addPolicySettingsModal).toHaveBeenCalledWith({ policyId: policy.policy_id });
    });
  });
});
