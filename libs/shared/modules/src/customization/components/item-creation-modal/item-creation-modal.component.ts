import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { DropdownControl, TextAreaControl, TextFieldControl } from 'core/models/form';
import { SubscriptionDetacher } from 'core/utils/subscription-detacher.class';
import { ComponentSwitcherDirective } from '../../../component-switcher';
import { DynamicFormGroup } from '../../../dynamic-form';
import { ItemSharedContext } from '../../models/item-shared-context.model';
import { AddItemModalEnum, CustomItemModel } from '../../models';
import { PolicyManagerEventService } from 'core/services/policy-manager-event-service/policy-manager-event.service';
import { PolicyAddType } from 'core';
import { ResourceStatusEnum } from 'core/modules/data/models';
import { PoliciesFacadeService } from 'core/modules/data/services/facades/policies-facade/policies-facade.service';
import { mergeMap, switchMap, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-item-creation-modal',
  templateUrl: './item-creation-modal.component.html',
  styleUrls: ['./item-creation-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemCreationModalComponent implements OnInit, OnDestroy {
  isLoading: boolean;

  formGroup: DynamicFormGroup<any>;

  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  private submitAction: (item: CustomItemModel) => Promise<any>;
  private translationKey: string;
  private policyTypes: string[];

  constructor(
    private cd: ChangeDetectorRef,
    private switcher: ComponentSwitcherDirective,
    private policyManagerEventService: PolicyManagerEventService,
    private policyFacade: PoliciesFacadeService
  ) {}

  ngOnInit(): void {
    this.switcher.sharedContext$
      .pipe(
        tap((context: ItemSharedContext) => this.initProperties(context)),
        switchMap(() => this.policyFacade.getPolicyTypesSorted()),
        this.detacher.takeUntilDetach()
      )
      .subscribe((types) => {
        this.policyTypes = types;
        this.initDynamicForm();
    });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  buildTranslationKey(relativeKey: string): string {
    return `${this.translationKey}.${relativeKey}`;
  }

  switchToSelectExistingView(): void {
    this.switcher.goById(AddItemModalEnum.SelectExisting);
  }

  async addNewItem(): Promise<void> {
    this.isLoading = true;
    this.cd.detectChanges();

    try {
      await this.submitAction(this.formGroup.value);
      this.policyManagerEventService.trackAddPolicyEvent(
        { policy_name: this.formGroup.value.name, policy_type: this.formGroup.value.type, status: ResourceStatusEnum.NOTSTARTED },
        PolicyAddType.Created
      );
      this.switcher.goById(AddItemModalEnum.Success);
    } catch {
      this.switcher.goById(AddItemModalEnum.Error);
    } finally {
      this.isLoading = false;
      this.cd.detectChanges();
    }
  }

  private initProperties(context: ItemSharedContext): void {
    this.submitAction = context.submitAction;
    this.translationKey = context.translationKey;
  }

  private initDynamicForm(): void {
    this.formGroup = new DynamicFormGroup({
      name: new TextFieldControl({
        initialInputs: {
          label: this.buildTranslationKey('newItemForm.nameLabel'),
          displayCharactersCounter: true,
          required: true,
        },
        validators: [Validators.required],
      }),
      type: new DropdownControl({
        initialInputs: {
          data: this.policyTypes,
          validateOnDirty: false,
          required: true,
          selectFirstValue: true,
          titleTranslationKey: this.buildTranslationKey('newItemForm.typeLabel'),
          placeholderTranslationKey: this.buildTranslationKey('newItemForm.typeDropdownPlaceholder')
        },
        validators: [Validators.required],
      }),
      description: new TextAreaControl({
        initialInputs: {
          label: this.buildTranslationKey('newItemForm.descriptionLabel'),
          displayCharactersCounter: true,
          maxLength: 100,
          multiline: true,
          rows: 3,
          resizable: false,
        },
        validators: Validators.maxLength(100),
      }),
    });
  }
}
