import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AuditLog } from 'core/modules/data/models/domain';
import { LocalDatePipe } from 'core/modules/pipes';
import { AuditLogItem } from './audit-log-item.component';
import { SocTypes } from 'core/modules/shared-framework/constants';
import { ControlsNavigator } from 'core/modules/shared-controls';

describe('AuditLogItem', () => {
  let fixture: ComponentFixture<AuditLogItem>;
  let component: AuditLogItem;

  const mockAuditLog: AuditLog = {
    auditors: [{ first_name: 'bla', last_name: 'blo' }],
    framework_id: '1111',
    audit_date: new Date('2021-12-01T20:00:00.000Z'),
    framework_fields: {
      type: SocTypes.type1,
      range_start: new Date('2021-12-01T20:00:00.000Z'),
      range_end: new Date('2021-12-01T20:00:00.000Z'),
    },
  };
  const transformValue = 'Dec 1, 2021';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: LocalDatePipe, useValue: {} },
        { provide: ControlsNavigator, useValue: {} }],
      declarations: [AuditLogItem],
    });

    fixture = TestBed.createComponent(AuditLogItem);
    component = fixture.componentInstance;
  });

  it('should be able to create component instance', () => {
    expect(component).toBeDefined();
  });

  describe('getAuditPeriodValue', () => {
    it('get correct value when soc type is type1', () => {
      // Arrange
      component.auditLog = mockAuditLog;

      // Act
      const value = component.getAuditPeriodValue();

      // Assert
      expect(value).toEqual(transformValue);
    });

    it('get correct value when soc type is type2', () => {
      // Arrange
      mockAuditLog.framework_fields.type = SocTypes.type2;
      component.auditLog = mockAuditLog;

      // Act
      const value = component.getAuditPeriodValue();

      // Assert
      expect(value).toEqual(`${transformValue} - ${transformValue}`);
    });
  });

  describe('getinvitedAuditorValue', () => {
    it('get correct value when there are no auditors', () => {
      // Arrange
      component.auditLog = {
        auditors: [],
      };

      // Act
      const value = component.getInvitedAuditorValue();

      // Assert
      expect(value).toEqual('-');
    });

    it('get correct value when there is 1 auditor', () => {
      // Arrange
      component.auditLog = {
        auditors: mockAuditLog.auditors,
      };

      // Act
      const value = component.getInvitedAuditorValue();

      // Assert
      expect(value).toEqual(mockAuditLog.auditors[0]);
    });

    it('get correct value when there are more than 1 auditor', () => {
      // Arrange
      const auditors = [...mockAuditLog.auditors, { first_name: '222', last_name: '3333' }];
      component.auditLog = {
        auditors,
      };

      // Act
      const value = component.getInvitedAuditorValue();

      // Assert
      expect(value).toEqual(auditors);
    });
  });
});
