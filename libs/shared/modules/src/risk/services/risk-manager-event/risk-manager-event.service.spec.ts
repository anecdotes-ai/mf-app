import { TestBed } from '@angular/core/testing';
import { ControlStatusEnum } from 'core/modules/data/models/domain/index';
import { EffectEnum, LevelTargetEnum, StrategyEnum } from 'core/modules/risk/models/index';

import { EvidenceCollectionTypeEnum } from 'core/modules/shared-controls/models/evidence-collection-modal-params';
import { RiskManagerEventService } from './risk-manager-event.service';
import { RiskManagerEventDataProperty, UserEvents } from 'core/models';
import { UserEventService } from 'core/services/user-event/user-event.service';

const FAKE_DATA = {
  risk: {
    id: 'fake-risk-id',
    name: 'fake-risk-name',
    effect: ['fake-risk-effect' as EffectEnum],
    source: 'fake-risk-source',
    strategy: 'fake-risk-strategy' as StrategyEnum,
    isCustomCategory: true,
    isCustomSource: true,
    editedField: 'fake-edited-field',
    previousValue: 'fake-previous-value',
    newValue: 'fake-new-value',
    level_target: 'fake-risk-level' as LevelTargetEnum,
    category_name: 'fake-risk-category',
  },
  category: {
    id: 'fake-category-id',
    category_name: 'fake-category-name',
  },
  evidence: {
    id: 'fake-evidence-id',
    name: 'fake-evidence-name.pdf',
    service_display_name: 'fake-service-display-name',
  },
  source: {
    id: 'fake-source-id',
    source_name: 'fake-source-name',
  },
  control: {
    control_framework: 'fake-control-framework',
    control_name: 'fake-control-name',
    control_category: 'fake-control-category',
    control_status: {
      status: 'fake-control-status' as ControlStatusEnum,
    }
  }
};

describe('RiskManagerEventService', () => {
  let serviceUnderTest: RiskManagerEventService;
  let userEventServiceSpy: jasmine.SpyObj<UserEventService>;

  beforeEach(() => {
    userEventServiceSpy = jasmine.createSpyObj('UserEventService', ['sendEvent']);

    TestBed.configureTestingModule({
      providers: [
        RiskManagerEventService,
        { provide: UserEventService, useValue: userEventServiceSpy },
      ],
    });

    serviceUnderTest = TestBed.inject(RiskManagerEventService);
    userEventServiceSpy.sendEvent.and.returnValue();
  });

  it('should be created', () => {
    // Arrange
    // Act
    // Assert
    expect(serviceUnderTest).toBeTruthy();
  });

  describe('trackAddSupportingDocumentEvent', () => {
    it(`should call the sendEvent method of userEventService with ${UserEvents.ADD_SUPPORTING_DOCUMENT} event and appropriate params`, () => {
      // Arrange
      const documentName = FAKE_DATA.evidence.name.substring(0, FAKE_DATA.evidence.name.lastIndexOf('.'));

      // Act
      serviceUnderTest.trackAddSupportingDocumentEvent(
        FAKE_DATA.evidence,
        EvidenceCollectionTypeEnum.FROM_DEVICE,
        FAKE_DATA.risk.name,
        FAKE_DATA.category.category_name,
      );

      // Assert
      expect(userEventServiceSpy.sendEvent).toHaveBeenCalledWith(UserEvents.ADD_SUPPORTING_DOCUMENT, {
        [RiskManagerEventDataProperty.EvidenceType]: EvidenceCollectionTypeEnum.FROM_DEVICE,
        [RiskManagerEventDataProperty.PluginName]: FAKE_DATA.evidence.service_display_name,
        [RiskManagerEventDataProperty.DocumentName]: documentName,
        [RiskManagerEventDataProperty.RiskName]: FAKE_DATA.risk.name,
        [RiskManagerEventDataProperty.RiskCategory]: FAKE_DATA.category.category_name,
      });
    });
  });

  describe('trackCreatedRiskEvent', () => {
    it(`should call the sendEvent method of userEventService with ${UserEvents.CREATE_RISK} event and appropriate params`, () => {
      // Arrange
      // Act
      serviceUnderTest.trackCreatedRiskEvent(
        FAKE_DATA.risk,
        FAKE_DATA.category.category_name,
        FAKE_DATA.source.source_name,
      );

      // Assert
      expect(userEventServiceSpy.sendEvent).toHaveBeenCalledWith(UserEvents.CREATE_RISK, {
        [RiskManagerEventDataProperty.RiskName]: FAKE_DATA.risk.name,
        [RiskManagerEventDataProperty.RiskCategory]: FAKE_DATA.category.category_name,
        [RiskManagerEventDataProperty.CustomCategory]: FAKE_DATA.risk.isCustomCategory,
        [RiskManagerEventDataProperty.RiskSource]: FAKE_DATA.source.source_name,
        [RiskManagerEventDataProperty.CustomSource]: FAKE_DATA.risk.isCustomSource,
        [RiskManagerEventDataProperty.RiskEffect]: FAKE_DATA.risk.effect.join(', '),
        [RiskManagerEventDataProperty.RiskStrategy]: FAKE_DATA.risk.strategy,
      });
    });
  });

  describe('trackEditRiskEvent', () => {
    it(`should call the sendEvent method of userEventService with ${UserEvents.EDIT_RISK} event and appropriate params`, () => {
      // Arrange
      // Act
      serviceUnderTest.trackEditRiskEvent(
        FAKE_DATA.risk.name,
        FAKE_DATA.risk.editedField,
        FAKE_DATA.risk.previousValue,
        FAKE_DATA.risk.newValue,
      );

      // Assert
      expect(userEventServiceSpy.sendEvent).toHaveBeenCalledWith(UserEvents.EDIT_RISK, {
        [RiskManagerEventDataProperty.RiskName]: FAKE_DATA.risk.name,
        [RiskManagerEventDataProperty.EditedField]: FAKE_DATA.risk.editedField,
        [RiskManagerEventDataProperty.PreviousValue]: FAKE_DATA.risk.previousValue,
        [RiskManagerEventDataProperty.NewValue]: FAKE_DATA.risk.newValue,
      });
    });
  });

  describe('trackDeleteRiskEvent', () => {
    it(`should call the sendEvent method of userEventService with ${UserEvents.DELETE_RISK} event and appropriate params`, () => {
      // Arrange
      // Act
      serviceUnderTest.trackDeleteRiskEvent(
        FAKE_DATA.risk.name,
        FAKE_DATA.category.category_name,
        FAKE_DATA.risk.strategy,
        FAKE_DATA.risk.level_target,
      );

      // Assert
      expect(userEventServiceSpy.sendEvent).toHaveBeenCalledWith(UserEvents.DELETE_RISK, {
        [RiskManagerEventDataProperty.RiskName]: FAKE_DATA.risk.name,
        [RiskManagerEventDataProperty.RiskCategory]: FAKE_DATA.category.category_name,
        [RiskManagerEventDataProperty.RiskStrategy]: FAKE_DATA.risk.strategy,
        [RiskManagerEventDataProperty.RiskLevel]: FAKE_DATA.risk.level_target,
      });
    });
  });

  describe('trackSelectOwnerEvent', () => {
    it(`should call the sendEvent method of userEventService with ${UserEvents.SELECT_OWNER} event and appropriate params`, () => {
      // Arrange
      // Act
      serviceUnderTest.trackSelectOwnerEvent(
        FAKE_DATA.risk.name,
        FAKE_DATA.category.category_name,
        FAKE_DATA.risk.strategy,
        FAKE_DATA.risk.level_target,
      );

      // Assert
      expect(userEventServiceSpy.sendEvent).toHaveBeenCalledWith(UserEvents.SELECT_OWNER, {
        [RiskManagerEventDataProperty.RiskName]: FAKE_DATA.risk.name,
        [RiskManagerEventDataProperty.RiskCategory]: FAKE_DATA.category.category_name,
        [RiskManagerEventDataProperty.RiskStrategy]: FAKE_DATA.risk.strategy,
        [RiskManagerEventDataProperty.RiskLevel]: FAKE_DATA.risk.level_target,
      });
    });
  });

  describe('trackViewControlEvent', () => {
    it(`should call the sendEvent method of userEventService with ${UserEvents.VIEW_CONTROL} event and appropriate params`, () => {
      // Arrange
      // Act
      serviceUnderTest.trackViewControlEvent(
        FAKE_DATA.control.control_framework,
        FAKE_DATA.control.control_name,
        FAKE_DATA.control.control_category,
        FAKE_DATA.risk.name,
        FAKE_DATA.category.category_name,
      );

      // Assert
      expect(userEventServiceSpy.sendEvent).toHaveBeenCalledWith(UserEvents.VIEW_CONTROL, {
        [RiskManagerEventDataProperty.FrameworkName]: FAKE_DATA.control.control_framework,
        [RiskManagerEventDataProperty.ControlName]: FAKE_DATA.control.control_name,
        [RiskManagerEventDataProperty.ControlCategory]: FAKE_DATA.control.control_category,
        [RiskManagerEventDataProperty.RiskName]: FAKE_DATA.risk.name,
        [RiskManagerEventDataProperty.RiskCategory]: FAKE_DATA.category.category_name,
      });
    });
  });

  describe('trackDisconnectControlEvent', () => {
    it(`should call the sendEvent method of userEventService with ${UserEvents.DISCONNECT_CONTROL} event and appropriate params`, () => {
      // Arrange
      // Act
      serviceUnderTest.trackDisconnectControlEvent(
        FAKE_DATA.control.control_framework,
        FAKE_DATA.control.control_name,
        FAKE_DATA.control.control_category,
        FAKE_DATA.risk.name,
        FAKE_DATA.category.category_name,
      );

      // Assert
      expect(userEventServiceSpy.sendEvent).toHaveBeenCalledWith(UserEvents.DISCONNECT_CONTROL, {
        [RiskManagerEventDataProperty.FrameworkName]: FAKE_DATA.control.control_framework,
        [RiskManagerEventDataProperty.ControlName]: FAKE_DATA.control.control_name,
        [RiskManagerEventDataProperty.ControlCategory]: FAKE_DATA.control.control_category,
        [RiskManagerEventDataProperty.RiskName]: FAKE_DATA.risk.name,
        [RiskManagerEventDataProperty.RiskCategory]: FAKE_DATA.category.category_name,
      });
    });
  });

  describe('trackLinkControlEvent', () => {
    it(`should call the sendEvent method of userEventService with ${UserEvents.LINK_CONTROL} event and appropriate params`, () => {
      // Arrange
      // Act
      serviceUnderTest.trackLinkControlEvent(
        FAKE_DATA.risk.name,
        FAKE_DATA.control.control_name,
        FAKE_DATA.control.control_framework,
        FAKE_DATA.control.control_status.status,
        FAKE_DATA.control.control_category,
      );

      // Assert
      expect(userEventServiceSpy.sendEvent).toHaveBeenCalledWith(UserEvents.LINK_CONTROL, {
        [RiskManagerEventDataProperty.RiskName]: FAKE_DATA.risk.name,
        [RiskManagerEventDataProperty.ControlName]: FAKE_DATA.control.control_name,
        [RiskManagerEventDataProperty.FrameworkName]: FAKE_DATA.control.control_framework,
        [RiskManagerEventDataProperty.ControlStatus]: FAKE_DATA.control.control_status.status,
        [RiskManagerEventDataProperty.ControlCategory]: FAKE_DATA.control.control_category,
      });
    });
  });

  describe('trackHowRiskLevelIsCalculatedEvent', () => {
    it(`should call the sendEvent method of userEventService with ${UserEvents.HOW_RISK_LEVEL_IS_CALCULATED} event and appropriate params`, () => {
      // Arrange
      // Act
      serviceUnderTest.trackHowRiskLevelIsCalculatedEvent(
        FAKE_DATA.risk.name,
        FAKE_DATA.risk.category_name,
        FAKE_DATA.risk.strategy,
        FAKE_DATA.risk.level_target,
      );

      // Assert
      expect(userEventServiceSpy.sendEvent).toHaveBeenCalledWith(UserEvents.HOW_RISK_LEVEL_IS_CALCULATED, {
        [RiskManagerEventDataProperty.RiskName]: FAKE_DATA.risk.name,
        [RiskManagerEventDataProperty.RiskCategory]: FAKE_DATA.risk.category_name,
        [RiskManagerEventDataProperty.RiskStrategy]: FAKE_DATA.risk.strategy,
        [RiskManagerEventDataProperty.RiskLevel]: FAKE_DATA.risk.level_target,
      });
    });
  });
});
