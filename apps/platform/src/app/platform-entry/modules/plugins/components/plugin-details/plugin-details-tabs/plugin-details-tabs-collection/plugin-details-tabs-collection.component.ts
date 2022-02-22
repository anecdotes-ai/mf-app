import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RouteParams, TabNames } from 'core';
import { Service } from 'core/modules/data/models/domain';
import {
  PluginsEventService,
} from 'core/modules/plugins-connection/services/plugins-event-service/plugins-event.service';
import { TabModel, TabsComponent } from 'core/modules/dropdown-menu';

@Component({
  selector: 'app-plugin-details-tabs-collection',
  templateUrl: './plugin-details-tabs-collection.component.html',
  styleUrls: ['./plugin-details-tabs-collection.component.scss'],
})

export class PluginDetailsTabsCollectionComponent implements OnInit, AfterViewInit {
  private defaultTabs: {
    pluginInfo: TabModel;
    permissions: TabModel;
    logs: TabModel;
  };

  @ViewChild('pluginInfo', { static: true })
  private pluginInfoTemplate: TemplateRef<any>;

  @ViewChild('permissions', { static: true })
  private permissionsTemplate: TemplateRef<any>;

  @ViewChild('logs', { static: true })
  private logsTemplate: TemplateRef<any>;

  @ViewChild('tabsComponent', { static: true })
  private tabsComponent: TabsComponent;

  @Input()
  service: Service;

  tabs: TabModel[] = [];
  shouldSendEvent = false;

  constructor(
    private router: Router,
    private cd: ChangeDetectorRef,
    private pluginsEventService: PluginsEventService
  ) { }

  ngOnInit(): void {
    this.defaultTabs = {
      pluginInfo: {
        tabId: 'pluginInfo',
        translationKey: 'openedPlugin.tabNames.pluginInfo',
        tabTemplate: this.pluginInfoTemplate,
      },
      permissions: {
        tabId: 'permissions',
        translationKey: 'openedPlugin.tabNames.permissions',
        tabTemplate: this.permissionsTemplate,
      },
      logs: {
        tabId: RouteParams.plugin.logsQueryParamValue,
        translationKey: 'openedPlugin.tabNames.logs',
        tabTemplate: this.logsTemplate,
        routerLink: RouteParams.plugin.logsQueryParamValue
      },
    };
    this.tabs = [this.defaultTabs.pluginInfo, this.defaultTabs.permissions, this.defaultTabs.logs];
    this.cd.detectChanges();
  }

  ngAfterViewInit(): void {
    this.shouldSendEvent = true;
    // This tiomeout set in order to allow queryParams subscription for OAuth connect perform the connect or reconnect request if there is some params are present
    setTimeout(() => {
      this.syncQueryParamsAndTab();
    }, 500);
  }

  tabChange(tabId: string): void {
    if (this.shouldSendEvent) {
      this.pluginsEventService.trackTabNavigation(this.service, TabNames[tabId]);
    }
    this.setQueryParam(tabId);
  }

  private syncQueryParamsAndTab(): void {
    this.router.routerState.root.queryParams.subscribe((params) => {
      const tabQueryParamValue = params[RouteParams.plugin.tabQueryParamName];
      if (!tabQueryParamValue || !this.defaultTabs[tabQueryParamValue]) {
        this.setQueryParam(this.defaultTabs.pluginInfo.tabId as string);
      } else {
        this.tabsComponent.selectTab(this.tabs.findIndex((x) => x.tabId === tabQueryParamValue));
      }
    });
  }

  private setQueryParam(tabId: string): void {
    this.router.navigate([], {
      queryParams: {
        ...this.router.routerState.snapshot.root.queryParams,
        [RouteParams.plugin.tabQueryParamName]: tabId,
      },
    });
  }
}
