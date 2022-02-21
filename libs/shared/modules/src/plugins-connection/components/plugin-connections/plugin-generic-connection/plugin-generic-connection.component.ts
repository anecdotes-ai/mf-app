import { shareReplay } from 'rxjs/operators';
import { PluginConnectionFacadeService } from './../../../services/facades/plugin-connection-facade/plugin-connection-facade.service';
import { SubscriptionDetacher } from 'core/utils/subscription-detacher.class';
import { Service } from 'core/modules/data/models/domain';
import {
  PluginConnectionStaticStateSharedContext,
  PluginStaticStateSharedContextInputKeys,
} from './../../../models/plugin-static-content.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';

@Component({
  selector: 'app-plugin-generic-connection',
  templateUrl: './plugin-generic-connection.component.html',
  styleUrls: ['./plugin-generic-connection.component.scss'],
})
export class PluginGenericConnectionComponent implements OnInit, OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  service: Service;

  constructor(
    private switcher: ComponentSwitcherDirective,
    private pluginConnectionFacadeService: PluginConnectionFacadeService
  ) {}

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  ngOnInit(): void {
    this.switcher.sharedContext$
      .pipe(this.detacher.takeUntilDetach(), shareReplay())
      .subscribe((context: PluginConnectionStaticStateSharedContext) => {
        this.service = context[PluginStaticStateSharedContextInputKeys.service];
      });
  }

  installationHandler(eventObj: { allValues: { [key: string]: any } }): void {
    this.pluginConnectionFacadeService.connectPlugin(this.service, eventObj.allValues);
  }

  reconnectHandler(eventObj: { allValues: { [key: string]: any }; dirtyValues: { [key: string]: any } }): void {
    this.pluginConnectionFacadeService.reconnectPlugin(this.service, eventObj.allValues);
  }
}
