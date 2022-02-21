import { PluginFacadeService } from 'core/modules/data/services/facades';
import { TakeDynamicFormValues } from './../all-plugin-connection-forms/all-plugin-connection-forms.component';
import { PluginConnectionStates } from './../../../models/plugin-connection-states.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { OAuthUrlHandlerService } from './../../../services/oauth-url-handler/oauth-url-handler.service';
import { WindowHelperService } from 'core/services/window-helper/window-helper.service';
import { filter, map, shareReplay } from 'rxjs/operators';
import { PluginConnectionFacadeService } from './../../../services/facades/plugin-connection-facade/plugin-connection-facade.service';
import { SubscriptionDetacher } from 'core/utils/subscription-detacher.class';
import { Service } from 'core/modules/data/models/domain';
import {
  PluginConnectionStaticStateSharedContext,
  PluginStaticStateSharedContextInputKeys,
} from './../../../models/plugin-static-content.model';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { interpolateStringWithParams, isPluginInstallationFlow } from 'core/utils';
import { getInstallationRequestQueryParams, isInstallPluginRedirection } from '../../../utils';

export const SessionStorageKeys = {
  DirtyFormValues: 'dirty-form-values',
  AllFormValues: 'all-form-values',
};

export const SessionStorageKeysMap = {
  [TakeDynamicFormValues.ALL_VALUES]: SessionStorageKeys.AllFormValues,
  [TakeDynamicFormValues.DIRTY_VALUES]: SessionStorageKeys.DirtyFormValues,
};

@Component({
  selector: 'app-plugin-oauth-with-form-connection',
  templateUrl: './plugin-oauth-with-form-connection.component.html',
  styleUrls: ['./plugin-oauth-with-form-connection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PluginOauthWithFormConnectionComponent implements OnInit, OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  private routerParamsDetacher: SubscriptionDetacher = new SubscriptionDetacher();

  service: Service;

  constructor(
    private switcher: ComponentSwitcherDirective,
    private pluginConnectionFacadeService: PluginConnectionFacadeService,
    private pluginFacade: PluginFacadeService,
    private windowHelper: WindowHelperService,
    private urlHandlerService: OAuthUrlHandlerService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.switcher.sharedContext$
      .pipe(
        map(
          (context: PluginConnectionStaticStateSharedContext) =>
            context[PluginStaticStateSharedContextInputKeys.service]
        ),
        this.detacher.takeUntilDetach(),
        shareReplay()
      )
      .subscribe((service: Service) => {
        if (!this.service && service) {
          this.initializeInstallationRequest(service);
          this.handleUrlErrors(service);
        }
        this.service = service;
      });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
    this.routerParamsDetacher.detach();
  }

  installationHandler(eventObj: { allValues: { [key: string]: any }; dirtyValues: { [key: string]: any } }): void {
    const interpolatedUrl = interpolateStringWithParams(this.service.service_auth_url, eventObj.allValues, {
      openSeparator: '{',
      closeSeparator: '}',
    });

    // We have to save the form values to local storage so after redirection back, the values will be available
    // Tha's the reason why we don't use NGRX storage hare
    this.writeAllFormValuesToStorage(eventObj.allValues);
    this.writeFormDirtyValuesToStorage(eventObj.dirtyValues);

    this.windowHelper.openUrl(this.urlHandlerService.modifyRedirectUri(interpolatedUrl));
  }

  private handleUrlErrors(service: Service): void {
    if (this.activatedRoute.snapshot.queryParams['error']) {
      this.pluginConnectionFacadeService.setState(service.service_id, PluginConnectionStates.ExternalApprovalError);
    }
  }

  private initializeInstallationRequest(service: Service): void {
    this.activatedRoute.queryParams
      .pipe(
        filter((params) => isInstallPluginRedirection(service, params)),
        map((params) => getInstallationRequestQueryParams(params)),
        this.routerParamsDetacher.takeUntilDetach(),
      )
      .subscribe((params) => {
        this.router.navigate([]);
        // If status is not setteled that means the service was not ever installed. So we move it as installation flow then.
        // Else if status is removed, that means that service was installed atleast once, then we move it as reconnect flow.
        const allFormValues = this.getFormValuesFromStorage(TakeDynamicFormValues.ALL_VALUES);
        const paramsAndFormValues = { ...allFormValues, ...params };
        if (isPluginInstallationFlow(service)) {
          this.pluginConnectionFacadeService.connectPlugin(service, paramsAndFormValues);
        } else {
          this.pluginConnectionFacadeService.reconnectPlugin(service, paramsAndFormValues);
        }

        this.removeAllFormDataFromStorage();
      });
  }

  private getFormValuesFromStorage(mode: TakeDynamicFormValues): { [key: string]: any } {
    return JSON.parse(this.windowHelper.getWindow().sessionStorage.getItem(SessionStorageKeysMap[mode]));
  }
  private writeFormDirtyValuesToStorage(allFormValues: { [key: string]: any }): void {
    this.windowHelper
      .getWindow()
      .sessionStorage.setItem(SessionStorageKeys.DirtyFormValues, JSON.stringify(allFormValues));
  }

  private writeAllFormValuesToStorage(dirtyFormValues: { [key: string]: any }): void {
    this.windowHelper
      .getWindow()
      .sessionStorage.setItem(SessionStorageKeys.AllFormValues, JSON.stringify(dirtyFormValues));
  }

  private removeAllFormDataFromStorage(): void {
    this.windowHelper.getWindow().sessionStorage.removeItem(SessionStorageKeys.AllFormValues);
    this.windowHelper.getWindow().sessionStorage.removeItem(SessionStorageKeys.DirtyFormValues);
  }
}
