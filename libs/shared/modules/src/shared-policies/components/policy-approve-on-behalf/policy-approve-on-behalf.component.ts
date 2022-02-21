import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { PoliciesFacadeService } from 'core/modules/data/services';
import { ApproverInstance, ApproverTypeEnum, Policy } from 'core/modules/data/models/domain';
import { SubscriptionDetacher } from 'core/utils';
import { PolicySettingsModalEnum } from '../../constants';
import { DynamicFormGroup } from 'core/modules/dynamic-form';
import { TextAreaControl } from 'core/models';
import { ApproveOnBehalfContext } from 'core/modules/shared-policies/models/approve-on-behalf-context';
import { PolicyManagerEventService } from 'core/services/policy-manager-event-service/policy-manager-event.service';

@Component({
  selector: 'app-policy-approve-on-behalf',
  templateUrl: './policy-approve-on-behalf.component.html',
  styleUrls: ['./policy-approve-on-behalf.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PolicyApproveOnBehalfComponent implements OnInit, OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  isLoading: boolean;
  policy: Policy;
  approveStatus: boolean;
  approveType: ApproverTypeEnum;
  approverInstance: ApproverInstance;
  formGroup: DynamicFormGroup<any>;

  constructor(
    private cd: ChangeDetectorRef,
    private switcher: ComponentSwitcherDirective,
    private policiesFacade: PoliciesFacadeService,
    private policyManagerEventService: PolicyManagerEventService
  ) {}

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  ngOnInit(): void {
    this.buildForm();
    this.switcher.sharedContext$.pipe(this.detacher.takeUntilDetach()).subscribe(async (context: ApproveOnBehalfContext) => {
      this.approverInstance = context.approverInstance;
      this.policy = await this.policiesFacade.getPolicy(context.policyId).pipe(take(1)).toPromise();
      this.approveStatus = context.approved;
      this.approveType = context.approverType;
    });
  }

  buildTranslationKey(key: string): string {
    return `policyManager.approveOnBehalf.${key}`;
  }

  async approve(): Promise<void> {
    this.policyManagerEventService.trackApproveOnBehalfEvent(this.policy);
    this.isLoading = true;
    try {
      await this.policiesFacade.approveOnBehalf(this.policy.policy_id,
        {
          approved: this.approveStatus,
          comments: this.formGroup.items.comment.value,
          email: this.approverInstance.email,
          approver_type: this.approveType});
      this.switcher.goById(PolicySettingsModalEnum.Success);
    } catch (e) {
      this.switcher.goById(PolicySettingsModalEnum.Error);
    } finally {
      this.isLoading = false;
      this.cd.detectChanges();
    }
  }

  private buildForm(): void {
    this.formGroup = new DynamicFormGroup({
      comment: new TextAreaControl({
        initialInputs: {
          label: this.buildTranslationKey('addComment'),
          displayCharactersCounter: true,
          multiline: true,
          rows: 3,
          resizable: false,
        }
      }),
    });
  }
}
