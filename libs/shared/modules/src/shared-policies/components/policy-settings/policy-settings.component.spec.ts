import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PolicySettingsComponent } from './policy-settings.component';
import { of } from 'rxjs';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { PoliciesFacadeService } from 'core/modules/data/services';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { configureTestSuite } from 'ng-bullet';
import { ApproverInstance, Policy, PolicySettings } from 'core/modules/data/models/domain';
import { TranslateModule } from '@ngx-translate/core';
import { PolicySettingsModalEnum } from '../../constants/modal-ids.constants';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SettingsContext } from '../../models/settings-context';
import { PolicyRoleComponent } from '../policy-role/policy-role.component';

describe('PolicySettingsComponent', () => {
  configureTestSuite();

  let component: PolicySettingsComponent;
  let fixture: ComponentFixture<PolicySettingsComponent>;
  let policiesFacade: PoliciesFacadeService;
  let switcherMock: ComponentSwitcherDirective;

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  const translationKey = 'fakeTranslationKey';
  const policy: Policy = { policy_id: 'some-policy-id' };
  const owner: ApproverInstance = {
    role: 'owner',
    email: 'some-owner-email',
    name: 'some-owner-name'
  };
  const approver: ApproverInstance = {
    role: 'approver',
    email: 'some-approver-email',
    name: 'some-approver-name'
  };
  const policySettings: PolicySettings = {
    owner: owner,
    approvers: [ approver ]
  };
  const fakeContext: SettingsContext = {
    translationKey: translationKey,
    policyId: policy.policy_id,
    policySettings: policySettings
  };
  const steps = [
    PolicySettingsModalEnum.Owner,
    PolicySettingsModalEnum.Reviewers,
    PolicySettingsModalEnum.Approvers,
    PolicySettingsModalEnum.Scheduling
  ];

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ PolicySettingsComponent, PolicyRoleComponent ],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ComponentSwitcherDirective, useValue: {} },
        { provide: PoliciesFacadeService, useValue: {} }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicySettingsComponent);
    component = fixture.componentInstance;

    switcherMock = TestBed.inject(ComponentSwitcherDirective);
    switcherMock.sharedContext$ = of(fakeContext);
    switcherMock.changeContext = jasmine.createSpy('changeContext').and.returnValue(fakeContext);
    switcherMock.goById = jasmine.createSpy('goById');
    switcherMock.goNext = jasmine.createSpy('goNext');
    policiesFacade = TestBed.inject(PoliciesFacadeService);
    policiesFacade.getPolicy = jasmine.createSpy('getPolicy').and.returnValue(of(policy));
    policiesFacade.editPolicySettings = jasmine.createSpy('editPolicySettings');
    component.steps = steps;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('isAddMoreVisible getter', () => {

    it('isAddMoreVisible should return true', () => {
      //Arrange
      component.stage = PolicySettingsModalEnum.Approvers;

      //Act
      fixture.detectChanges();

      //Assert
      expect(component.isAddMoreVisible).toBeTruthy();
    });

    it('isAddMoreVisible should return false', () => {
      //Arrange
      component.stage = PolicySettingsModalEnum.Owner;

      //Act
      fixture.detectChanges();

      //Assert
      expect(component.isAddMoreVisible).toBeFalsy();
    });
  });

  describe('isBack getter', () => {

    it('isBack should return true', () => {
      //Arrange
      component.stage = PolicySettingsModalEnum.Approvers;
      component.currentStep = 1;

      //Act
      fixture.detectChanges();

      //Assert
      expect(component.isBack).toBeTruthy();
    });

    it('isBack should return false', () => {
      //Arrange
      component.stage = PolicySettingsModalEnum.Approvers;
      component.currentStep = 0;

      //Act
      fixture.detectChanges();

      //Assert
      expect(component.isBack).toBeFalsy();
    });
  });

  describe('isScheduling getter', () => {

    it('isScheduling should return true', () => {
      //Arrange
      component.stage = PolicySettingsModalEnum.Scheduling;

      //Act
      fixture.detectChanges();

      //Assert
      expect(component.isScheduling).toBeTruthy();
    });

    it('isScheduling should return false', () => {
      //Arrange
      component.stage = PolicySettingsModalEnum.Approvers;

      //Act
      fixture.detectChanges();

      //Assert
      expect(component.isScheduling).toBeFalsy();
    });
  });

  describe('nextText getter', () => {

    beforeEach(() => {
      component.buildTranslationKey = jasmine.createSpy('buildTranslationKey');
    });

    it('nextText should call buildTranslationKey with save value', () => {
      //Arrange
      component.currentStep = 3;

      //Act
      fixture.detectChanges();
      component.nextText;

      //Assert
      expect(component.buildTranslationKey).toHaveBeenCalledWith('save');
    });

    it('nextText should call buildTranslationKey with skip value', () => {
      //Arrange
      component.currentStep = 0;

      //Act
      fixture.detectChanges();
      component.nextText;

      //Assert
      expect(component.buildTranslationKey).toHaveBeenCalledWith('skip');
    });
  });

  describe('ngOnInit', () => {

    it('should assign correct translationKey', async () => {
      //Arrange
      //Act
      await detectChanges();

      //Assert
      expect(component.translationKey).toBe(translationKey);
    });

    it('should assign the proper policy', async () => {
      //Arrange
      //Act
      await detectChanges();

      //Assert
      expect(component.policy).toEqual(policy);
    });

    it('should assign the proper policy settings', async () => {
      //Arrange
      //Act
      await detectChanges();

      //Assert
      expect(component.policySettings).toEqual(policySettings);
    });

    it('should assign the proper next text', async () => {
      //Arrange
      //Act
      await detectChanges();

      //Assert
      expect(component.nextText).toEqual(`${translationKey}.skip`);
    });
  });

  describe('buildTranslationKey method', () => {
    it('should build correct translation key', () => {
      // Arrange
      const relativeKey = 'fake-relative-key';
      component.translationKey = 'policyManager.policy';

      // Act
      const actualTranslationKey = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actualTranslationKey).toBe(`policyManager.policy.${relativeKey}`);
    });
  });

  describe('buildStepTranslationKey method', () => {
    it('should build correct translation key', () => {
      // Arrange
      const relativeKey = 'fake-relative-key';
      component.translationKey = 'policyManager.policy';

      // Act
      const actualTranslationKey = component.buildStepTranslationKey(relativeKey, 0);

      // Assert
      expect(actualTranslationKey).toBe(`policyManager.policy.${PolicySettingsModalEnum.Owner}.${relativeKey}`);
    });
  });

  describe('switch steps', () => {

    beforeEach(() => {
      component.policyStageForm = TestBed.createComponent(PolicyRoleComponent).componentInstance as PolicyRoleComponent;
      component.policyStageForm.formData = jasmine.createSpy('fromData');
      switcherMock.changeContext = jasmine.createSpy('changeContext');
      component.policy = policy;
      component.translationKey = translationKey;
    });

    describe('switchNextStep', () => {
      it('should call switcher goById with success enum', async () => {
        // Arrange
        component.currentStep = steps.length;

        //Act
        await detectChanges();
        await component.switchNextStep();

        //Assert
        expect(switcherMock.goById).toHaveBeenCalledWith(PolicySettingsModalEnum.Success);
      });

      it('should call switcher goById with error enum', () => {
        // Arrange
        component.currentStep = steps.length;
        policiesFacade.editPolicySettings = jasmine.createSpy('editPolicySettings').and.throwError(new Error());

        //Act
        component.switchNextStep();

        //Assert
        expect(switcherMock.goById).toHaveBeenCalledWith(PolicySettingsModalEnum.Error);
      });

      it('should call go next', () => {
        // Arrange
        component.currentStep = 0;

        //Act
        component.switchNextStep();

        //Assert
        expect(switcherMock.goNext).toHaveBeenCalled;
      });
    });

    describe('switchPrevStep', () => {
      it('should call go previous', () => {
        // Arrange
        component.currentStep = 0;

        //Act
        component.switchPrevStep();

        //Assert
        expect(switcherMock.goPrevious).toHaveBeenCalled;
      });
    });
  });
});
