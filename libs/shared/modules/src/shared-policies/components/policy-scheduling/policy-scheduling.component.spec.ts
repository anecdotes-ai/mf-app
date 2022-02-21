import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicySchedulingComponent } from './policy-scheduling.component';
import { of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ApprovalFrequencyEnum, NotifyMeEnum, NotifyApproversEnum } from 'core/modules/data/models/domain/scheduleSettings';
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { configureTestSuite } from 'ng-bullet';

export class MockTranslateService {
  public get(key: any): any {
    of(key);
  }
  public instant(key: any): string {
    return key;
  }
}

describe('PolicySchedulingComponent', () => {
  configureTestSuite();

  let component: PolicySchedulingComponent;
  let fixture: ComponentFixture<PolicySchedulingComponent>;

  const approval_frequency = ApprovalFrequencyEnum.Yearly;
  const start_from = new Date();
  const notify_me = NotifyMeEnum.Month;
  const notify_approvers = NotifyApproversEnum.Month;

  const policyScheduling = {
    approval_frequency,
    start_from,
    notify_me,
    notify_approvers
  };

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ PolicySchedulingComponent ],
      providers: [
        { provide: TranslateService, useClass: MockTranslateService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicySchedulingComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {

    it('should build frequencyPool correctly', () => {
      // Arrange
      // Act
      component.ngOnInit();

      // Assert
      expect(component.frequencyPool).toEqual(jasmine.arrayContaining(['yearly', 'quarterly', 'monthly']));
    });

    it('should build notifyPool correctly', () => {
      // Arrange
      // Act
      component.ngOnInit();

      // Assert
      expect(component.notifyPool).toEqual(jasmine.arrayContaining(['never', 'day', 'week', 'month']));
    });

    it('should create a new invalid (empty) dynamic form', () => {
      // Arrange
      // Act
      component.ngOnInit();

      // Assert
      expect(component.formGroup.status).toBe('INVALID');
    });
  }); 

  describe('ngOnChanges', () => {

    beforeEach(() => {
      component.policyScheduling = policyScheduling;
      fixture.detectChanges();
    });

    it('should set frequency value correctly', () => {
      // Arrange
      // Act
      component.ngOnChanges({
        policyScheduling: new SimpleChange(null, component.policyScheduling, false),
      });

      // Assert
      expect(component.formGroup.items.frequency.value).toBe(approval_frequency);
    });

    it('should set start time value correctly', () => {
      // Arrange
      // Act
      component.ngOnChanges({
        policyScheduling: new SimpleChange(null, component.policyScheduling, false),
      });

      // Assert
      expect(component.formGroup.items.startTime.value).toBe(start_from);
    });

    it('should set notify me value correctly', () => {
      // Arrange
      // Act
      component.ngOnChanges({
        policyScheduling: new SimpleChange(null, component.policyScheduling, false),
      });

      // Assert
      expect(component.formGroup.items.notifyMe.value).toBe(notify_me);
    });

    it('should set notify approvers value correctly', () => {
      // Arrange
      // Act
      component.ngOnChanges({
        policyScheduling: new SimpleChange(null, component.policyScheduling, false),
      });

      // Assert
      expect(component.formGroup.items.notifyRoles.value).toBe(notify_approvers);
    });    
  });

  describe('buildTranslationKey', () => {

    it('should build correct translation key', () => {
      // Arrange
      component.translationKey = 'policyManager';
      let relativeKey = 'fake-relative-key';

      // Act
      let actualTranslationKey = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actualTranslationKey).toBe(`policyManager.${relativeKey}`);
    });
  });
});
