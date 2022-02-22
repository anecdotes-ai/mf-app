import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MainHeaderInput } from 'core/modules/component-modules';
import { ItemSharedContext } from 'core/modules/customization/models';
import { CustomizationModalService } from 'core/modules/customization/services';
import { CalculatedPolicy } from 'core/modules/data/models';
import { Policy } from 'core/modules/data/models/domain';
import { PoliciesFacadeService } from 'core/modules/data/services/facades';
import { SearchDefinitionModel } from 'core/modules/data-manipulation/search';
import { LoaderManagerService } from 'core/services';
import { SubscriptionDetacher } from 'core/utils';

@Component({
  selector: 'app-policy-manager',
  templateUrl: './policy-manager.component.html',
  styleUrls: ['./policy-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PolicyManagerComponent implements OnInit, OnDestroy {
private detacher = new SubscriptionDetacher();
  private notApplicablyPolicies: CalculatedPolicy[];
  private translationBase = 'policyManager';

  searchDefinitions: SearchDefinitionModel<Policy>[] = [
    {
      propertySelector: (c) => c.policy_name,
    },
    {
      propertySelector: (c) => c.evidence?.evidence_name,
    },
  ];

  headerInput: MainHeaderInput = {
    translationRootKey: this.translationBase,
    searchDefinitions: this.searchDefinitions,
    btnIcon: 'magic',
    hasActionBtn: true,
  };

  constructor(
    private loaderManager: LoaderManagerService,
    private customizationService: CustomizationModalService,
    private policiesFacade: PoliciesFacadeService
  ) {}

  ngOnInit(): void {
    this.loaderManager.show();
    this.policiesFacade
      .getAllNotApplicablePolicies()
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((policies) => (this.notApplicablyPolicies = policies));
  }

  buildTranslationKey(relativeKey: string): string {
    return `${this.translationBase}.${relativeKey}`;
  }

  addPolicy(): void {
    const context = {
      translationKey: this.buildTranslationKey('addItemModal'),
      submitAction: this.policiesFacade.addCustomPolicy.bind(this.policiesFacade),
      poolOfItems: this.notApplicablyPolicies,
      poolValueSelector: (policy: Policy) => policy.policy_name,
    } as ItemSharedContext;

    this.customizationService.openAddPolicyModal(context);
  }

  stopLoading(): void {
    this.loaderManager.hide();
  }

  ngOnDestroy(): void {
    this.loaderManager.hide();
    this.detacher.detach();
  }
}
