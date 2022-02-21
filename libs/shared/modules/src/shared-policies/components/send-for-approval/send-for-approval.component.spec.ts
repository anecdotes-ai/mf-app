import { Clipboard } from '@angular/cdk/clipboard';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { SendForApproval } from '../../constants/modal-ids.constants';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { PoliciesFacadeService } from 'core/modules/data/services';
import { ModalWindowService } from 'core/modules/modals';
import { BehaviorSubject, of } from 'rxjs';
import { SendForApprovalComponent } from './send-for-approval.component';
import { ShareMethodEnum } from 'core/modules/data/models/domain';
import { PolicyManagerEventService } from 'core/services/policy-manager-event-service/policy-manager-event.service';
import { CalculatedPolicy, ResourceStatusEnum } from 'core/modules/data/models';

class MockSwitcherDir {
  currentComponent: any = { id: 'id' };
  sharedContext$ = new BehaviorSubject<{
    policyId?: string;
    leftCornerText?: string;
    approverEmail?: string;
    translationKey?: string;
    isResend?: boolean
  }>({ leftCornerText: 'bla', policyId: 'bla', approverEmail: 'alsobla', isResend: true});

  goById = jasmine.createSpy('goById');
}

describe('SendForApprovalComponent', () => {
  let component: SendForApprovalComponent;
  let fixture: ComponentFixture<SendForApprovalComponent>;
  let switcher: ComponentSwitcherDirective;
  let policyFacade: PoliciesFacadeService;

  const policy: CalculatedPolicy = {
    policy_name: 'policy',
    status: ResourceStatusEnum.ON_HOLD
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SendForApprovalComponent],
      providers: [
        { provide: PoliciesFacadeService, useValue: {} },
        { provide: ComponentSwitcherDirective, useClass: MockSwitcherDir },
        { provide: ModalWindowService, useValue: {} },
        { provide: PolicyManagerEventService, useValue: {} },
        Clipboard,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendForApprovalComponent);
    switcher = TestBed.inject(ComponentSwitcherDirective);
    component = fixture.componentInstance;

    policyFacade = TestBed.inject(PoliciesFacadeService);
    policyFacade.getPolicy = jasmine.createSpy('getPolicy').and.returnValue(of(policy));
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  [
    { componentType: SendForApproval.Share, shareMethod: ShareMethodEnum.Email, expected: 'send' },
    { componentType: SendForApproval.Share, shareMethod: ShareMethodEnum.Link, expected: 'copy' },
    { componentType: SendForApproval.Shared, shareMethod: ShareMethodEnum.Link, expected: 'copied' },
    { componentType: SendForApproval.Shared, shareMethod: ShareMethodEnum.Email, expected: 'send' },
    { componentType: SendForApproval.ReShare, shareMethod: ShareMethodEnum.Link, expected: 'copy' },
    { componentType: SendForApproval.ReShare, shareMethod: ShareMethodEnum.Email, expected: 'send' },
  ].forEach((testCase) => {
    describe(`#buildActionButton - when shareMethod is ${testCase.shareMethod} and componentType is ${testCase.componentType}`, () => {
      it(`its value should be ${testCase.expected}`, fakeAsync(() => {
        // Arrange
        switcher.currentComponent = { id: testCase.componentType, componentType: testCase.componentType };

        // Act
        fixture.detectChanges();
        tick();
        component.formGroup.items.share_method.value = testCase.shareMethod;
        const result = component.buildActionButton();
        const expectedResult = component.buildTranslationKey(testCase.expected);

        // Expect
        expect(result).toEqual(expectedResult);
      }));
    });
  });
});
