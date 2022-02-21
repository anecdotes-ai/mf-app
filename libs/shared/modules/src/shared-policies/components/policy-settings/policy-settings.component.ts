import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SubscriptionDetacher } from 'core/utils';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { PolicySettingsModalEnum } from '../../constants/modal-ids.constants';
import { PolicyRoleComponent } from '../policy-role/policy-role.component';
import { PolicySchedulingComponent } from '../policy-scheduling/policy-scheduling.component';
import { Policy, PolicySettings } from 'core/modules/data/models/domain';
import { PoliciesFacadeService } from 'core/modules/data/services';
import { take } from 'rxjs/operators';
import { SettingsContext } from '../../models/settings-context';

@Component({
  selector: 'app-policy-settings',
  templateUrl: './policy-settings.component.html',
  styleUrls: ['./policy-settings.component.scss'],
})
export class PolicySettingsComponent implements OnInit, OnDestroy {

  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  @ViewChild('policyStageForm')
  public policyStageForm: PolicyRoleComponent | PolicySchedulingComponent;

  @Input()
  stage: PolicySettingsModalEnum;

  @Input()
  currentStep: number;

  isLoading: boolean;
  translationKey: string;
  policy: Policy;
  policySettings: PolicySettings;

  steps = [PolicySettingsModalEnum.Owner,
  PolicySettingsModalEnum.Reviewers,
  PolicySettingsModalEnum.Approvers,
  PolicySettingsModalEnum.Scheduling
  ];

  stepText: Array<string>;

  get isAddMoreVisible(): boolean {
    return [PolicySettingsModalEnum.Approvers, PolicySettingsModalEnum.Reviewers].includes(this.stage);
  }
  get isBack(): boolean {
    return !!this.currentStep;
  }
  get isNextValid(): boolean {
    return this.policyStageForm?.invalid;
  }
  get isTouched(): boolean {
    return this.policyStageForm?.touched;
  }

  get isScheduling(): boolean {
    return this.stage === PolicySettingsModalEnum.Scheduling;
  }

  get nextText(): string {
    return this.buildTranslationKey(this.currentStep === this.steps.length - 1 ? 'save' : this.isTouched ? 'next' : 'skip');
  }

  constructor(
    private cd: ChangeDetectorRef,
    private switcher: ComponentSwitcherDirective,
    private policiesFacade: PoliciesFacadeService,
  ) {}

  ngOnInit(): void {
    this.switcher.sharedContext$.pipe(this.detacher.takeUntilDetach()).subscribe(async (context: SettingsContext) => {
      this.translationKey = context.translationKey;
      this.policy = await this.policiesFacade.getPolicy(context.policyId).pipe(take(1)).toPromise();
      this.policySettings = context.policySettings || this.policy.policy_settings;
      this.stepText = this.steps.map((_, index) => this.buildStepTranslationKey('name', index));
    });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  buildTranslationKey(relativeKey: string): string {
    return `${this.translationKey}.${relativeKey}`;
  }
  buildStepTranslationKey(relativeKey: string, step: number): string {
    return `${this.translationKey}.${this.steps[step]}.${relativeKey}`;
  }

  async switchNextStep(): Promise<void> {
    const context = this.setContext();
    if (this.steps.length > this.currentStep + 1) {
      this.switcher.changeContext(context);
      this.switcher.goNext();
    }
    else {
      this.isLoading = true;
      try {
        await this.policiesFacade.editPolicySettings(this.policy, context.policySettings);
        this.switcher.goById(PolicySettingsModalEnum.Success);
      } catch (e) {
        this.switcher.goById(PolicySettingsModalEnum.Error);
      } finally {
        this.isLoading = false;
        this.cd.detectChanges();
      }
    }
  }

  switchPrevStep(): void {
    if (this.currentStep) {
      this.switcher.changeContext(this.setContext());
      this.switcher.goPrevious();
    }
  }

  private setContext(): SettingsContext {
    const policySettings = { ...this.policySettings };
    policySettings[this.stage] = this.policyStageForm.formData();
    return {
      translationKey: this.translationKey,
      policySettings: policySettings,
      policyId: this.policy.policy_id
    };
  }
}
