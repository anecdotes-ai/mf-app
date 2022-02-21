import { PluginFacadeService } from 'core/modules/data/services/facades';
import { PluginConnectionEntity } from 'core/modules/plugins-connection/store/models';
import { SubscriptionDetacher } from 'core/utils/subscription-detacher.class';
import { PluginConnectionFacadeService } from './../../services/facades/plugin-connection-facade/plugin-connection-facade.service';
import { ConnectionStateSwitcherService } from './../../services/connection-state-switcher/connection-state-switcher.service';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { PluginConnectionStaticStateSharedContext, PluginStaticStateSharedContextInputKeys } from '../../models';
import { Service } from 'core/modules/data/models/domain';
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { filter, distinctUntilChanged, switchMap, take, map } from 'rxjs/operators';
import { from, Observable, of } from 'rxjs';

@Component({
  selector: 'app-plugin-connection-area',
  templateUrl: './plugin-connection-area.component.html',
  styleUrls: ['./plugin-connection-area.component.scss'],
})
export class PluginConnectionAreaComponent implements OnChanges, AfterViewInit, OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  @ViewChild('switcherRef')
  private swithcerDir: ComponentSwitcherDirective;

  @Input()
  plugin: Service;

  switcherSharedContext: PluginConnectionStaticStateSharedContext;

  constructor(
    public connectionStateSwitcherService: ConnectionStateSwitcherService,
    private pluginConnectionFacade: PluginConnectionFacadeService,
    private pluginFacadeService: PluginFacadeService,
    private cd: ChangeDetectorRef
  ) { }

  ngAfterViewInit(): void {
    const entityListener$ = this.pluginConnectionFacade.getPluginConnectionEntity(this.plugin).pipe(
      this.detacher.takeUntilDetach(),
      filter((serviceEntity) => !!serviceEntity)
    );
    this.setListenerForStateSwitching(entityListener$);
    this.setListenerForCreateSharedTranslateParams(entityListener$);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('plugin' in changes) {
      this.updateSwitcherContextValue({ service: this.plugin });
    }
  }

  private setListenerForStateSwitching(entityListener$: Observable<PluginConnectionEntity>): void {
    entityListener$
      .pipe(distinctUntilChanged((prev, curr) => prev?.connection_state === curr?.connection_state))
      .subscribe((currentState) => {
        this.updateSwitcherContextValue({ serviceConnectionEntity: currentState });
        this.swithcerDir.goById(currentState.connection_state);
      });
  }

  private setListenerForCreateSharedTranslateParams(entityListener$: Observable<PluginConnectionEntity>): void {
    entityListener$
      .pipe(
        distinctUntilChanged((prev, curr) => prev?.selected_service_instance_id === curr?.selected_service_instance_id),
        switchMap((currentState) => {
          if (!currentState?.selected_service_instance_id) {
           return this.getPluginDataAsSelectedServiceInstanceViewData(currentState);
          }

          return this.getViewDataOfSelectedInstanceIfInstanceExistsOrReturnCurrent(currentState);
        })
      )
      .subscribe((accumulatedRes) => {
        if (accumulatedRes.instance) {
          this.updateSwitcherContextValue({ selectedServiceInstanceViewData: accumulatedRes.instance });
          this.cd.detectChanges();
        }
      });
  }

  private getPluginDataAsSelectedServiceInstanceViewData(
    currentState: PluginConnectionEntity
  ): Observable<{
    instance: {
      instance_display_name: string;
      collected_evidence_count: number;
    };
    connectionState: PluginConnectionEntity;
  }> {
    return of(currentState).pipe(
      map((state) => ({
        instance: {
          instance_display_name: this.switcherSharedContext?.[PluginStaticStateSharedContextInputKeys.service]
            .service_display_name,
          collected_evidence_count: this.switcherSharedContext?.[PluginStaticStateSharedContextInputKeys.service]
            .service_evidence_list?.length,
        },
        connectionState: state,
      }))
    );
  }

  private getViewDataOfSelectedInstanceIfInstanceExistsOrReturnCurrent(
    currentState: PluginConnectionEntity
  ): Observable<{
    instance: {
      instance_display_name: string;
      collected_evidence_count: number;
    };
    connectionState: PluginConnectionEntity;
  }> {
    const isSelectedServiceInstancePresentInInstancesListOfService =
      currentState?.selected_service_instance_id &&
      this.switcherSharedContext?.[PluginStaticStateSharedContextInputKeys.service]?.service_instances_list?.some(
        (s) => s.service_instance_id === currentState?.selected_service_instance_id
      );

    if (isSelectedServiceInstancePresentInInstancesListOfService) {
      return from(
        this.pluginFacadeService.getServiceInstance(
          currentState.service_id,
          currentState.selected_service_instance_id
        )
      ).pipe(
        take(1),
        map((res) => ({
          instance: {
            instance_display_name: res.service_multi_account
              ? res.service_instances_list[0].service_instance_display_name
              : res.service_display_name,
            collected_evidence_count: res.service_evidence_list.length,
          },
          connectionState: currentState,
        }))
      );
    } else {
      return of(currentState).pipe(
        map((state) => ({
          instance: this.switcherSharedContext?.selectedServiceInstanceViewData,
          connectionState: state,
        }))
      );
    }
  }

  private updateSwitcherContextValue(valueToUpsertToContext: Partial<PluginConnectionStaticStateSharedContext>): void {
    this.switcherSharedContext = this.switcherSharedContext
      ? {
        ...this.switcherSharedContext,
        ...valueToUpsertToContext,
      }
      : { ...valueToUpsertToContext };
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }
}
