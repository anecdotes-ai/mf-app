import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyRoleComponent } from './policy-role.component';
import { TranslateModule } from '@ngx-translate/core';
import { ApproverInstance } from 'core/modules/data/models/domain/approverInstance';
import { PolicySettingsModalEnum } from '../../constants';
import { SimpleChange } from '@angular/core';
import { configureTestSuite } from 'ng-bullet';

describe('PolicyRoleComponent', () => {
  configureTestSuite();

  let component: PolicyRoleComponent;
  let fixture: ComponentFixture<PolicyRoleComponent>;

  const user_email = 'some-user-email@anecdotes.ai';
  const invalid_user_email = 'some-user-email';
  const relativeKey = 'fake-relative-key';

  const valid_role = {
    name: 'some-user-name',
    email: user_email,
    role: 'some-role-name',
  } as ApproverInstance;

  const invalid_email_role = {
    name: 'other-user-name',
    email: invalid_user_email,
    role: 'other-role-name',
  } as ApproverInstance;

  const additional_valid_role = {
    name: 'some-user-name1',
    email: 'some-user-email1@anecdotes.ai',
    role: 'some-role-name1',
  } as ApproverInstance;

  const additional_valid_role2 = {
    name: 'some-user-name2',
    email: 'some-user-email2@anecdotes.ai',
    role: 'some-role-name2',
  } as ApproverInstance;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [PolicyRoleComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('invalid getter', () => {

    it('should return true', () => {
      // Arrange
      component.addMore(invalid_email_role);

      // Act
      // Assert
      expect(component.invalid).toBeTruthy;
    });

    it('should return false', () => {
      // Arrange
      component.addMore(valid_role);

      // Act
      // Assert
      expect(component.invalid).toBeFalsy;
    });
  });

  describe('isAddMoreDisable getter', () => {

    it('should return true', () => {
      // Arrange
      component.addMore(invalid_email_role);

      // Act
      // Assert
      expect(component.isAddMoreDisable).toBeTruthy;
    });

    it('should return false', () => {
      // Arrange
      component.addMore(valid_role);

      // Act
      // Assert
      expect(component.isAddMoreDisable).toBeFalsy;
    });
  });

  describe('ngOnChanges', () => {

    describe('first initial change with no settings', () => {
      it('should create a default form with no values and push ot to form groups array', () => {
        // Arrange
        // Act
        component.ngOnChanges({
          policySettings: new SimpleChange(null, component.policySettings, true),
        });

        // Assert
        expect(component.formGroups[0].items.email.value).toBe(null);
      });
    });

    describe('change with no settings - after removal of a single remaining value', () => {
      it('form groups array should be empty with no values', () => {
        // Arrange
        // Act
        component.ngOnChanges({
          policySettings: new SimpleChange(null, component.policySettings, false),
        });

        // Assert
        expect(component.formGroups.length).toEqual(0);
      });
    });

    describe('change with existing settings: ', () => {

      [ 
        { stage: PolicySettingsModalEnum.Owner },
        { stage: PolicySettingsModalEnum.Approvers },
        { stage: PolicySettingsModalEnum.Reviewers },
      ].forEach((testCase) => {
        it('should create one form on the form groups array for Approvers and Reviewers', () => {
          // Arrange
          component.policySettings = { 
            owner: valid_role, 
            reviewers: [additional_valid_role], 
            approvers: [additional_valid_role2] 
          };
          component.stage = testCase.stage;

          // Act
          component.ngOnChanges({
            policySettings: new SimpleChange(null, component.policySettings, false),
          });

          // Assert
          expect(component.formGroups.length).toEqual(1);
        });
      });
    });
  });

  describe('formData()', () => {

    it('should return a single approver from the form groups', () => {
      // Arrange
      component.addMore(valid_role);
      component.isAddMoreVisible = false;

      // Act
      // Assert
      expect(component.formData()).toEqual(valid_role);
    });

    it('should return an array of 2 approvers from the form groups', () => {
      // Arrange
      component.addMore(valid_role);
      component.addMore(invalid_email_role);
      component.isAddMoreVisible = true;

      // Act
      // Assert
      expect(component.formData()).toEqual(jasmine.arrayContaining([valid_role, invalid_email_role]));
    });
  });

  describe('buildTranslationKey methods', () => {

    beforeEach(() => {
      component.translationKey = 'policyManager';
    });

    describe('buildTranslationKey', () => {

      it('should build correct translation key', () => {
        // Arrange
        // Act
        let actualTranslationKey = component.buildTranslationKey(relativeKey);

        // Assert
        expect(actualTranslationKey).toBe(`policyManager.${relativeKey}`);
      });
    });

    describe('buildCurrTranslationKey', () => {

      it('should build correct translation key', () => {
        // Arrange
        component.stage = PolicySettingsModalEnum.Owner;

        // Act
        let actualTranslationKey = component.buildCurrTranslationKey(relativeKey);

        // Assert
        expect(actualTranslationKey).toBe(`policyManager.${PolicySettingsModalEnum.Owner}.${relativeKey}`);
      });
    });
  });

  describe('addMore', () => {

    it('addMore should push a new valid form to the form groups array', () => {
      //Arrange
      //Act
      component.addMore(valid_role);
      //Assert
      expect(component.formGroups[0].items.email.value).toEqual(user_email);
    });

    it('addMore should push a new form with invalid email', () => {
      //Arrange      
      //Act
      component.addMore(invalid_email_role);

      //Assert
      expect(component.formGroups[0].items.email.status).toBe('INVALID');
    });
  });
});
