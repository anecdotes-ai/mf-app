import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  OnDestroy,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApproverRoleEnum } from 'core/models';
import { isEpoch, RegularDateFormatMMMdyyyy } from 'core/constants/date';
import { CalculatedApprover, CalculatedPolicy, ResourceStatusEnum } from 'core/modules/data/models';
import { ApprovalFrequencyEnum, ApproverInstance } from 'core/modules/data/models/domain';
import { statusTranslateMapping } from 'core/modules/data/models/resource-status.enum';
import { PoliciesFacadeService } from 'core/modules/data/services';
import { MenuAction } from 'core/modules/dropdown-menu';
import { GridView, GridViewBuilderService } from 'core/modules/grid';
import { PolicyModalService } from 'core/modules/shared-policies/services';
import { PolicyManagerEventService } from 'core/services/policy-manager-event-service/policy-manager-event.service';
import { SubscriptionDetacher } from 'core/utils/subscription-detacher.class';

@Component({
  selector: 'app-policy-approval',
  templateUrl: './policy-approval.component.html',
  styleUrls: ['./policy-approval.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PolicyApprovalComponent implements OnInit, OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  // ** Private properties **
  @ViewChild('firstColumnCellTemplate', { static: true })
  private firstColumnCellTemplate: TemplateRef<any>;

  @ViewChild('status', { static: true })
  private statusTemplate: TemplateRef<any>;

  @ViewChild('approveTime', { static: true })
  private approveTimeTemplate: TemplateRef<any>;

  @ViewChild('comment', { static: true })
  private commentTemplate: TemplateRef<any>;

  @ViewChild('otherCols', { static: true })
  private otherColsTemplate: TemplateRef<any>;

  @ViewChild('fullDataTemplate', { static: true })
  private fullDataTemplate: TemplateRef<any>;

  // ** Inputs **

  @Input()
  policyContext: boolean;

  @Input()
  policy: CalculatedPolicy;

  @Input()
  policyId: string;

  // ** Public properties **

  gridView: GridView;
  approversHistoryMenu: MenuAction[];
  statusLoading: { [rowIndx: number]: boolean } = {};

  // ** Constants **

  dateFormat = RegularDateFormatMMMdyyyy;
  translateKey = 'policyManager.policyPreview';
  isResend: boolean;

  // ** Getters **

  get hasSchedules(): boolean {
    return !!this.policy?.policy_settings?.scheduling.approval_frequency;
  }

  get hasPreview(): boolean {
    return this.policy?.has_roles || this.hasSchedules;
  }

  constructor(
    private cd: ChangeDetectorRef,
    private policyModalService: PolicyModalService,
    private policiesFacade: PoliciesFacadeService,
    private gridViewBuilder: GridViewBuilderService,
    private translate: TranslateService,
    private policyManagerEventService: PolicyManagerEventService
  ) {}

  // **** Lifecycle hooks ****

  ngOnInit(): void {
    this.policiesFacade.getPolicy(this.policyId)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((policy) => {
      this.policy = policy;
      if (this.policy?.policy_settings) {
        this.buildGrid();
        this.buildCycle();
        this.cd.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  // **** Translation key built ****

  buildTranslationKey(relativeKey: string): string {
    return `${this.translateKey}.${relativeKey}`;
  }

  sendForApprovalTooltipTranslationKey(status: ResourceStatusEnum, rowIndex: number): string {
    this.isResend = !!(status === ResourceStatusEnum.PENDING && this.approverLastNotified(rowIndex));
    return this.buildTranslationKey(
      this.isResend ? 'resend' : 'sendForApproval'
    );
  }

  statusTranslateKey(status: string): string {
    return `components.statusBadge.${statusTranslateMapping[status]}`;
  }

  // **** DOM Interaction Methods ****

  openPolicySettings(): void {
    this.policyModalService.addPolicySettingsModal({ policyId: this.policy.policy_id });
  }

  async approveOnBehalf(rowIndex: number, status: ResourceStatusEnum): Promise<void> {
    try {
      this.statusLoading[rowIndex] = true;
      this.cd.detectChanges();
      if (this.isApproved(status)) {
        this.policyManagerEventService.trackCancelApprovalEvent(this.policy);
        return await this.policiesFacade.approveOnBehalf(this.policy.policy_id, {
          approved: false,
          comments: '',
          email: this.gridView.rows[rowIndex].simplifiedCellsObject.email,
          approver_type: this.getRelevantApproverByRowNumber(rowIndex).type
        });
      }
      return this.policyModalService.approveOnBehalf({
        policyId: this.policy.policy_id,
        approverInstance: {
          email: this.gridView.rows[rowIndex].simplifiedCellsObject.email,
          name: this.gridView.rows[rowIndex].simplifiedCellsObject.name
        },
        approved: !this.isApproved(status),
        approverType: this.getRelevantApproverByRowNumber(rowIndex).type
      });
    } finally {
      delete this.statusLoading[rowIndex];
      this.cd.detectChanges();
    }
  }

  sendForApproval(rowIndex: number): void {
    this.policyModalService.sendForApproval({
      policyId: this.policy.policy_id,
      leftCornerText: this.policy.policy_name,
      approverEmail: this.gridView.rows[rowIndex].simplifiedCellsObject.email,
      isResend: this.isResend,
      approverType: this.getRelevantApproverByRowNumber(rowIndex).type
    });
  }

  getCellTemplate(cellHeader: string, isFirst: boolean): TemplateRef<any> {
    switch (cellHeader) {
      case 'status':
        return this.statusTemplate;
      case 'info':
        return this.approveTimeTemplate;
      case 'comments':
        return this.commentTemplate;
      default:
        return isFirst ? this.firstColumnCellTemplate : this.otherColsTemplate;
    }
  }

  approverLastNotified(rowIndex: number): Date {
    const lastNotifiedStr = this.approverRawLastNotified(rowIndex);
    // in case this is epoch time, that means that automation was defined, but no
    const isEpochOrUndefined = isEpoch(lastNotifiedStr) || !lastNotifiedStr;
    return !isEpochOrUndefined ? new Date(lastNotifiedStr) : undefined;
  }

  // ** Status helpers **

  isApproved(status: ResourceStatusEnum): boolean {
    return status === ResourceStatusEnum.APPROVED;
  }

  isPending(status: ResourceStatusEnum): boolean {
    return status === ResourceStatusEnum.PENDING;
  }

  // **** Private methods ****

  private approverRawLastNotified(rowIndex: number): string {
    return this.getRelevantApproverByRowNumber(rowIndex)?.last_notified;
  }

  private getRelevantApproverByRowNumber(rowIndex: number): CalculatedApprover {
    const approverName = this.gridView.rows[rowIndex].simplifiedCellsObject.email;
    const type = this.gridView.rows[rowIndex].simplifiedCellsObject.type;
    return this.policy.approvers_statuses.find(a => a.email === approverName && this.translate.instant(this.buildTranslationKey(a.type)) === type);
  }

  private buildGrid(): void {
    const roles = {
      type: [],
      name: [],
      role: [],
      email: [],
      status: [],
      comments: [],
      info: [],
    };
    if (this.policy.has_roles) {
      if (this.policy.policy_settings.owner) {
        this.addSingleRow(roles, this.policy.policy_settings.owner, ApproverRoleEnum.Owner);
      }
      this.policy.policy_settings.reviewers.forEach((reviewer) =>
        this.addSingleRow(roles, reviewer, ApproverRoleEnum.Reviewer)
      );
      this.policy.policy_settings.approvers.forEach((reviewer) =>
        this.addSingleRow(roles, reviewer, ApproverRoleEnum.Approver)
      );
    }
    this.gridView = this.gridViewBuilder.buildGridView(roles);
  }

  private buildCycle(): void {
    // Should be change and the BE will return history
    this.approversHistoryMenu = [
      {
        translationKey: this.buildTranslationKey('lastYear'),
        value: ApprovalFrequencyEnum.Yearly,
      },
    ];
  }

  private addSingleRow(roles, role: ApproverInstance, type: string): void {
    const status = this.policy.approvers_statuses.find(a => a.email === role.email && a.type === type).status;
    roles.type.push(this.translate.instant(this.buildTranslationKey(type)));
    roles.name.push(role.name);
    roles.role.push(role.role);
    roles.email.push(role.email);
    roles.status.push(status);
    roles.comments.push(this.isApproved(status) ? role.comments : '');
    roles.info.push(this.isApproved(status) ? role.approved_time : '');
  }
}
