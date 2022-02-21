import { TestBed } from '@angular/core/testing';
import { ModalWindowService } from 'core/modules/modals';
import { PolicyModalService } from './policy-modal.service';
import { ApproveOnBehalfModals } from 'core/modules/shared-policies/services/constants/approve-on-behalf-modal.constants';
import { ApproveOnBehalfContext } from 'core/modules/shared-policies/models/approve-on-behalf-context';
import { SendForApprovalModals, SettingsSwitcherModals } from '../constants';
import { SettingsContext } from '../../models/settings-context';
import { ApproverInstance } from 'core/modules/data/models/domain/approverInstance';
import { SendForApprovalContext } from '../../models/send-for-approval-context';
import { configureTestSuite } from 'ng-bullet';
import { ApproverTypeEnum } from 'core/modules/data/models/domain';

describe('PolicyModalService', () => {
    configureTestSuite();

    let serviceUnderTest: PolicyModalService;
    let modalWindowService: ModalWindowService;
    let translationKey: string;

    const policyId = 'some-policy-id';
    const approverType =  ApproverTypeEnum.Approver;
    const approver = {
        name: 'some-approver-name',
        email: 'some-approver-email',
        role: 'some-approver-name',
    } as ApproverInstance;

    beforeAll(() => {
        TestBed.configureTestingModule({
          providers: [PolicyModalService, { provide: ModalWindowService, useValue: {} }],
        });
        serviceUnderTest = TestBed.inject(PolicyModalService);

        modalWindowService = TestBed.inject(ModalWindowService);
        modalWindowService.openInSwitcher = jasmine.createSpy('openInSwitcher');
    });

    it('should be created', () => {
        expect(serviceUnderTest).toBeTruthy();
    });

    describe('addPolicySettingsModal', () => {
        it('should call openInSwitcher with modalWindowSwitcher and SettingsContext context', () => {
            // Arrange
            translationKey = 'policyManager.settings';
            let context: SettingsContext = { policyId };

            // Act
            serviceUnderTest.addPolicySettingsModal(context);

            // Assert
            expect(modalWindowService.openInSwitcher).toHaveBeenCalledWith({
                componentsToSwitch: SettingsSwitcherModals,
                context: { translationKey, ...context},
            });
        });

    });

    describe('approveOnBehalf', () => {
        it('should call openInSwitcher with modalWindowSwitcher and ApproveOnBehalfContext context', () => {
            // Arrange
            translationKey = 'policyManager.approveOnBehalf';
            let context: ApproveOnBehalfContext = { policyId, approverInstance: approver, approved: true, approverType };

            // Act
            serviceUnderTest.approveOnBehalf(context);

            // Assert
            expect(modalWindowService.openInSwitcher).toHaveBeenCalledWith({
                componentsToSwitch: ApproveOnBehalfModals,
                context: { translationKey, ...context},
            });
        });
    });

    describe('sendForApproval', () => {
        it('should call openInSwitcher with modalWindowSwitcher and SendForApprovalContext context', () => {
            // Arrange
            translationKey = 'policyManager.sendForApproval';
            let context: SendForApprovalContext = { policyId, approverType };

            // Act
            serviceUnderTest.sendForApproval(context);

            // Assert
            expect(modalWindowService.openInSwitcher).toHaveBeenCalledWith({
                componentsToSwitch: SendForApprovalModals,
                context: { translationKey, ...context},
            });
        });
    });

});
