import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { DynamicFormGroup } from '../../../dynamic-form';
import { AddItemModalEnum } from '../../models/modal-ids.constants';
import { ItemSharedContext } from '../../models/item-shared-context.model';
import { SubscriptionDetacher } from 'core/utils';
import { DropdownControl, PolicyAddType } from 'core';
import { ComponentSwitcherDirective } from '../../../component-switcher';
import { CustomItemModel } from '../../models';
import { PolicyManagerEventService } from 'core/services/policy-manager-event-service/policy-manager-event.service';
@Component({
  selector: 'app-select-from-existing',
  templateUrl: './select-from-existing.component.html',
  styleUrls: ['./select-from-existing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectFromExistingComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  formGroup: DynamicFormGroup<any>;

  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  private submitAction: (item: CustomItemModel) => Promise<any>;
  private translationKey: string;

  constructor(
    private cd: ChangeDetectorRef,
    private switcher: ComponentSwitcherDirective,
    private policyManagerEventService: PolicyManagerEventService
  ) {}

  ngOnInit(): void {
    this.switcher.sharedContext$.pipe(this.detacher.takeUntilDetach()).subscribe((context: ItemSharedContext) => {
      this.submitAction = context.submitAction;
      this.translationKey = context.translationKey;
      this.initFormGroup(context.poolOfItems, context.poolValueSelector);
      this.enrichForm();
    });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  async addExistingItem(): Promise<void> {
    this.isLoading = true;
    this.cd.detectChanges();

    try {
      await this.submitAction(this.formGroup.items.item.value);
      this.policyManagerEventService.trackAddPolicyEvent(
        {
          policy_name: this.formGroup.items.item.value.policy_name,
          policy_type: this.formGroup.items.item.value.policy_type,
          status: this.formGroup.items.item.value.status,
        },
        PolicyAddType.SelectedFromExisting
      );
      this.switcher.goById(AddItemModalEnum.Success);
    } catch (e) {
      this.switcher.goById(AddItemModalEnum.Error);
    } finally {
      this.isLoading = false;
      this.cd.detectChanges();
    }
  }

  buildTranslationKey(relativeKey: string): string {
    return `${this.translationKey}.${relativeKey}`;
  }

  switchToCreateNewView(): void {
    this.switcher.goById(AddItemModalEnum.AddNew);
  }

  private initFormGroup(poolOfItems: any[], valueSelector: (c: any) => string): void {
    this.formGroup = new DynamicFormGroup({
      item: new DropdownControl({
        initialInputs: {
          data: poolOfItems,
          searchEnabled: true,
          displayValueSelector: valueSelector,
        },
        validators: [Validators.required],
      }),
    });
  }
  private enrichForm(): void {
    this.formGroup.items.item.inputs.titleTranslationKey = this.buildTranslationKey('newItemForm.selectItemLabel');
    this.formGroup.items.item.inputs.searchFieldPlaceholder = this.buildTranslationKey('newItemForm.search');
    this.formGroup.items.item.inputs.placeholderTranslationKey = this.buildTranslationKey('newItemForm.selectItem');
  }
}
