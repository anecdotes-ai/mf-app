import { MultipleAccountsFieldsEnum } from './../../../models/multiple-accounts-fields.enum';
import { Dictionary } from '@ngrx/entity';
import { UserEventService } from 'core/services/user-event/user-event.service';
import { PluginFacadeService } from 'core/modules/data/services/facades/plugin-facade/plugin-facade.service';
import { CollectionResult } from 'core/models/collection-result.model';
import {
  DisableServiceAction,
  ReconnectServiceAction,
  ServiceCreateTaskAction,
} from 'core/modules/data/store/actions/services.actions';
import { TrackOperations } from 'core/modules/data/services/operations-tracker/constants/track.operations.list.constant';
import { PluginConnectionAdapterActions } from './../../../store/actions/plugin-connection.actions';
import { PluginConnectionStates } from './../../../models/plugin-connection-states.enum';
import { ActionDispatcherService } from 'core/modules/data/services/action-dispatcher/action-dispatcher.service';
import { Service, ServiceStatusEnum, ServiceTypeEnum, ServiceAuthTypeEnum, ParamTypeEnum } from 'core/modules/data/models/domain';
import { SupportedServiceTypes } from 'core/constants/supported-services-connectivity-notification';
import { PluginNotificationSenderService } from 'core/services/plugin-notification-sender/plugin-notification-sender.service';
import { ConnectivityResult } from 'core/models/connectivity-result.model';
import {
  ConnectionFormInstanceStatesEnum,
  ConnectionFormValueEntity,
  PerformedOperationData,
  PluginConnectionEntity,
  RelatedOperationPusherData,
} from './../../../store/models/state-entity.model';
import { Injectable } from '@angular/core';
import { NEVER, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, map, take, switchMap, filter } from 'rxjs/operators';
import { pluginConnectionStateSelector, PluginsConnectionState } from '../../../store';
import { InstallServiceAction, ServiceUpdated } from 'core/modules/data/store';
import { PluginsDataService } from '../../plugins-data-service/plugins.data.service';
import { PusherMessageType } from 'core/models';
import { PluginsEventService } from 'core/modules/plugins-connection/services/plugins-event-service/plugins-event.service';
import { TunnelConnectivityResult } from 'core/models/tunnel-connectivity-result';
import { extractOnPremFields, extractMultipleAccountFields } from 'core/utils';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PluginConnectionFacadeService {
  connectivityHandlingDone = new Set<string>();
  collectionHandlingDone = new Set<string>();

  constructor(
    private store: Store<PluginsConnectionState>,
    private pluginNotificationSenderService: PluginNotificationSenderService,
    private actionDispatcher: ActionDispatcherService,
    private pluginDataService: PluginsDataService,
    private pluginsFacade: PluginFacadeService,
    private userEventService: UserEventService,
    private pluginsEventService: PluginsEventService
  ) { }

  async addEmptyServiceInstance(service: Service): Promise<void> {
    const resolvedState =
      this.isServiceWithDynamicFormConnectionFlow(service) ?? PluginConnectionStates.OAUTHConnection;

    const temporalInstanceId: string = uuidv4();

    this.store.dispatch(
      PluginConnectionAdapterActions.addServiceInstance({
        service_id: service.service_id,
        instance_id: temporalInstanceId,
        instance_state: ConnectionFormInstanceStatesEnum.PENDING,
        formValues: this.buildServiceParamsByPriority(service),
        selected: true,
      })
    );

    this.changeConnectionStateOnly(service.service_id, resolvedState);
  }

  removeServiceInstance(service_id: string, service_instance_id: string): void {
    this.store.dispatch(
      PluginConnectionAdapterActions.removeServiceInstance({
        service_id,
        instance_id: service_instance_id,
      })
    );
  }

  async selectServiceInstance(service_id: string, service_instance_id: string): Promise<void> {
    const service = await this.pluginsFacade.getServiceById(service_id).pipe(take(1)).toPromise();
    const currEntity = await this.getPluginConnectionEntity(service).pipe(take(1)).toPromise();
    this.store.dispatch(
      PluginConnectionAdapterActions.changeConnectionState({
        stateToChange: {
          service_id: currEntity.service_id,
          connection_state: currEntity.connection_state,
          selected_service_instance_id: service_instance_id,
        },
      })
    );
  }

  getPluginConnectionEntity(service: Service): Observable<PluginConnectionEntity> {
    return this.store.select(pluginConnectionStateSelector).pipe(
      switchMap((featureState) => {
        if ((!featureState.entities || !featureState.entities[service.service_id]) && !this.initEntity) {
          this.setInitialState(service);
          return NEVER;
        }

        return this.store.select(pluginConnectionStateSelector).pipe(map((s) => s.entities[service.service_id]), filter((v) => !!v));
      })
    );
  }

  async openEditServiceInstance(service_id: string, service_instance_id: string): Promise<void> {
    const isLogsLoaded = await this.pluginsFacade.areLogsLoadedForPlugin(service_id, service_instance_id).pipe(take(1)).toPromise();
    if (!isLogsLoaded) {
      this.pluginsFacade.loadSpecificServiceLogs(service_id, service_instance_id);
    }
    await this.loadServiceConnectionInstance(service_id, service_instance_id, true);
    const plugin = await this.pluginsFacade.loadSpecificPlugin(service_id).pipe(take(1)).toPromise();
    this.changeConnectionStateOnly(
      service_id,
      this.isServiceWithDynamicFormConnectionFlow(plugin) ?? PluginConnectionStates.OAUTHConnection
    );
  }

  getCurrentSelectedInstance(service: Service): Observable<ConnectionFormValueEntity> {
    return this.getPluginConnectionEntity(service).pipe(
      distinctUntilChanged((prev, curr) => prev?.selected_service_instance_id === curr?.selected_service_instance_id),
      map((v) => {
        const objectOfSelectedInstance = v.instances_form_values[v.selected_service_instance_id];
        return objectOfSelectedInstance
          ? objectOfSelectedInstance
          : ({ instance_id: v.selected_service_instance_id } as ConnectionFormValueEntity);
      })
    );
  }

  async clearConnectionForm(service: Service, service_instance_id?: string): Promise<void> {
    // If service_instance_id is not provided, we use current selected instance
    if (!service_instance_id) {
      service_instance_id = (await this.getCurrentSelectedInstance(service).pipe(take(1)).toPromise()).instance_id;
    }
    await this.saveConnectionFormValuesIfPossible(service, service_instance_id, {});
    await this.changeConnectionStateOnly(service.service_id, this.getInitialConnectionState(service));
  }

  async disconnectPlugin(service_id: string, service_instance?: string): Promise<void> {
    let service = await this.pluginsFacade.getServiceById(service_id).pipe(take(1)).toPromise();

    // If no service intances was provided we try to additionally fetch the selected service account from connectionService entity
    if (!service_instance) {
      service_instance = (await this.getCurrentSelectedInstance(service).pipe(take(1)).toPromise()).instance_id;
    }

    // If there is no service_instance selected id, assume there is delete operation for whole plugin
    if (service_instance) {
      // Remove only selected service instance from store (NOT API CALL)
      this.removeServiceInstance(service.service_id, service_instance);
    } else {
      // Remove all service instances of the plugin from store (NOT API CALL)
      service.service_instances_list.filter((s) => s.service_status !== ServiceStatusEnum.REMOVED && !!s.service_status).forEach((notRemovedInstances) => {
        this.removeServiceInstance(service.service_id, notRemovedInstances.service_instance_id);
      });
    }

    // Refetch the plugin from store after all soft removes removes, it is needed to obtain correct initial state.
    service = await this.pluginsFacade.getServiceById(service_id).pipe(take(1)).toPromise();
    this.setInitialState(service);

    try {
      service = await this.disconnectPluginAction(service, service_instance);
      this.pluginsEventService.trackDisconnectPluginClick(service);
    } catch (e) {
      // If disable is failed, we change state back to installed
      await this.changeConnectionStateOnly(service.service_id, this.resolveServiceInstalledState(service));
    }
  }

  runOnDemand(service: Service): void {
    this.pluginsEventService.trackRunOnDemandClick(service);
    this.connectionProcessWrapper(
      service,
      null,
      async () => {
        await this.actionDispatcher.dispatchActionAsync(
          new ServiceCreateTaskAction(service.service_id),
          TrackOperations.RUNNING_ON_DEMAND,
          service.service_id
        );
      },
      service.service_id
    );
  }

  async reconnectPlugin(service: Service, secrets: { [key: string]: any }, instance_id?: string): Promise<void> {
    // In case if it's OAUTH plugin, it's also ok, as this type of services don't have form the operations will be resolved also correctly
    if (!instance_id) {
      instance_id = (await this.getCurrentSelectedInstance(service).pipe(take(1)).toPromise()).instance_id;
    }

    if (this.isServiceOAUTHTyped(service)) {
      return this.forceReinstallPlugin(service, secrets, instance_id);
    }

    const serviceInstance = await this.pluginsFacade
      .getServiceInstance(service.service_id, instance_id)
      .pipe(take(1))
      .toPromise();
    const resolvedOperations = this.pluginDataService.resolveReconnectOperations(
      await this.getFilledServiceParameters(serviceInstance, serviceInstance.service_parameters),
      secrets
    );
    this.connectionProcessWrapper(
      service,
      secrets,
      async (resolvedInstanceId) => {
        await this.actionDispatcher.dispatchActionAsync(
          new ReconnectServiceAction({
            service_id: service.service_id,
            service_intance_id: resolvedInstanceId,
            service_secrets_operations: resolvedOperations,
            raw_service_secrets: secrets,
          }),
          TrackOperations.RECONNECT_PLUGIN,
          service.service_id
        );
      },
      instance_id
    );
  }

  async connectPlugin(service: Service, secrets: { [key: string]: any }, instance_id?: string): Promise<void> {
    this.connectionProcessWrapper(
      service,
      secrets,
      async () => {
        await this.connectPluginAction(service);
      },
      instance_id
    );
  }

  private async connectPluginAction(service: Service): Promise<any> {
    return await this.actionDispatcher.dispatchActionAsync(
      new InstallServiceAction({
        service_id: service.service_id,
      }),
      TrackOperations.INSTALL_PLUGIN,
      service.service_id
    );
  }

  private async disconnectPluginAction(service: Service, instance_id: string): Promise<any> {
    return await this.actionDispatcher.dispatchActionAsync(
      new DisableServiceAction(service, instance_id),
      service.service_id,
      TrackOperations.DISCONNECT_PLUGIN
    );
  }

  private forceReinstallPlugin(service: Service, secrets: { [key: string]: any }, instance_id: string): Promise<void> {
    return this.connectionProcessWrapper(
      service,
      secrets,
      async () => {
        await this.disconnectPluginAction(service, instance_id);
        await this.connectPluginAction(service);
      },
      instance_id
    );
  }

  private async getCurrentPerformedOperation(service_id: string): Promise<{ operation: PerformedOperationData, relatedPushersForOperation: RelatedOperationPusherData[], service: Service, collected_evidence: number }> {
    const service = await this.pluginsFacade.getServiceById(service_id).pipe(take(1)).toPromise();
    return this.getPluginConnectionEntity(service).pipe(
      distinctUntilChanged((prev, curr) => prev?.selected_service_instance_id === curr?.selected_service_instance_id),
      map((v) => ({ operation: v.performedOperation, relatedPushersForOperation: v.performedOperationPushersReceivedMetadata, service: service, collected_evidence: v.evidence_successfully_collected })
      ), take(1)
    ).toPromise();
  }

  private performedOperationFinish(service_id: string): void {
    this.store.dispatch(PluginConnectionAdapterActions.resetConnectionOperationData({ service_id }));
    this.connectivityHandlingDone.delete(service_id);
    this.collectionHandlingDone.delete(service_id);
  }

  /* Handle pusher messages related to plugin connection */

  private setPusherOperationData(service_id: string, performedOperationData?: RelatedOperationPusherData,
    collected_evidence?: number): void {
    this.store.dispatch(PluginConnectionAdapterActions.setPusherOpeartionConnectionData({ service_id, performedOperationPushersReceivedMetadata: performedOperationData, evidence_successfully_collected: collected_evidence }));
  }

  private async allowHandlingCollectionResult(collectionResultObject: CollectionResult): Promise<boolean> {
    this.setPusherOperationData(collectionResultObject.service_id, { status: collectionResultObject.status, pusherType: PusherMessageType.Collection }, collectionResultObject.collected_evidence);
    if (!this.collectionHandlingDone.has(collectionResultObject.service_id)) {
      const currOperation = await this.getCurrentPerformedOperation(collectionResultObject.service_id);
      const amountOfSuccessfullyConnectedPluginsDurringOperation = currOperation?.relatedPushersForOperation?.filter((rp) => rp.pusherType === PusherMessageType.Connectivity).filter((rp) => rp.status).length;
      const alreadyReceivedCollectionPushers = currOperation.relatedPushersForOperation?.filter((o) => o.pusherType === PusherMessageType.Collection);
      const receivedCollectionPushersCount = alreadyReceivedCollectionPushers.length;
      if (currOperation?.operation
        && (amountOfSuccessfullyConnectedPluginsDurringOperation === receivedCollectionPushersCount)) {
        this.collectionHandlingDone.add(collectionResultObject.service_id);
        return true;
      }
    }

    return false;
  }

  async handlePluginCollectionResult(collectionResultObject: CollectionResult): Promise<void> {
    if (!collectionResultObject?.service_id) return;
    const allowHandling = await this.allowHandlingCollectionResult(collectionResultObject);
    if (!allowHandling) return;

    await this.pluginsFacade.loadSpecificPluginAsync(collectionResultObject.service_id);

    collectionResultObject.status
      ? await this.setCollectionSuccessState(collectionResultObject)
      : this.setCollectionFailedState(collectionResultObject);

    this.performedOperationFinish(collectionResultObject.service_id);
  }

  async handlePluginConnectivityResult(connectivityResultObject: ConnectivityResult): Promise<void> {
    if (!connectivityResultObject?.service_id) {
      return;
    }
    const allowHandling = await this.allowHandlingConnectivityResult(connectivityResultObject);
    if (!allowHandling) return;

    const isSuccessfullConnectivity = connectivityResultObject.status === true;
    const isConnectivityFailed = connectivityResultObject.status === false;
    const isConnectivityStatusUnknown = connectivityResultObject.status === null;

    if (!isSuccessfullConnectivity) {
      await this.pluginsFacade.loadSpecificPluginAsync(connectivityResultObject?.service_id);
    }

    if (isConnectivityFailed) {
      this.setConnectivityFailedState(connectivityResultObject);
    } else if (isConnectivityStatusUnknown) {
      this.setConnectivityStatusUnknownState(connectivityResultObject);
    } else if (isSuccessfullConnectivity && SupportedServiceTypes.includes(connectivityResultObject.service_type)) {
      this.setConnectivitySuccessfullState(connectivityResultObject);
    }

    // Right after the connectivity is allowed to be handeled, we set the service status.
    this.store.dispatch(new ServiceUpdated({ service_id: connectivityResultObject?.service_id, service_status: (isConnectivityFailed || isConnectivityStatusUnknown) ? ServiceStatusEnum.CONNECTIVITYFAILED : ServiceStatusEnum.INSTALLED }));

    const isConnectivityLastOperationForService = this.pluginsFacade.getServiceById(connectivityResultObject?.service_id).pipe(map((s) => s.service_type === ServiceTypeEnum.FILEMONITOR), take(1)).toPromise();
    if (!isSuccessfullConnectivity || await isConnectivityLastOperationForService) {
      this.performedOperationFinish(connectivityResultObject?.service_id);
    }
  }

  private async allowHandlingConnectivityResult(connectivityResultObject: ConnectivityResult): Promise<boolean> {
    this.setPusherOperationData(connectivityResultObject.service_id, { status: connectivityResultObject.status, pusherType: PusherMessageType.Connectivity });
    if (!this.connectivityHandlingDone.has(connectivityResultObject.service_id)) {
      const currOperation = await this.getCurrentPerformedOperation(connectivityResultObject.service_id);
      const alreadyReceivedConnectivityPushers = currOperation.relatedPushersForOperation?.filter((o) => o.pusherType === PusherMessageType.Connectivity);
      const receivedConnectivityPushersCount = alreadyReceivedConnectivityPushers?.length;
      if (currOperation?.operation && (currOperation?.operation?.operationOnServiceInstancesAmount === receivedConnectivityPushersCount || connectivityResultObject.status === true)) {
        this.connectivityHandlingDone.add(connectivityResultObject.service_id);
        return true;
      }
    }
    return false;
  }

  handleTunnelConnectivityResult(tunnelConnectivityResultObject: TunnelConnectivityResult): void {
    const isTunnelSuccessfulConnectivity = tunnelConnectivityResultObject.status === true;
    const isTunnelConnectivityFailed = tunnelConnectivityResultObject.status === false;
    if (isTunnelSuccessfulConnectivity) {
      this.changeConnectionStateOnly(
        tunnelConnectivityResultObject.service_id,
        PluginConnectionStates.TestConnectionAfterTunnelIsUp
      );
    } else if (isTunnelConnectivityFailed) {
      this.changeConnectionStateOnly(
        tunnelConnectivityResultObject.service_id,
        PluginConnectionStates.WaitingForTunnelFailed
      );
      this.pluginNotificationSenderService.sendTunnelFailedNotification({
        service_id: tunnelConnectivityResultObject.service_id,
        service_display_name: tunnelConnectivityResultObject.service_display_name,
        service_type: tunnelConnectivityResultObject.service_type,
      });
    }
  }

  private async saveAllConnectionValuesAsAFormValues(
    service: Service,
    service_instance_id: string,
    form_values: { [key: string]: any },
    instance_form_state?: ConnectionFormInstanceStatesEnum
  ): Promise<void> {
    if (form_values) {
      this.store.dispatch(
        PluginConnectionAdapterActions.saveConnectionFormValues({
          service_id: service.service_id,
          formValues: await this.getFilledServiceParameters(service, form_values),
          instance_state: instance_form_state,
          instance_id: service_instance_id,
        })
      );
    }
  }

  async saveConnectionFormValuesIfPossible(
    service: Service,
    service_instance_id: string,
    form_values: { [key: string]: any },
    instance_form_state?: ConnectionFormInstanceStatesEnum
  ): Promise<void> {
    if (this.isServiceWithDynamicFormConnectionFlow(service) && form_values) {
      this.store.dispatch(
        PluginConnectionAdapterActions.saveConnectionFormValues({
          service_id: service.service_id,
          formValues: await this.getFilledServiceParameters(service, form_values),
          instance_state: instance_form_state,
          instance_id: service_instance_id,
        })
      );
    }
  }

  changeConnectionFormStateIfPossible(
    service: Service,
    instance_id: string,
    instance_state: ConnectionFormInstanceStatesEnum
  ): void {
    if (this.isServiceWithDynamicFormConnectionFlow(service)) {
      this.store.dispatch(
        PluginConnectionAdapterActions.changeConnectionFormState({
          service_id: service.service_id,
          instance_id,
          instance_state,
        })
      );
    }
  }

  setState(service_id: string, state: PluginConnectionStates): void {
    const connectionStateEntity: PluginConnectionEntity = {
      service_id: service_id,
      connection_state: state,
    };

    this.store.dispatch(PluginConnectionAdapterActions.changeConnectionState({ stateToChange: connectionStateEntity }));
  }

  private initEntity: boolean;
  async setInitialState(service: Service): Promise<void> {
    this.initEntity = true;
    let resultState: PluginConnectionStates;
    switch (service.service_status) {
      case ServiceStatusEnum.INSTALLED: {
        resultState = this.resolveServiceInstalledState(service);
        break;
      }
      /*
       As I remember, in case when the plugin was never installed before, service_status is not setteled so we assume it as initial (clear) state should be applied.
       Also we handle CONNECTIVITYFAILED and INSTALLATIONFAILED as default empty states in this functional context (as we take initial state for service)
       CONNECTIVITYFAILED and INSTALLATIONFAILED are handeled by pusher message received.
       As for status REMOVED: we handle it as default initial connection state
       Statuses: FETCHED and INSTALLING has no required handling, so we handle it as default initial connection state
       */
      default: {
        resultState = this.getInitialConnectionState(service);
        break;
      }
    }

    const connectionStateEntity: PluginConnectionEntity = await this.resolveInitialConnectionStateEntity(
      service,
      resultState
    );
    this.store.dispatch(PluginConnectionAdapterActions.changeConnectionState({ stateToChange: connectionStateEntity }));
    this.initEntity = false;
  }

  /* Private methods */

  private async resolveInitialConnectionStateEntity(
    service: Service,
    resultViewState: PluginConnectionStates
  ): Promise<PluginConnectionEntity> {
    const instances_form_values: Dictionary<ConnectionFormValueEntity> = {};
    let selectedInstanceId: string;
    if (!service.service_multi_account) {
      if (service.service_instances_list && Object.values(service.service_instances_list).length) {
        selectedInstanceId = Object.values(service.service_instances_list)[0].service_instance_id;
        // Seems like it can be refactored to be done VIA effects when specific service instance fetches
        const res = await this.pluginsFacade
          .getServiceInstance(service.service_id, selectedInstanceId)
          .pipe(take(1))
          .toPromise();
        instances_form_values[selectedInstanceId] = {
          connection_form_values: res?.service_status === ServiceStatusEnum.REMOVED || !res?.service_status ? {} : await this.getFilledServiceParameters(res, this.buildServiceParamsByPriority(res)),
          instance_state:
            res?.service_status === ServiceStatusEnum.INSTALLED
              ? ConnectionFormInstanceStatesEnum.EXISTING
              : ConnectionFormInstanceStatesEnum.PENDING,
          instance_id: selectedInstanceId,
        };
      } else {
        selectedInstanceId = service.service_id;
        instances_form_values[service.service_id] = {
          connection_form_values: await this.getFilledServiceParameters(service, this.buildServiceParamsByPriority(service)),
          instance_state:
            service?.service_status === ServiceStatusEnum.INSTALLED
              ? ConnectionFormInstanceStatesEnum.EXISTING
              : ConnectionFormInstanceStatesEnum.PENDING,
          instance_id: service.service_id,
        };
      }
    }
    else if (!service.service_instances_list?.filter((s) => s.service_status !== ServiceStatusEnum.REMOVED)?.length) {
      selectedInstanceId = uuidv4();
      instances_form_values[selectedInstanceId] = {
        connection_form_values: await this.getFilledServiceParameters(service, this.buildServiceParamsByPriority(service), selectedInstanceId),
        instance_state: ConnectionFormInstanceStatesEnum.PENDING,
        instance_id: selectedInstanceId,
      };
    }

    return {
      service_id: service.service_id,
      connection_state: resultViewState,
      instances_form_values,
      selected_service_instance_id: selectedInstanceId,
    };
  }

  private buildServiceParamsByPriority(service: Service): { [key: string]: any } {
    const result = {};

    service.service_fields?.forEach((field) => {
      if(field.field_value) {
        result[field.field_name] = field.field_value;
      } else if (service?.service_parameters && service.service_parameters[field.field_name]) {
        result[field.field_name] = service.service_parameters[field.field_name];
      } else {
        result[field.field_name] = null;
      }
    });

    return result;
  }

  private showConnectivityInProgressNotification(service: Service): void {
    if (SupportedServiceTypes.includes(service.service_type)) {
      this.pluginNotificationSenderService.sendConnectionStartedNotification({
        service_id: service.service_id,
        service_display_name: service.service_display_name,
        service_type: service.service_type,
      });
    }
  }

  private async connectionProcessWrapper(
    service: Service,
    secrets: { [key: string]: any },

    actionWrapper: (resolvedInstanceId: string) => Promise<void>,
    instance_id?: string
  ): Promise<void> {
    this.showConnectivityInProgressNotification(service);
    const currentConnectionStateId = await this.getPluginConnectionEntity(service)
      .pipe(
        take(1),
        map((e) => e.selected_service_instance_id)
      )
      .toPromise();

    try {
      const resolvedInstanceId = instance_id ?? currentConnectionStateId;
      await this.saveAllConnectionValuesAsAFormValues(
        service,
        resolvedInstanceId,
        secrets,
        ConnectionFormInstanceStatesEnum.PENDING
      );

      if (service.service_is_onprem) {
        this.changeConnectionStateOnly(service.service_id, PluginConnectionStates.WaitingForTunnel);
      } else {
        this.changeConnectionStateOnly(service.service_id, PluginConnectionStates.TestConnection);
      }
      await actionWrapper(resolvedInstanceId);
      this.changeConnectionFormStateIfPossible(service, service.service_id, ConnectionFormInstanceStatesEnum.EXISTING);
    } catch (error) {
      await this.changeConnectionStateOnly(service.service_id, PluginConnectionStates.ErrorConnection);
    }
  }

  async loadServiceConnectionInstance(
    service_id: string,
    service_instance_id: string,
    selected?: boolean
  ): Promise<Service> {
    const selectedInstance = await this.pluginsFacade
      .getServiceInstance(service_id, service_instance_id)
      .pipe(take(1))
      .toPromise();
    this.store.dispatch(
      PluginConnectionAdapterActions.serviceInstanceToServiceConnection({ serviceInstance: selectedInstance, selected })
    );

    return selectedInstance;
  }

  private async changeConnectionStateOnly(
    service_id: string,
    state: PluginConnectionStates,
  ): Promise<void> {
    const connectionStateEntity: PluginConnectionEntity = {
      service_id: service_id,
      connection_state: state,
    };

    this.store.dispatch(PluginConnectionAdapterActions.changeConnectionState({ stateToChange: connectionStateEntity }));
  }

  async getFilledServiceParameters(
    service: Service,
    form_values: { [key: string]: any },
    service_instance_id?: string
  ): Promise<{ [key: string]: any }> {
    // We do this cleanup in case if provided form_values don't fit service fields
    if (!form_values || !Object.keys(form_values).length || !Object.values(form_values).filter(value => !!value).length) {
      return {};
    }
    let defaultServiceFields = service.service_fields.reduce(
      (result, curr) => ({ ...result, [curr.field_name]: form_values[curr.field_name] ?? undefined }),
      {} as { [key: string]: any }
    );

    // Map FILE inputs, This hook made because the File value doesn't sent to us from service_params value
    // As all other field values sends in correct way, so it's a BE issue with it, but solved by this hook on FE side
    const filesFields = service.service_fields?.filter((f) => f.param_type === ParamTypeEnum.FILE);
    filesFields.forEach((f) => {
      // If the value in service_parameters is already File type, we skip it
      if (defaultServiceFields[f.field_name] instanceof File) {
        return;
      }
      else {
        // If the value in service_parameters is not a File type, we fetch this value from service_fields
        defaultServiceFields[f.field_name] = f.field_value ?? '';
      }
    });

    if (service.service_is_onprem) {
      defaultServiceFields = { ...defaultServiceFields, ...extractOnPremFields(form_values) };
    }

    if (service.service_multi_account) {
      let resolvedMultipleAccountValues = extractMultipleAccountFields(form_values);
      if (!resolvedMultipleAccountValues[MultipleAccountsFieldsEnum.AccountName]) {
        const instance_id = service_instance_id ?? (await this.getCurrentSelectedInstance(service).pipe(take(1)).toPromise()).instance_id;
        resolvedMultipleAccountValues[MultipleAccountsFieldsEnum.AccountName] = service.service_instances_list.find(
          (i) => i.service_instance_id === instance_id
        )?.service_instance_display_name;
      }
      defaultServiceFields = { ...defaultServiceFields, ...resolvedMultipleAccountValues };
    }

    if (this.isServiceOAUTHTyped(service)) {
      defaultServiceFields = { ...form_values, ...defaultServiceFields };
    }
    return defaultServiceFields;
  }

  private isServiceOAUTHTyped(service: Service): boolean {
    return service?.service_auth_type === ServiceAuthTypeEnum.OAUTH;
  }

  private isServiceSupportMultipleAccounts(service: Service): PluginConnectionStates | null {
    if (service?.service_multi_account && service?.service_instances_list?.length && service.service_instances_list.filter((s) => s.service_status !== ServiceStatusEnum.REMOVED && !!s.service_status).length) {
      return PluginConnectionStates.AccountsList;
    }
    return null;
  }

  private isServiceWithDynamicFormConnectionFlow(service: Service): PluginConnectionStates | null {
    if (service.service_fields?.length) {
      // We assume if service is OAUTH + fields exists so it's combined connection flow.
      // Combination is in OAUTH logic with redirection + dynamic form connection flow
      if (this.isServiceOAUTHTyped(service)) {
        return PluginConnectionStates.OAUTHWithFormConnection;
      } else {
        return PluginConnectionStates.FormConnection;
      }
    } else {
      return null;
    }
  }

  getInitialConnectionState(service: Service): PluginConnectionStates {
    // Return default form connection states if convenient to this specific service FIRST!
    const multipleAccountsServiceState = this.isServiceSupportMultipleAccounts(service);
    if (multipleAccountsServiceState) {
      return multipleAccountsServiceState;
    }

    const isConnectionStateWithForm = this.isServiceWithDynamicFormConnectionFlow(service);
    if (isConnectionStateWithForm) {
      return isConnectionStateWithForm;
    }

    if (this.isServiceOAUTHTyped(service)) {
      return PluginConnectionStates.OAUTHConnection;
    }
  }

  private resolveServiceInstalledState(service: Service): PluginConnectionStates {
    // Return default form connection states if convenient to this specific service FIRST!
    const multipleAccountsServiceState = this.isServiceSupportMultipleAccounts(service);
    if (multipleAccountsServiceState) {
      return multipleAccountsServiceState;
    }

    const isConnectionStateWithForm = this.isServiceWithDynamicFormConnectionFlow(service);
    if (isConnectionStateWithForm) {
      return isConnectionStateWithForm;
    }

    if (this.isServiceOAUTHTyped(service)) {
      return PluginConnectionStates.OAUTH_EvidenceSuccessfullyCollected;
    }

    switch (service.service_type) {
      case ServiceTypeEnum.FILEMONITOR: {
        return PluginConnectionStates.FileMonitor_PluginSuccessfullyConnected;
      }
      case ServiceTypeEnum.COLLABORATION: {
        return PluginConnectionStates.Collaboration_PluginSuccessfullyConnected;
      }
      default: {
        return PluginConnectionStates.Generic_PluginSuccessfullyConnected;
      }
    }
  }

  private async setCollectionSuccessState(collectionResultObject: CollectionResult): Promise<void> {
    const plugin = await this.pluginsFacade.getServiceById(collectionResultObject.service_id).pipe(take(1)).toPromise();

    // We don't show any collection success information for Filemonitor plugins
    if (plugin.service_type === ServiceTypeEnum.FILEMONITOR) {
      return;
    }

    const currOperation = await this.getCurrentPerformedOperation(collectionResultObject.service_id);
    collectionResultObject.collected_evidence = currOperation.collected_evidence;

    this.pluginNotificationSenderService.sendCollectionSuccessNotification(collectionResultObject);

    if (this.isServiceOAUTHTyped(plugin)) {

      const serviceInstanceObject = await this.pluginsFacade.getServiceInstance(collectionResultObject.service_id, collectionResultObject.service_instance_id).pipe(take(1)).toPromise();
      if (serviceInstanceObject.service_fields?.length) {
        this.setInitialState(plugin);
      } else {
        await this.changeConnectionStateOnly(
          collectionResultObject.service_id,
          PluginConnectionStates.OAUTH_EvidenceSuccessfullyCollected
        );
      }

    } else {
      this.setInitialState(plugin);
    }
  }

  private async setCollectionFailedState(collectionResultObject: CollectionResult): Promise<void> {
    this.pluginNotificationSenderService.sendCollectionFailedNotification(collectionResultObject);
    const plugin = await this.pluginsFacade.getServiceById(collectionResultObject.service_id).pipe(take(1)).toPromise();
    this.setInitialState(plugin);
  }

  private async setConnectivitySuccessfullState(connectivityResultObject: ConnectivityResult): Promise<void> {
    // For File monitoring, there is no needs for collection waiting process, after we receive ConnectivityResult, we assume that plugin is in final connection phase.
    if (connectivityResultObject.service_type === ServiceTypeEnum.FILEMONITOR) {
      this.pluginNotificationSenderService.sendCollectionSuccessNotification({
        service_id: connectivityResultObject.service_id,
        service_name: connectivityResultObject.service_display_name,
      });

      await this.changeConnectionStateOnly(
        connectivityResultObject.service_id,
        PluginConnectionStates.FileMonitor_PluginSuccessfullyConnected
      );
    } else {
      this.pluginNotificationSenderService.sendCollectionStartedNotification({
        service_id: connectivityResultObject.service_id,
        service_name: connectivityResultObject.service_display_name,
      });

      await this.changeConnectionStateOnly(
        connectivityResultObject.service_id,
        PluginConnectionStates.EvidenceCollectionHasStarted
      );
    }
  }

  private setConnectivityStatusUnknownState(connectivityResultObject: ConnectivityResult): void {
    this.pluginNotificationSenderService.sendConnectionStatusUnknownNotification(connectivityResultObject);
  }

  private async setConnectivityFailedState(connectivityResultObject: ConnectivityResult): Promise<void> {
    this.pluginNotificationSenderService.sendConnectionFailedNotification(connectivityResultObject);

    const plugin = await this.pluginsFacade
      .getServiceById(connectivityResultObject.service_id)
      .pipe(take(1))
      .toPromise();
    this.setInitialState(plugin);
  }
}
