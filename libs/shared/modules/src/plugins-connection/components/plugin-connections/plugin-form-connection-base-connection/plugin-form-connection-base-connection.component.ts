import { MultipleAccountsFieldsEnum } from './../../../models/multiple-accounts-fields.enum';
import { MultipleAccountsConnectionHelperService } from './../../../services/facades/multiple-accounts-connection-helper/multiple-accounts-connection-helper.service';
import {
  ConnectionFormInstanceStatesEnum,
  ConnectionFormValueEntity,
} from 'core/modules/plugins-connection/store/models/state-entity.model';
import { ServiceLogTypeEnum } from 'core/models/service-log-type';
import {
  AllPluginConnectionFormsComponent,
  TakeDynamicFormValues,
} from './../all-plugin-connection-forms/all-plugin-connection-forms.component';
import { PluginConnectionStates } from './../../../models/plugin-connection-states.enum';
import { PluginConnectionFacadeService } from './../../../services/facades/plugin-connection-facade/plugin-connection-facade.service';
import { PluginFacadeService } from 'core/modules/data/services/facades';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import { delayedPromise, isPluginInstallationFlow, SubscriptionDetacher } from 'core/utils';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { map, filter, take, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { maxNumberOfServiceAccountsAllowed, Service, ServiceFailedStatuses, ServiceNotInstalledStatuses, ServiceStatusEnum } from 'core/modules/data/models/domain';
import { PluginsEventService } from 'core/modules/plugins-connection/services/plugins-event-service/plugins-event.service';

export enum FormModes {
  INITIAL = 'INITIAL',
  EDITABLE = 'EDITABLE',
  ON_EDIT = 'ON_EDIT',
}

@Component({
  selector: 'app-plugin-form-connection-base-connection',
  templateUrl: './plugin-form-connection-base-connection.component.html',
  styleUrls: ['./plugin-form-connection-base-connection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PluginFormConnectionBaseComponent implements OnChanges, OnDestroy, AfterViewInit {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  private onChangesDetacher: SubscriptionDetacher = new SubscriptionDetacher();
  readonly pendingAccountsPluralMapping: any = {
    '=1': this.buildTranslationKey('pendingAccount'),
    other: this.buildTranslationKey('pendingAccounts'),
  };

  get displayThreeDotsMenu(): boolean {
    return (
      (this.service.service_status === ServiceStatusEnum.INSTALLED ||
        this.service.service_status === ServiceStatusEnum.CONNECTIVITYFAILED) &&
      !this.service.service_multi_account
    );
  }

  get isBackButtonVisible(): boolean {
    return (this.service.service_multi_account && !!this.service.service_instances_list?.filter((s) => s.service_status !== ServiceStatusEnum.REMOVED && !!s.service_status).length) || this.pendingInstancesCount > 1;
  }

  get connectButtonVisible(): boolean {
    return this.mode === FormModes.INITIAL;
  }

  get reconnectButtonVisible(): boolean {
    return this.mode === FormModes.ON_EDIT;
  }

  get cleanFormButtonVisible(): boolean {
    return this.mode === FormModes.INITIAL;
  }

  get editFormButtonVisible(): boolean {
    return this.mode === FormModes.EDITABLE;
  }

  get cancelEditFormButtonVisible(): boolean {
    return this.mode === FormModes.ON_EDIT;
  }

  get addAnotherAccountButtonVisible(): boolean {
    return this.mode === FormModes.INITIAL
      && ((!ServiceNotInstalledStatuses.some((v) => v === this.service.service_status)
        && (!ServiceFailedStatuses.some((v) => v === this.service.service_instances_list.find((v) => v.service_instance_id === this.currentSelectedInstance.instance_id)?.service_status))
        && (this.currentSelectedInstance.instance_state === ConnectionFormInstanceStatesEnum.PENDING || !this.currentSelectedInstance.instance_state))
        || this.pendingInstancesCount > 1);
  }

  get addAnotherAccountButtonDisabled(): boolean {
    return (this.allFormsComponentRef?.AllFormsInvalid || this.isAddingAccountsLimit);
  }

  get isAddingAccountsLimit(): boolean {
    return this.getCountOfNotRemovedServiceInstancesOfService() >= maxNumberOfServiceAccountsAllowed;
  }

  get pendingInstancesNamesExcludingCurrent(): string[] {
    const currAccountName = this.allFormsComponentRef.getMultipleAccountsFormValues(TakeDynamicFormValues.ALL_VALUES)[MultipleAccountsFieldsEnum.AccountName];
    return this.pendingInstancesNames.filter((name) => name !== currAccountName);
  }

  @ViewChildren('allForms')
  allFormsComponentQueryList: QueryList<AllPluginConnectionFormsComponent>;
  allFormsComponentRef: AllPluginConnectionFormsComponent;

  get isEditableMode(): boolean {
    return this.mode === FormModes.EDITABLE;
  }

  @Input()
  service: Service;
  currentSelectedInstance: ConnectionFormValueEntity;

  mode: FormModes;

  reconnectButtonDisabled: boolean;
  isFormClean$: Observable<boolean>;
  isOnpremFormClean$: Observable<boolean>;
  isClearButtonDisabled$: Observable<boolean>;
  reconnectButtonDisabled$: Observable<boolean>;

  serviceStatusEnum = ServiceStatusEnum;
  connectivityFailure$: Observable<string>;

  pendingInstancesCount: number;
  pendingInstancesNames: string[];

  showSuccessAnimation = new Subject<boolean>();

  @Output()
  install = new EventEmitter<{ allValues: { [key: string]: any }; dirtyValues: { [key: string]: any } }>(true);
  @Output()
  reconnect = new EventEmitter<{ allValues: { [key: string]: any }; dirtyValues: { [key: string]: any } }>(true);

  constructor(
    private pluginConnectionFacadeService: PluginConnectionFacadeService,
    private pluginsFacadeService: PluginFacadeService,
    private cd: ChangeDetectorRef,
    private pluginsEventService: PluginsEventService,
    private multipleAccountsHelperService: MultipleAccountsConnectionHelperService
  ) { }

  ngAfterViewInit(): void {
    this.allFormsComponentQueryList.changes.subscribe((comps: QueryList<AllPluginConnectionFormsComponent>) => {
      this.allFormsComponentRef = comps.first;
      this.cd.detectChanges();
    });
    this.allFormsComponentQueryList.notifyOnChanges();
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if ('service' in changes && this.service) {
      this.onChangesDetacher.detach(false);
      if (changes['service'].firstChange) {
        this.setLogsListenerForCurrentSelectedInstance();
      }

      this.pluginConnectionFacadeService.getCurrentSelectedInstance(this.service).pipe(this.onChangesDetacher.takeUntilDetach()).subscribe((instance) => {
        this.currentSelectedInstance = instance;
      });

      this.setUtilizeAfterLeavingAFormConnectionFormState();
      this.pluginInstancesMetaDataCalculation();
      this.resolveInitialFormMode();
    }
  }

  ngOnDestroy(): void {
    this.detacher.detach();
    this.onChangesDetacher.detach();
    if (
      this.service &&
      this.allFormsComponentRef &&
      this.mode === FormModes.INITIAL &&
      this.currentSelectedInstance?.instance_id
    ) {
      this.pluginConnectionFacadeService.saveConnectionFormValuesIfPossible(
        this.service,
        this.currentSelectedInstance.instance_id,
        this.allFormsComponentRef.getAllFormValues(TakeDynamicFormValues.ALL_VALUES)
      );
    }
  }

  buildTranslationKey(relativeKey: string): string {
    return `openedPlugin.${relativeKey}`;
  }

  editForm(): void {
    this.pluginsEventService.trackEditPluginClick(this.service);
    this.allFormsComponentRef.enableAllForms();
    this.switchFormMode(FormModes.ON_EDIT);
  }

  cancelEditForm(): void {
    this.pluginsEventService.trackCancelEditPluginClick(this.service);
    this.allFormsComponentRef.disableAllForms();
    this.switchFormMode(FormModes.EDITABLE);
    this.cd.detectChanges();
  }

  resolveConnectButtonTextTranslationKey(): string {
    let resultKey: string;
    if (this.service.service_multi_account) {
      if (this.pendingInstancesCount <= 1) {
        resultKey = "connectAccountsButtonText";
      } else {
        resultKey = "connectAccountsButtonTextWithCount";
      }
    } else {
      resultKey = "connectPluginButtonText";
    }

    return this.buildTranslationKey(resultKey);
  }

  connectPluginButtonClick(): void {
    //Restrict user click handler also
    if (this.isConnectButtonDisabled()) {
      return;
    }

    if (this.service.service_multi_account && ServiceNotInstalledStatuses.some((v) => v === this.service.service_status) && this.pendingInstancesCount <= 1) {
      this.multipleAccountsHelperService.openAddAnotherAccountSuggestModal(this.resolveGenericInstallationProcess.bind(this), this.addAnotherAccountClick.bind(this));
    } else if (this.service.service_multi_account && this.pendingInstancesCount > 1) {
      const currAccountName = this.allFormsComponentRef.getMultipleAccountsFormValues(TakeDynamicFormValues.ALL_VALUES)[MultipleAccountsFieldsEnum.AccountName];
      // Acts like a movements with Set
      const savedAccountsAndCurrent = [...this.pendingInstancesNames.filter((name) => name !== currAccountName), currAccountName];
      this.multipleAccountsHelperService.openConnectAccountsConfirmationModal(savedAccountsAndCurrent, this.resolveGenericInstallationProcess.bind(this));
    } else {
      this.resolveGenericInstallationProcess();
    }
  }

  async resolveGenericInstallationProcess(): Promise<void> {
    let selectedInstance = this.service;
    this.pluginsEventService.trackConnectPluginClick(this.service);
    if (this.service.service_instances_list.some((i) => i.service_instance_id === this.currentSelectedInstance.instance_id)) {
      selectedInstance = await this.pluginsFacadeService
        .getServiceInstance(this.service.service_id, this.currentSelectedInstance.instance_id)
        .pipe(take(1))
        .toPromise();
    } else {
      this.installClick();
      return;
    }
    if (isPluginInstallationFlow(selectedInstance)) {
      this.installClick();
    } else {
      this.reconnectClick();
    }
  }

  resolveReconnectProcess(): void {
    this.pluginsEventService.trackReconnectPluginClick(
      this.service,
      this.allFormsComponentRef.getDynamicFormValues(TakeDynamicFormValues.DIRTY_VALUES)
    );
    this.reconnectClick();
  }

  async clearFormClick(): Promise<void> {
    const params = await this.pluginConnectionFacadeService.getFilledServiceParameters(this.service, this.allFormsComponentRef.getAllFormValues(TakeDynamicFormValues.ALL_VALUES));
    this.pluginConnectionFacadeService.saveConnectionFormValuesIfPossible(this.service, this.currentSelectedInstance.instance_id, params);
    this.pluginConnectionFacadeService.setState(this.service.service_id, PluginConnectionStates.ClearForm);
  }

  installClick(): void {
    this.install.emit({
      allValues: this.allFormsComponentRef.getAllFormValues(TakeDynamicFormValues.ALL_VALUES),
      dirtyValues: this.allFormsComponentRef.getAllFormValues(TakeDynamicFormValues.DIRTY_VALUES),
    });
  }

  reconnectClick(): void {
    this.reconnect.emit({
      allValues: this.allFormsComponentRef.getAllFormValues(TakeDynamicFormValues.ALL_VALUES),
      dirtyValues: this.allFormsComponentRef.getAllFormValues(TakeDynamicFormValues.DIRTY_VALUES),
    });
  }

  stateCloseClickHandler(): void {
    // 
    // this.mode = undefined;
    const allValues = this.allFormsComponentRef.InitialFormValues;
    const dirty = this.allFormsComponentRef.getAllFormValues(TakeDynamicFormValues.DIRTY_VALUES);
    let showConfirmationModal: boolean;
    Object.keys(dirty).forEach((dirtyValuesKey) => {
      if (!dirty[dirtyValuesKey]?.lenght) {
        dirty[dirtyValuesKey] = null;
      }
      if (allValues[dirtyValuesKey] !== dirty[dirtyValuesKey]) {
        showConfirmationModal = true;
        return;
      }

    });

    const isServiceInstanceAlreadyExists = !!this.service.service_instances_list.find((s) => s.service_instance_id === this.currentSelectedInstance.instance_id);

    this.multipleAccountsHelperService.closeSelectedAccount(this.service, showConfirmationModal || (!isServiceInstanceAlreadyExists && !!Object.values(allValues)?.some((v) => !!v)));
  }

  isConnectButtonDisabled(): boolean {
    return this.allFormsComponentRef?.AllFormsInvalid || this.getCountOfNotRemovedServiceInstancesOfService() > maxNumberOfServiceAccountsAllowed;
  }

  getCountOfNotRemovedServiceInstancesOfService(): number {
    return this.pendingInstancesCount + this.service?.service_instances_list?.filter((r) => r.service_status !== ServiceStatusEnum.REMOVED).length;
  }

  async addAnotherAccountClick(): Promise<void> {
    await this.pluginConnectionFacadeService.saveConnectionFormValuesIfPossible(
      this.service,
      this.currentSelectedInstance.instance_id,
      this.allFormsComponentRef.getAllFormValues(TakeDynamicFormValues.ALL_VALUES)
    );
    this.pluginConnectionFacadeService.addEmptyServiceInstance(this.service);
    await this.displaySuccessAnimation();
  }

  allFormsCreatedHandler(): void {
    this.resolveInitialFormMode();
    this.resolveButtonDisabler();
    this.cd.detectChanges();
  }

  private async displaySuccessAnimation(): Promise<void> {
    this.showSuccessAnimation.next(true);
    await delayedPromise(700);
    this.showSuccessAnimation.next(false);
  }

  private async resolveInitialFormMode(): Promise<void> {
    let selectedServiceInstance: Service;
    if (
      this.service.service_instances_list?.find(
        (i) => i.service_instance_id === this.currentSelectedInstance.instance_id
      )
    ) {
      selectedServiceInstance = await this.pluginsFacadeService
        .getServiceInstance(this.service.service_id, this.currentSelectedInstance.instance_id)
        .pipe(take(1))
        .toPromise();
    }

    if (
      selectedServiceInstance?.service_status === ServiceStatusEnum.INSTALLED ||
      this.currentSelectedInstance.instance_state === ConnectionFormInstanceStatesEnum.EXISTING
    ) {
      if (this.service.service_multi_account) {
        this.editForm();
      }
      if (this.mode !== FormModes.ON_EDIT) {
        this.allFormsComponentRef?.disableAllForms();
        this.switchFormMode(FormModes.EDITABLE);
      }
    } else {
      this.allFormsComponentRef?.enableAllForms();
      this.switchFormMode(FormModes.INITIAL);
    }
  }

  switchFormMode(formMode: FormModes): void {
    this.mode = formMode;
    this.cd.detectChanges();
  }

  private setUtilizeAfterLeavingAFormConnectionFormState(): void {
    // Setting this.mode to undefined is required, this way we clean the state as ngOnDestroy doesnt work durring to switching components with switcher.
    this.pluginConnectionFacadeService.getPluginConnectionEntity(this.service).pipe(
      this.onChangesDetacher.takeUntilDetach(),
      filter((serviceEntity) => !!serviceEntity),
      map((v) => v.connection_state),
      distinctUntilChanged((prev, curr) => prev === curr)
    ).subscribe((_) => {
      this.mode = undefined;
    });
  }

  private pluginInstancesMetaDataCalculation(): void {
    this.pluginConnectionFacadeService
      .getPluginConnectionEntity(this.service)
      .pipe(
        map(
          (pluginConnectionEntity) =>
            Object.values(pluginConnectionEntity.instances_form_values)?.filter(
              (connectionFormInstanceStatesEnum) => connectionFormInstanceStatesEnum.instance_state === ConnectionFormInstanceStatesEnum.PENDING
            )
        ),
        this.onChangesDetacher.takeUntilDetach()
      )
      .subscribe((instances) => {
        this.pendingInstancesCount = instances.length;
        this.pendingInstancesNames = instances.map((i) => i.connection_form_values[MultipleAccountsFieldsEnum.AccountName]).filter((v) => !!v);
      });
  }

  private setLogsListenerForCurrentSelectedInstance(): void {
    this.connectivityFailure$ = this.pluginConnectionFacadeService.getCurrentSelectedInstance(this.service).pipe(switchMap((selectedInstance) => {
      if(!selectedInstance) {
        return of(null);
      }
      return this.pluginsFacadeService
        .getLogsOrderedByDate(this.service.service_id, selectedInstance.instance_id, null, 'dsc')
        .pipe(
          map((x) => {
            if (!!x?.length && x[0].severity === ServiceLogTypeEnum.ERROR) {
              return x[0].message;
            } return null;
          })
        );
    }));
  }

  private resolveButtonDisabler(): void {
    if (this.service.service_is_onprem) {
      this.isClearButtonDisabled$ = combineLatest([
        this.allFormsComponentRef?.isDynamicFormClean$,
        this.allFormsComponentRef?.isOnpremFormClean$,
      ]).pipe(map((value) => value[0] && value[1]));
    } else {
      this.isClearButtonDisabled$ = this.allFormsComponentRef?.isDynamicFormClean$;
    }
  }
}
