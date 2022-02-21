import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { filter, take } from 'rxjs/operators';
import { Validators } from '@angular/forms';
import { ModalWindowService } from 'core/modules/modals';
import { Subject } from 'rxjs';
import { ComponentSwitcherDirective } from '../../../component-switcher';
import { DynamicFormGroup } from '../../../dynamic-form';
import { ItemSharedContext } from '../../models/item-shared-context.model';
import { CustomItemModel, EditItemModalEnum } from '../../models';
import { DropdownControl, TextFieldControl } from 'core/models';
import { PolicyManagerEventService } from 'core/services/policy-manager-event-service/policy-manager-event.service';
import { ResourceStatusEnum } from 'core/modules/data/models';
import { PoliciesFacadeService } from 'core/modules/data/services/facades/policies-facade/policies-facade.service';
import { SubscriptionDetacher } from 'core/utils';

@Component({
  selector: 'app-item-edit-modal',
  templateUrl: './item-edit-modal.component.html',
  styleUrls: ['./item-edit-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemEditModalComponent<T> implements OnInit {
  formGroup: DynamicFormGroup<any>;
  sendingRequestBtnLoader$: Subject<boolean> = new Subject();

  private item: CustomItemModel;
  private translationRootKey: string;
  private policyTypes: string[];
  private action: (item: CustomItemModel) => Promise<any>;
  private detacher = new SubscriptionDetacher();

  constructor(
    private switcher: ComponentSwitcherDirective,
    private modalWindowService: ModalWindowService,
    private cd: ChangeDetectorRef,
    private policyManagerEventService: PolicyManagerEventService,
    private policyFacade: PoliciesFacadeService
  ) {}

  async ngOnInit(): Promise<void> {
    this.policyFacade.getPolicyTypesSorted()
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((types) => {
        this.policyTypes = types;
        this.cd.detectChanges();
    });

    await this.getSwitcherContextData();
    await this.createEditItemDynamicForm();
    this.cd.detectChanges();
  }

  close(): void {
    this.modalWindowService.close();
  }

  async updateFormBtnClick(): Promise<void> {
    this.sendingRequestBtnLoader$.next(true);

    try {
      await this.action(this.formGroup.value);
      this.policyManagerEventService.trackUpdatePolicyEvent({
        policy_name: this.formGroup.value.name,
        policy_type: this.formGroup.value.type,
        status: this.item.status as ResourceStatusEnum,
      });
      this.switcher.goById(EditItemModalEnum.SuccessModal);
    } catch (e) {
      this.switcher.goById(EditItemModalEnum.ErrorModal);
    } finally {
      this.sendingRequestBtnLoader$.next(false);
    }
  }

  buildTranslationKey(partialKey: string): string {
    return `${this.translationRootKey}.${partialKey}`;
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  private async getSwitcherContextData(): Promise<void> {
    const context: ItemSharedContext = await this.switcher.sharedContext$
      .pipe(
        filter((c) => !!c),
        take(1)
      )
      .toPromise();

    this.item = context.item;
    this.translationRootKey = context.translationKey;
    this.action = context.submitAction;

    await this.createEditItemDynamicForm();
  }

  private async createEditItemDynamicForm(): Promise<void> {
    this.formGroup = new DynamicFormGroup({
      name: new TextFieldControl({
        initialInputs: {
          label: this.buildTranslationKey('nameLabel'),
          displayCharactersCounter: true,
          required: true,
        },
        initialValue: this.item.name,
        validators: [Validators.required],
      }),
      type: new DropdownControl({
        initialInputs: {
          data: this.policyTypes,
          validateOnDirty: false,
          required: true,
          selectFirstValue: true,
        },
        initialValue: this.item.type,
        validators: [Validators.required],
      }),
      description: new TextFieldControl({
        initialInputs: {
          label: this.buildTranslationKey('descriptionLabel'),
          displayCharactersCounter: true,
          multiline: true,
          rows: 3,
          resizable: false,
        },
        initialValue: this.item.description ?? '',
      }),
    });
  }
}
