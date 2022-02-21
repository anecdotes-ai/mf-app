import { PluginStaticStateComponent } from './../../plugin-connection-states/plugin-static-state/plugin-static-state.component';
import { PluginConnectionStates } from './../../../models/plugin-connection-states.enum';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import {
  PluginStaticStateInputKeys,
  PluginStaticStateInputKeysEnum,
  PluginStaticStateInputsToTypesMapping,
} from './../../../models/plugin-static-content.model';
import { Component, OnDestroy, OnInit, AfterViewInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isPluginInstallationFlow, SubscriptionDetacher } from 'core/utils';
import { filter, map } from 'rxjs/operators';
import { PluginConnectionFacadeService } from '../../../services';
import { PluginStaticStateBaseComponent } from '../../plugin-connection-states/plugin-static-state-base/plugin-static-state-base.component';
import { getInstallationRequestQueryParams, isInstallPluginRedirection } from '../../../utils';

@Component({
  selector: 'app-plugin-oauth-connection',
  templateUrl: './plugin-oauth-connection.component.html',
  styleUrls: ['./plugin-oauth-connection.component.scss'],
})
export class PluginOauthConnectionComponent
  extends PluginStaticStateBaseComponent
  implements OnDestroy, OnInit, AfterViewInit {
  get footerDisplayed(): boolean {
    return this.displayFooter;
  }
  get headerDisplayed(): boolean {
    return this.displayHeader;
  }

  private routerParamsDetacher: SubscriptionDetacher = new SubscriptionDetacher();
  private oauthDetacher: SubscriptionDetacher = new SubscriptionDetacher();

  @ViewChild('staticPage')
  private staticPageChild: PluginStaticStateComponent;

  @Input(PluginStaticStateInputKeys.mainButton)
  mainButton: PluginStaticStateInputsToTypesMapping[PluginStaticStateInputKeysEnum.mainButton];

  @Input(PluginStaticStateInputKeys.secondaryButton)
  secondaryButton: PluginStaticStateInputsToTypesMapping[PluginStaticStateInputKeysEnum.secondaryButton];

  @Input(PluginStaticStateInputKeys.mainDescription)
  mainDescription: PluginStaticStateInputsToTypesMapping[PluginStaticStateInputKeysEnum.mainDescription];

  @Input(PluginStaticStateInputKeys.secondaryDescription)
  secondaryDescription: PluginStaticStateInputsToTypesMapping[PluginStaticStateInputKeysEnum.secondaryDescription];

  @Input(PluginStaticStateInputKeys.icon)
  icon: PluginStaticStateInputsToTypesMapping[PluginStaticStateInputKeysEnum.icon];

  @Input(PluginStaticStateInputKeys.aboveFooterComponentTypeToRender)
  aboveFooterComponentTypeToRender: PluginStaticStateInputsToTypesMapping[PluginStaticStateInputKeysEnum.aboveFooterComponentTypeToRender];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private pluginConnectionFacade: PluginConnectionFacadeService,
    public cd: ChangeDetectorRef,
    public switcher: ComponentSwitcherDirective // private pluginsDataService: PluginsDataService, // private urlHandlerService: OAuthUrlHandlerService
  ) {
    super(switcher, cd);
  }

  private handleUrlErrors(): void {
    if (this.activatedRoute.snapshot.queryParams['error']) {
      this.pluginConnectionFacade.setState(this.service.service_id, PluginConnectionStates.ExternalApprovalError);
    }
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngAfterViewInit(): void {
    this.staticPageChild.serviceEntityIncoming$
      .pipe(
        filter((s) => !!s),
        this.oauthDetacher.takeUntilDetach()
      )
      .subscribe(() => {
        this.handleUrlErrors();
      });

    this.initializeInstallationRequest();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.oauthDetacher.detach();
    this.routerParamsDetacher.detach();
  }

  initializeInstallationRequest(): void {
    this.activatedRoute.queryParams
      .pipe(
        filter((_) => !!this.service),
        filter((params) => isInstallPluginRedirection(this.service, params)),
        map((params) => getInstallationRequestQueryParams(params)),
        this.routerParamsDetacher.takeUntilDetach()
      )
      .subscribe((params) => {
        this.router.navigate([]);
        // !this.service?.service_status - means the service was never installed so we execute connectPlugin functionality
        if (isPluginInstallationFlow(this.service)) {
          this.pluginConnectionFacade.connectPlugin(this.service, params);
        } else {
          this.pluginConnectionFacade.reconnectPlugin(this.service, params);
        }
      });
  }
}
