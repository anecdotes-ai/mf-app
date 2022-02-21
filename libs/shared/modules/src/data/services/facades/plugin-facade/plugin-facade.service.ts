import { ServiceAdapterActions } from './../../../store/actions/services.actions';
import { TrackOperations } from '../../operations-tracker/constants/track.operations.list.constant';
import { ActionDispatcherService } from './../../action-dispatcher/action-dispatcher.service';
import { OnboardingPluginsIds, OnboardingPolicyPluginsIds } from './../../../constants';
import { Service, ServiceLog, ServiceStatusEnum, ServiceTypeEnum } from '../../../models/domain';
import { selectServiceById, selectServicesAfterInit, selectServicesEntities } from '../../../store/selectors';
import {
  AddToFavouritesAction,
  LoadSpecificServiceAction,
  LoadSpecificServiceInstanceAction,
  RemoveFromFavouritesAction
} from '../../../store/actions';
import { State } from '../../../store/state';
import { NEVER, Observable } from 'rxjs';
import { filter, map, shareReplay, switchMap } from 'rxjs/operators';
import { Dictionary } from '@ngrx/entity';
import { Store } from "@ngrx/store";
import { Injectable } from "@angular/core";

const serviceInstallationIdentifier = new Set([ServiceStatusEnum.INSTALLED, ServiceStatusEnum.INSTALLATIONFAILED, ServiceStatusEnum.CONNECTIVITYFAILED]);

@Injectable()
export class PluginFacadeService {
  constructor(private store: Store<State>, private dispatcher: ActionDispatcherService) { }

  private allServices$: Observable<Service[]>;
  private genericServices$: Observable<Service[]>;
  private fileMonitorServices$: Observable<Service[]>;
  private ticketingServices$: Observable<Service[]>;
  private onboardingPolicyServices$: Observable<Service[]>;

  getAllServices(): Observable<Service[]> {
    if (!this.allServices$) {
      this.allServices$ = this.store.pipe(selectServicesAfterInit, shareReplay());
    }
    return this.allServices$;
  }

  getServiceById(serviceId: string, ensureFullService?: boolean): Observable<Service> {
    if (ensureFullService) {
      return this.loadSpecificPlugin(serviceId);
    }
    return this.store.select(selectServiceById, { serviceId });
  }

  getInstalledAndFailedPlugins(): Observable<Service[]> {
    return this.store
      .select(selectServicesEntities)
      .pipe(map((services) => services.filter((service) => serviceInstallationIdentifier.has(service.service_status))));
  }


  IsFullService(serviceId: string): Observable<boolean> {
    return this.store
      .select((s) => s.servicesState)
      .pipe(
        map((s) => s.entities[serviceId]),
        map((entity) => entity.isFullService)
      );
  }

  getServiceInstance(serviceId: string, service_instance_id: string): Observable<Service> {
    return this.store
      .select((state) => state.servicesState?.entities)
      .pipe(
        map((dictionary) => dictionary[serviceId].fullServiceInstances),
        switchMap((fullInstance) => {
          if (!fullInstance || !fullInstance[service_instance_id]) {
            this.loadServiceInstance(serviceId, service_instance_id);

            return NEVER;
          }
          return this.store
            .select((state) => state.servicesState?.entities)
            .pipe(
              map((dictionary) => dictionary[serviceId].fullServiceInstances),
              filter((fsis) => !!fsis),
              map((fsi) => fsi[service_instance_id])
            );
        })
      );
  }

  async loadServiceInstance(serviceId: string, service_instance_id: string): Promise<Service> {
    return await this.dispatcher.dispatchActionAsync(
      new LoadSpecificServiceInstanceAction(serviceId, service_instance_id),
      TrackOperations.LOAD_SPECIFIC_SERVICE_INSTANCE,
      service_instance_id
    );
  }

  async loadSpecificServiceLogs(service_id: string, service_instance_id: string): Promise<void> {
    await this.dispatcher.dispatchActionAsync(
      ServiceAdapterActions.loadServiceInstanceLogs({ service_id, service_instance_id }),
      TrackOperations.LOAD_SPECIFIC_SERVICE_INSTANCE_LOGS,
      service_instance_id
    );
  }

  loadSpecificPlugin(serviceId: string, forceReload?: boolean): Observable<Service> {
    return this.store
      .select((state) => state.servicesState?.entities)
      .pipe(
        map((directive) => directive[serviceId]),
        switchMap((service) => {
          // We can follow next logic. As GET all plugins return us partial plugins, there is no service_auth_type value there
          // But when loading specific plugin, it returns us full entity with this value
          if (!service?.isFullService || forceReload) {
            this.store.dispatch(new LoadSpecificServiceAction({ service_id: serviceId }));
            return NEVER;
          }
          return this.store.select(selectServiceById, { serviceId });
        })
      );
  }

  async loadSpecificPluginAsync(serviceId: string): Promise<Service> {
    return await this.dispatcher.dispatchActionAsync(
      new LoadSpecificServiceAction({ service_id: serviceId }),
      TrackOperations.LOAD_SPECIFIC_SERVICE,
      serviceId
    );
  }

  areLogsLoadedForPlugin(service_id: string, service_instance_id: string): Observable<boolean> {
    return this.store
      .select((state) => state.servicesState.entities[service_id])
      .pipe(
        map(
          (serviceStoreEntity) =>
            !!serviceStoreEntity?.serviceLogs && !!serviceStoreEntity?.serviceLogs[service_instance_id]
        )
      );
  }

  getLogs(
    service_id: string,
    service_instance_id: string,
    filterCallback: (serviceLog: ServiceLog) => boolean = null
  ): Observable<ServiceLog[]> {
    return this.store
      .select((x) => x.servicesState)
      .pipe(
        map((x) => x.entities[service_id]?.serviceLogs),
        filter(logsDict => !!logsDict),
        map((logsDict) => logsDict[service_instance_id] ?? []),
        map((serviceLogs) => {
          if (filterCallback) {
            return serviceLogs.filter(filterCallback);
          }

          return serviceLogs;
        }),
        shareReplay()
      );
  }

  getLogsForParticularPeriod(
    service_id: string,
    service_instance_id: string,
    logPeriodInDays: number,
    sortOrder: 'asc' | 'dsc' = 'asc'
  ): Observable<ServiceLog[]> {
    const currentDate = new Date();
    const dateFrom = new Date(
      Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - logPeriodInDays)
    );

    return this.getLogsOrderedByDate(
      service_id,
      service_instance_id,
      (serviceLog) => new Date(serviceLog.timestamp * 1000) >= dateFrom,
      sortOrder
    );
  }

  getLogsOrderedByDate(
    service_id: string,
    service_instance_id: string,
    filterCallback: (serviceLog: ServiceLog) => boolean = null,
    sortOrder: 'asc' | 'dsc' = 'asc'
  ): Observable<ServiceLog[]> {
    return this.getLogs(service_id, service_instance_id, filterCallback).pipe(
      map((logs) =>
        logs.sort((fst, scnd) => {
          return sortOrder === 'asc' ? fst.timestamp - scnd.timestamp : scnd.timestamp - fst.timestamp;
        })
      ),
      shareReplay()
    );
  }

  addPluginLogs(service_id: string, service_instance_id: string, serviceLogs: ServiceLog[]): void {
    const dict: Dictionary<ServiceLog[]> = { [service_instance_id]: serviceLogs };
    this.store.dispatch(ServiceAdapterActions.serviceLogsAdded({ service_id, service_instance_id, serviceLogs: dict }));
  }

  getTicketingServices(serviceIds?: string[]): Observable<Service[]> {
    if (!this.ticketingServices$) {
      this.ticketingServices$ = this.getServicesByType(ServiceTypeEnum.TICKETING);
    }
    return this.ticketingServices$.pipe(map((services) => this.getByServicesIds(services, serviceIds)));
  }

  getGenericServices(serviceIds?: string[]): Observable<Service[]> {
    if (!this.genericServices$) {
      this.genericServices$ = this.getServicesByType(ServiceTypeEnum.GENERIC);
    }
    return this.genericServices$.pipe(map((services) => this.getByServicesIds(services, serviceIds)));
  }

  getFileMonitorServices(serviceIds?: string[]): Observable<Service[]> {
    if (!this.fileMonitorServices$) {
      this.fileMonitorServices$ = this.getServicesByType(ServiceTypeEnum.FILEMONITOR);
    }
    return this.fileMonitorServices$.pipe(map((services) => this.getByServicesIds(services, serviceIds)));
  }

  addPluginToFavorites(service_id: string): void {
    this.store.dispatch(new AddToFavouritesAction(service_id));
  }

  removePluginFromFavorites(service_id: string): void {
    this.store.dispatch(new RemoveFromFavouritesAction(service_id));
  }

  getPluginsForOnboardingPlugins(): Observable<Service[]> {
    return this.store
      .select((state) => state.servicesState)
      .pipe(
        map((obj) => {
          return OnboardingPluginsIds.map((service_id) => obj.entities[service_id])
            .filter((x) => x)
            .map((x) => x.service);
        })
      );
  }

  getPluginsForOnboardingPolicy(): Observable<Service[]> {
    if (!this.onboardingPolicyServices$) {
      this.onboardingPolicyServices$ = this.getAllServices().pipe(
        map((services) => this.getByServicesIds(services, OnboardingPolicyPluginsIds))
      );
    }
    return this.onboardingPolicyServices$;
  }

  private getServicesByType(serviceType: ServiceTypeEnum): Observable<Service[]> {
    return this.getAllServices().pipe(
      map((services) => services.filter((service) => serviceType === service.service_type)),
      shareReplay()
    );
  }

  private getByServicesIds(services: Service[], servicesIds: string[]): Service[] {
    return servicesIds ? services.filter((service) => servicesIds.includes(service.service_id)) : services;
  }
}
