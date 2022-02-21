import { ConnectionFormInstanceStatesEnum, PluginConnectionEntity } from './../../../store/models/state-entity.model';
import { MultipleAccountsFieldsEnum } from './../../../models/multiple-accounts-fields.enum';
import { AppSettingsRoutesSegments } from 'core/constants/routes';
import { AppRoutes } from 'core/constants/routes';
import { PluginConnectionFacadeService } from './../../../services/facades/plugin-connection-facade/plugin-connection-facade.service';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { DropdownControl, TextFieldControl } from 'core/models';
import { CustomValidators, DynamicFormGroup } from 'core/modules/dynamic-form';
import { extractOnPremFields, SubscriptionDetacher, extractMultipleAccountFields } from 'core/utils';
import { Observable } from 'rxjs';
import { map, startWith, take, filter, tap } from 'rxjs/operators';
import { ParamTypeEnum, Service, Agent } from 'core/modules/data/models/domain';
import { PluginConnectionFormBuilderService } from '../../../services';
import { Validators, AbstractControl } from '@angular/forms';
import { AgentsFacadeService } from 'core/modules/data/services/facades/agent-facade/agents-facade.service';
import { OnPremFieldsEnum } from 'core/modules/plugins-connection/models/on-prem-fields.enum';
import { Router } from '@angular/router';
import { OnPremEventService } from 'core/services/on-prem-event-service/on-prem-event.service';
import {} from 'core/modules/plugins-connection/models';


export enum TakeDynamicFormValues {
  DIRTY_VALUES = 'DIRTY_VALUES',
  ALL_VALUES = 'ALL_VALUES',
}

@Component({
  selector: 'app-all-plugin-connection-forms',
  templateUrl: './all-plugin-connection-forms.component.html',
  styleUrls: ['./all-plugin-connection-forms.component.scss'],
})
export class AllPluginConnectionFormsComponent implements OnChanges, OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  private formDetacher: SubscriptionDetacher = new SubscriptionDetacher();

  private _isDynamicFormClean$: Observable<boolean>;
  private _dynamicFormGroup: DynamicFormGroup<any>;
  private _initialFormValues: { [key: string]: any };

  // Onprem related data
  private _isOnpremFormClean$: Observable<boolean>;
  private _onPremForm?: DynamicFormGroup<any>;
  private _agents: Agent[];

  // multiple accounts related data
  private _isMultipleAcoountsFormClean$: Observable<boolean>;
  private _multipleAccountsForm?: DynamicFormGroup<any>;

  private currentConnectionEntity: PluginConnectionEntity;

  @Input()
  private service: Service;

  get AllFormsInvalid(): boolean {
    return this.ServiceDynamicForm?.invalid || this.OnPremForm?.invalid || this.MultipleAccountsForm?.invalid;
  }

  get AllFormsNotDirty(): boolean {
    return !this.ServiceDynamicForm?.dirty && !this.OnPremForm?.dirty && !this.MultipleAccountsForm?.dirty;
  }

  get Service(): Service {
    return this.service;
  }

  get InitialFormValues(): any {
    return this._initialFormValues;
  }

  get ServiceDynamicForm(): DynamicFormGroup<any> {
    return this._dynamicFormGroup;
  }

  get OnPremForm(): DynamicFormGroup<any> {
    return this._onPremForm;
  }

  get MultipleAccountsForm(): DynamicFormGroup<any> {
    return this._multipleAccountsForm;
  }

  get isDynamicFormClean$(): Observable<boolean> {
    return this._isDynamicFormClean$;
  }

  get isMultipleAccountsFormClean$(): Observable<boolean> {
    return this._isMultipleAcoountsFormClean$;
  }

  get isOnpremFormClean$(): Observable<boolean> {
    return this._isOnpremFormClean$;
  }

  pendingInstancesCount = 1;

  /* Emits everytime form recreates */
  @Output()
  formsCreated = new EventEmitter<any>(true);

  constructor(
    private formBuilder: PluginConnectionFormBuilderService,
    private pluginConnectionFacadeService: PluginConnectionFacadeService,
    private agentsFacade: AgentsFacadeService,
    private router: Router,
    private OnPremEventService: OnPremEventService
  ) { }

  /* Hooks */

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if ('service' in changes && this.service) {
      if (changes['service'].firstChange) {
        if (this.service.service_is_onprem) {
          this._agents = await this.agentsFacade.getAgents().pipe(take(1)).toPromise();
        }
        this.setServiceConnectionEntityListener();

        if (this._onPremForm) {
          this._onPremForm.valueChanges.pipe(
            filter(valueChanges => !!valueChanges.agent_id),
            this.detacher.takeUntilDetach()
          ).subscribe(valueChanges => {
            const agent = this._agents.find((value) => value.name === valueChanges.agent_id);
            this.OnPremEventService.trackConnectorSelectEvent(
              agent.tunnels?.length,
              agent.tunnels?.map((value) => value.service),
              agent.id
            );
          });
        }
      }

      this.pluginConnectionFacadeService
        .getPluginConnectionEntity(this.service)
        .pipe(
          tap((s) => (this.currentConnectionEntity = s)),
          map(
            (pluginConnectionEntity) =>
              Object.values(pluginConnectionEntity.instances_form_values)?.filter(
                (connectionFormValueEntity) => connectionFormValueEntity.instance_state === ConnectionFormInstanceStatesEnum.PENDING
              )?.length
          ),
          this.detacher.takeUntilDetach()
        )
        .subscribe((count) => (this.pendingInstancesCount = count));
    }
  }

  ngOnDestroy(): void {
    this.detacher.detach();
    this.formDetacher.detach();
  }

  shouldDisplayAnimation(): boolean {
    return this.service.service_is_onprem && !this._onPremForm && !this._dynamicFormGroup;
  }

  disableAllForms(): void {
    this.ServiceDynamicForm?.disable();
    this.OnPremForm?.disable();
    this.MultipleAccountsForm?.disable();
  }

  enableAllForms(): void {
    this.ServiceDynamicForm?.enable();
    this.OnPremForm?.enable();
    this.MultipleAccountsForm?.enable();
  }

  /* Get forms values related methods */

  getDynamicFormValues(mode: TakeDynamicFormValues = TakeDynamicFormValues.ALL_VALUES): { [key: string]: any } {
    let serviceSecrets: { [key: string]: any } =
      mode === TakeDynamicFormValues.DIRTY_VALUES
        ? { ...this.getChangedFormValues(this._dynamicFormGroup) }
        : { ...this._dynamicFormGroup.value };
    const checkBoxGroup = serviceSecrets[ParamTypeEnum.CHECKBOXPRODUCT];

    if (checkBoxGroup) {
      delete serviceSecrets[ParamTypeEnum.CHECKBOXPRODUCT];
      serviceSecrets = { ...serviceSecrets, ...checkBoxGroup };
    }

    return serviceSecrets;
  }

  getMultipleAccountsFormValues(
    mode: TakeDynamicFormValues = TakeDynamicFormValues.ALL_VALUES
  ): { [key: string]: any } {
    let multipleAccountsFields: { [key: string]: any } =
      mode === TakeDynamicFormValues.DIRTY_VALUES
        ? { ...this.getChangedFormValues(this._multipleAccountsForm) }
        : { ...this._multipleAccountsForm.value };
    multipleAccountsFields = { ...multipleAccountsFields };
    return multipleAccountsFields;
  }

  getOnPremFormValues(mode: TakeDynamicFormValues = TakeDynamicFormValues.ALL_VALUES): { [key: string]: any } {
    let onPremFields: { [key: string]: any } =
      mode === TakeDynamicFormValues.DIRTY_VALUES
        ? { ...this.getChangedFormValues(this._onPremForm) }
        : { ...this._onPremForm.value };
    const agentID = this._agents.find((agent) => agent.name === onPremFields[OnPremFieldsEnum.AgentID])?.id;
    onPremFields = { ...onPremFields, [OnPremFieldsEnum.AgentID]: agentID };
    return onPremFields;
  }

  getAllFormValues(mode: TakeDynamicFormValues = TakeDynamicFormValues.ALL_VALUES): { [key: string]: any } {
    let resultValues = null;
    if (this._onPremForm) {
      resultValues = this.getOnPremFormValues(mode);
    }

    if (this._multipleAccountsForm) {
      resultValues = { ...resultValues, ...this.getMultipleAccountsFormValues(mode) };
    }

    resultValues = { ...resultValues, ...this.getDynamicFormValues(mode) };

    return resultValues;
  }

  private checkIsAliasDuplication(abstractControl: AbstractControl): boolean {
    const currSelectedInstance = this.currentConnectionEntity?.selected_service_instance_id;
    const currentInputedAccountAlias = abstractControl.value;
    const isDuplicatesOnPendingAccounts = this.currentConnectionEntity?.instances_form_values
      ? Object.values(this.currentConnectionEntity?.instances_form_values).some(
        (s) =>
          s.instance_id !== currSelectedInstance &&
          s.connection_form_values[MultipleAccountsFieldsEnum.AccountName] === currentInputedAccountAlias
      )
      : false;

    return (
      this.service?.service_instances_list
        ?.filter((s) => s.service_instance_id !== currSelectedInstance)
        .some((s) => s.service_instance_display_name === currentInputedAccountAlias) || isDuplicatesOnPendingAccounts
    );
  }

  private validateDuplication(abstractControl: AbstractControl): { duplicate: boolean } {
    return this.checkIsAliasDuplication(abstractControl) ? { duplicate: true } : null;
  }

  private getChangedFormValues(form: DynamicFormGroup<any>): { [key: string]: any } {
    return Object.entries(form.controls)
      .filter(([_, control]) => !!control.dirty)
      .reduce((acc, [name, control]) => ({ ...acc, [name]: control.value }), {});
  }

  private setServiceConnectionEntityListener(): void {
    this.pluginConnectionFacadeService
      .getPluginConnectionEntity(this.service)
      .pipe(
        filter((ce) => !!ce?.selected_service_instance_id),
        map((ce) => {
          return ce.instances_form_values[ce.selected_service_instance_id];
        }),
        this.detacher.takeUntilDetach()
      )
      .subscribe((serviceConnectionEntity) => {
        this.createAllPossibleConnectionForms(serviceConnectionEntity.connection_form_values);

        this.formsCreated.next({});
      });
  }

  /*   Form listeners related methods */

  private refreshAllFormListeners(service: Service): void {
    this.refreshDynamicFormListeners(service);

    if (this.OnPremForm) {
      this.refreshOnPremFormListeners();
    }

    if (this._multipleAccountsForm) {
      this.refreshMultipleAccountsFormListeners();
    }
  }

  private refreshMultipleAccountsFormListeners(): void {
    if (!this._multipleAccountsForm) {
      this.createOnPremForm(null);
    }
    this._isMultipleAcoountsFormClean$ = this._multipleAccountsForm.valueChanges.pipe(
      startWith(this._multipleAccountsForm.value),
      map((value) => !Object.values(value).some((x) => !!x))
    );
  }

  private refreshDynamicFormListeners(service: Service): void {
    if (!this._dynamicFormGroup) {
      this.createFulfilledDynamicFormGroup(service, null);
    }

    this._isDynamicFormClean$ = this._dynamicFormGroup.valueChanges.pipe(
      startWith(this._dynamicFormGroup.value),
      map((value) => !Object.values(value).some((x) => !!x))
    );
  }

  private refreshOnPremFormListeners(): void {
    if (!this._onPremForm) {
      this.createOnPremForm(null);
    }
    this._isOnpremFormClean$ = this._onPremForm.valueChanges.pipe(
      startWith(this._onPremForm.value),
      map((value) => !Object.values(value).some((x) => !!x))
    );
  }

  /* Form creation related methods */

  private serviceAccountAliasTemplateFactory(): string {
    return `${this.service.service_display_name} - #${this.pendingInstancesCount + this.service.service_instances_list.length
      }`;
  }

  private createMultipleAccountsForm(fields: { [key: string]: any }): void {
    const extractedName = extractMultipleAccountFields(fields)[MultipleAccountsFieldsEnum.AccountName];
    this._multipleAccountsForm = new DynamicFormGroup({
      [MultipleAccountsFieldsEnum.AccountName]: new TextFieldControl({
        initialValue: extractedName ? extractedName : this.serviceAccountAliasTemplateFactory(),
        initialInputs: {
          label: this.buildTranslationKey('dynamicForm.accountName'),
          validateOnDirty: true,
          required: true,
          errorTexts: { duplicate: this.buildTranslationKey('dynamicForm.accountAliasDuplicateValidatiomMessage'), required: this.buildTranslationKey('dynamicForm.accountAliasRequired') },
        },
        validators: [
          Validators.maxLength(200),
          Validators.required,
          (a) => this.validateDuplication(a),
          CustomValidators.noWhiteSpace,
        ],
      }),
    });
    this._initialFormValues = { ...this._initialFormValues, ...extractMultipleAccountFields(fields) };
  }

  private createOnPremForm(connectionValues: { [key: string]: any }): void {
    const fields = extractOnPremFields(connectionValues);
    this._onPremForm = new DynamicFormGroup({
      [OnPremFieldsEnum.AgentID]: new DropdownControl({
        initialInputs: {
          data: this._agents.map((value) => value.name),
          titleTranslationKey: this.buildTranslationKey('dynamicForm.agentLabel'),
          emptyListPlaceholder: this.buildTranslationKey('dynamicForm.noAgentsPlaceholder'),
          placeholderTranslationKey: this.buildTranslationKey('dynamicForm.agentDropdownPlaceholder'),
          validateOnDirty: false,
          required: true,
          selectFirstValue: false,
          bottomDropdownAction: {
            translationKey: this.buildTranslationKey('dynamicForm.bottomDropdownActionName'),
            icon: 'newscreen',
            action: () => {
              this.router.navigate([`${AppRoutes.Settings}/${AppSettingsRoutesSegments.Connectors}`]);
            },
          },
        },
        validators: [Validators.required],
      }),
      [OnPremFieldsEnum.Hostname]: new TextFieldControl({
        initialValue: fields?.hostname,
        initialInputs: {
          label: this.buildTranslationKey('dynamicForm.hostnameLabel'),
          placeholder: this.buildTranslationKey('dynamicForm.hostnameLabel'),
          validateOnDirty: true,
          required: true,
        },
        validators: [Validators.required, CustomValidators.url],
      }),
      [OnPremFieldsEnum.Port]: new TextFieldControl({
        initialValue: fields?.port,
        initialInputs: {
          label: this.buildTranslationKey('dynamicForm.portsLabel'),
          placeholder: this.buildTranslationKey('dynamicForm.portsLabel'),
          validateOnDirty: true,
          required: true,
          inputType: 'number',
          errorTexts: {
            min: this.buildTranslationKey('dynamicForm.portValidationMessage'),
            max: this.buildTranslationKey('dynamicForm.portValidationMessage'),
          },
        },
        validators: [Validators.required, Validators.min(0), Validators.max(65535)],
      }),
    });
    this._onPremForm.controls[OnPremFieldsEnum.AgentID].setValue(
      this._agents.find((value) => value.id === fields[OnPremFieldsEnum.AgentID])?.name
    );

    this._initialFormValues = { ...this._initialFormValues, ...this._onPremForm.value };
  }

  private createAllPossibleConnectionForms(connectionValues: { [key: string]: any }): void {
    this._initialFormValues = {};
    if (this.service.service_multi_account) {
      this.createMultipleAccountsForm(connectionValues);
    }

    if (this.service.service_is_onprem) {
      this.createOnPremForm(connectionValues);
    }

    this.createFulfilledDynamicFormGroup(this.service, connectionValues);
    this.refreshAllFormListeners(this.service);
  }

  private createFulfilledDynamicFormGroup(service: Service, fulfil_data: any): void {
    this._dynamicFormGroup = this.formBuilder.buildDynamicFormGroup(service.service_fields, fulfil_data, {
      password_show_hide_button: true,
    });

    this._initialFormValues = { ...this._initialFormValues, ...this._dynamicFormGroup.value };
  }

  buildTranslationKey(relativeKey: string): string {
    return `openedPlugin.${relativeKey}`;
  }
}
