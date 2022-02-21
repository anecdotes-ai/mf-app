import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { UserClaims } from 'core/modules/auth-core/models';
import { RoleEnum } from 'core/modules/auth-core/models/domain';
import { AuthService, RoleService } from 'core/modules/auth-core/services';
import { CalculatedControl } from 'core/modules/data/models';
import { ControlStatus, ControlStatusEnum, Framework } from 'core/modules/data/models/domain';
import { ControlsFacadeService } from 'core/modules/data/services';
import { MenuAction } from 'core/modules/dropdown-menu';
import { GeneralEventService } from 'core/services/general-event-service/general-event.service';
import { SubscriptionDetacher } from 'core/utils';
import { filter } from 'rxjs/operators';
import { BGClasses, statusesKeys } from './../../models/control-status.constants';
import { ConfirmationModalWindowComponent, ConfirmationModalWindowInputKeys, ModalWindowService } from 'core/modules/modals';
import { IntercomService } from 'core/services';

@Component({
  selector: 'app-control-status',
  templateUrl: './control-status.component.html',
  styleUrls: ['./control-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlStatusComponent implements OnInit, OnDestroy, OnChanges {
  @Input() controlId: string;
  @Input() framework: Framework;
  @Input() isControlFreeze: boolean;
  @Input() readonly: boolean;
  @Input() viewOnly?: boolean;
  // If this is a snapshot the updates are not relevant
  @Input() control: CalculatedControl = null;


  @ViewChild('errorTemplate')
  protected errorTemplate: TemplateRef<any>;

  calculatedControl: CalculatedControl;
  buttonBGClass: string;
  loading = false;

  private userRole: string;
  private currentUser: UserClaims;
  private detacher = new SubscriptionDetacher();

  FREEZE_STATUSES = [ControlStatusEnum.APPROVED_BY_AUDITOR, ControlStatusEnum.ISSUE, ControlStatusEnum.READY_FOR_AUDIT];

  private freezeMode = {
    translationKey: 'controls.freeze',
    localSotrageKey: 'dont-show-freeze-modal',
    icon: 'freeze-modal',
    freeze: true
  };
  private unFreezeMode = {
    translationKey: 'controls.unfreeze',
    localSotrageKey: 'dont-show-unfreeze-modal',
    icon: 'status_not_started',
    freeze: false
  };

  get controlHasEvidenceCollected(): boolean {
    return this.calculatedControl?.control_has_all_evidence_collected;
  }

  constructor(
    private controlsFacade: ControlsFacadeService,
    private roleService: RoleService,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    private modalWindowService: ModalWindowService,
    private generalEventService: GeneralEventService,
    private intercomService: IntercomService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('isControlFreeze' in changes &&
        !changes.isControlFreeze.firstChange &&
        changes.isControlFreeze.currentValue !== changes.isControlFreeze.previousValue) {
      this.getCalculatedControlById();
      this.cd.detectChanges();
    }
  }

  ngOnInit(): void {
    this.getCalculatedControlById();
    this.getCurrentRole();
    this.getCurrentUser();
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  getButtonText(currentStatus?: string): string {
    currentStatus = currentStatus || this.getCurrentStatusString();
    if (currentStatus) {
      let str = currentStatus.replace(/_/g, ' ').toLowerCase();
      return str[0].toUpperCase() + str.slice(1);
    }
  }

  dropDownMenuClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  buildTranslationKey(relativeKey: string): string {
    return `statusMenu.${relativeKey}`;
  }

  setMenuButtonBGClass(): void {
    const status = this.getCurrentStatusString();
    if (this.buttonBGClass != BGClasses[status]) {
      this.buttonBGClass = BGClasses[status];
      this.cd.detectChanges();
    }
  }

  getCurrentStatusString(): string {
    return this.calculatedControl.control_status.status;
  }

  readyForAuditDisplayCondition(): boolean {
    return (
      this.controlHasEvidenceCollected &&
      this.userRole !== RoleEnum.Auditor &&
      this.getCurrentStatusString() !== ControlStatusEnum.READY_FOR_AUDIT &&
      this.getCurrentStatusString() !== ControlStatusEnum.NOTSTARTED
    );
  }

  issueDisplayCondition(): boolean {
    return (
      this.controlHasEvidenceCollected &&
      this.userRole === RoleEnum.Auditor &&
      this.getCurrentStatusString() !== ControlStatusEnum.ISSUE
    );
  }

  inProgressDisplayCondition(): boolean {
    return (
      this.controlHasEvidenceCollected &&
      (this.userRole === RoleEnum.Admin || this.userRole === RoleEnum.Collaborator) &&
      this.getCurrentStatusString() !== ControlStatusEnum.INPROGRESS &&
      this.getCurrentStatusString() !== ControlStatusEnum.NOTSTARTED
    );
  }

  approvedByAuditorDisplayCondition(): boolean {
    return (
      this.controlHasEvidenceCollected &&
      this.userRole === RoleEnum.Auditor &&
      this.getCurrentStatusString() !== ControlStatusEnum.APPROVED_BY_AUDITOR
    );
  }

  monitoringDisplayCondition(): boolean {
    return (
      this.controlHasEvidenceCollected &&
      (this.userRole === RoleEnum.Admin || this.userRole === RoleEnum.Collaborator) &&
      this.getCurrentStatusString() !== ControlStatusEnum.MONITORING &&
      this.getCurrentStatusString() !== ControlStatusEnum.NOTSTARTED
    );
  }

  notStartedDisplayCondition(): boolean {
    return !this.controlHasEvidenceCollected && this.getCurrentStatusString() !== ControlStatusEnum.NOTSTARTED;
  }

  menuActions: MenuAction<CalculatedControl>[] = [
    {
      translationKey: this.buildTranslationKey(statusesKeys[ControlStatusEnum.GAP]),
      displayCondition: () => this.getCurrentStatusString() !== ControlStatusEnum.GAP,
      action: () => this.updateStatusAndShowConfirmationModal(ControlStatusEnum.GAP, this.unFreezeMode),
    },
    {
      translationKey: this.buildTranslationKey(statusesKeys[ControlStatusEnum.READY_FOR_AUDIT]),
      displayCondition: () => this.readyForAuditDisplayCondition(),
      action: () => this.updateStatusAndShowConfirmationModal(ControlStatusEnum.READY_FOR_AUDIT, this.freezeMode),
    },
    {
      translationKey: this.buildTranslationKey(statusesKeys[ControlStatusEnum.ISSUE]),
      displayCondition: () => this.issueDisplayCondition(),
      action: () => this.updateStatusAndShowConfirmationModal(ControlStatusEnum.ISSUE, this.freezeMode),
    },
    {
      translationKey: this.buildTranslationKey(statusesKeys[ControlStatusEnum.INPROGRESS]),
      displayCondition: () => this.inProgressDisplayCondition(),
      action: () => this.updateStatusAndShowConfirmationModal(ControlStatusEnum.INPROGRESS, this.unFreezeMode),
    },
    {
      translationKey: this.buildTranslationKey(statusesKeys[ControlStatusEnum.APPROVED_BY_AUDITOR]),
      displayCondition: () => this.approvedByAuditorDisplayCondition(),
      action: () => this.updateStatusAndShowConfirmationModal(ControlStatusEnum.APPROVED_BY_AUDITOR, this.freezeMode),
    },
    {
      translationKey: this.buildTranslationKey(statusesKeys[ControlStatusEnum.MONITORING]),
      displayCondition: () => this.monitoringDisplayCondition(),
      action: () => this.updateStatusAndShowConfirmationModal(ControlStatusEnum.MONITORING, this.unFreezeMode),
    },
    {
      translationKey: this.buildTranslationKey(statusesKeys[ControlStatusEnum.NOTSTARTED]),
      displayCondition: () => this.notStartedDisplayCondition(),
      action: () => this.updateStatus(ControlStatusEnum.NOTSTARTED),
    },
  ];

  openIntercom(): void {
    this.intercomService.showNewMessage();
  }

  private getCurrentRole(): void {
    this.roleService
      .getCurrentUserRole()
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((role) => (this.userRole = role.role));
  }

  private getCurrentUser(): void {
    this.authService.getUserAsync().then((user) => (this.currentUser = user));
  }

  private getCalculatedControlById(): void {
    if(this.control) {
      this.calculatedControl = this.control;
      this.setMenuButtonBGClass();
      return;
    }
    const action = this.framework?.freeze ?
        this.controlsFacade.getSingleControlOrSnapshot(this.controlId) :
        this.controlsFacade.getSingleControl(this.controlId);

      action
      .pipe(this.detacher.takeUntilDetach())
      .pipe(filter(control => !!control))
      .subscribe((control) => {
        this.calculatedControl = control;
        this.setMenuButtonBGClass();
      });
  }

  private async updateStatus(newStatus: ControlStatusEnum, afterCheck = false): Promise<void> {
    this.loading = true;
    const statusToUpdate = {
      status: newStatus,
      updated_by: this.currentUser.email,
    } as ControlStatus;
    const previousStatus = this.getCurrentStatusString();
    try {
      await this.controlsFacade.updateControlStatus(this.controlId, statusToUpdate, this.calculatedControl.control_status);
      this.generalEventService.trackControlStatusChangeEvent(this.framework, this.calculatedControl, previousStatus, newStatus);
    } catch {
      this.errorMessage(newStatus);
    } finally {
      this.loading = false;
      this.cd.detectChanges();
    }

  }

  private async updateStatusAndShowConfirmationModal(newStatus: ControlStatusEnum, {translationKey, localSotrageKey, icon, freeze}): Promise<void> {
    if (this.framework?.freeze &&
        !localStorage.getItem(localSotrageKey) &&
        this.userRole !== RoleEnum.Auditor &&
        this.modeChanged(freeze, newStatus)) {
      return this.modalWindowService.openInSwitcher({
        componentsToSwitch: [
          {
            id: 'freeze-modal',
            componentType: ConfirmationModalWindowComponent,
            contextData: {
              [ConfirmationModalWindowInputKeys.aftermathTranslationKey]: `${translationKey}.description`,
              [ConfirmationModalWindowInputKeys.confirmTranslationKey]: `${translationKey}.yesContinue`,
              [ConfirmationModalWindowInputKeys.confirmationHandlerFunction]: () => this.updateStatus(newStatus, true),
              [ConfirmationModalWindowInputKeys.dismissTranslationKey]: `${translationKey}.cancel`,
              [ConfirmationModalWindowInputKeys.questionTranslationKey]: `${translationKey}.title`,
              [ConfirmationModalWindowInputKeys.aftermathTranslationParams]: {status: this.getButtonText(newStatus)},
              [ConfirmationModalWindowInputKeys.icon]: icon,
              [ConfirmationModalWindowInputKeys.localStorageKey]: localSotrageKey,
              [ConfirmationModalWindowInputKeys.dontShowTranslationKey]: `${translationKey}.dontShow`
            },
          },
        ],
      });
    } else {
      return await this.updateStatus(newStatus, true);
    }
  }

  private modeChanged(freeze: boolean, newStatus: ControlStatusEnum): boolean {
    if (freeze) {
      return !this.FREEZE_STATUSES.includes(this.calculatedControl.control_status?.status) &&
      this.FREEZE_STATUSES.includes(newStatus);
    }
    return this.FREEZE_STATUSES.includes(this.calculatedControl.control_status?.status) &&
    !this.FREEZE_STATUSES.includes(newStatus);
  }

  private errorMessage(newStatus): void {
    const translationKey = 'controls.error-freeze';
    this.modalWindowService.openInSwitcher({
      componentsToSwitch: [
        {
          id: 'error-freeze-modal',
          componentType: ConfirmationModalWindowComponent,
          contextData: {
            [ConfirmationModalWindowInputKeys.confirmTranslationKey]: `${translationKey}.tryAgain`,
            [ConfirmationModalWindowInputKeys.confirmationHandlerFunction]: () => this.updateStatus(newStatus, true),
            [ConfirmationModalWindowInputKeys.dismissTranslationKey]: `${translationKey}.cancel`,
            [ConfirmationModalWindowInputKeys.questionTranslationKey]: `${translationKey}.title`,
            [ConfirmationModalWindowInputKeys.questionTranslationParams]: null,
            [ConfirmationModalWindowInputKeys.icon]: 'status_not_started',
            [ConfirmationModalWindowInputKeys.primaryButtonFirst]: false,
            [ConfirmationModalWindowInputKeys.aftermathTemplate]: this.errorTemplate
          },
        },
      ],
    });
  }
}
