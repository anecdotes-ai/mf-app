import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from 'core/modules/auth-core/services/auth/auth.service';
import { PluginNavigationService } from 'core/services/plugin-navigation-service/plugin-navigation-service.service';
import { PluginConnectionFacadeService } from '../facades';
import { OAuthUrlHandlerService } from '../oauth-url-handler/oauth-url-handler.service';
import { WindowHelperService } from 'core/services/window-helper/window-helper.service';
import { TestBed } from '@angular/core/testing';
import { ConnectionStateSwitcherService } from './connection-state-switcher.service';
import { PluginsEventService } from 'core/modules/plugins-connection/services/plugins-event-service/plugins-event.service';
import { MultiAccountsEventService } from 'core/modules/data/services/event-tracking/multi-accounts-event-service/multi-accounts-event.service';
import {
  PluginConnectionStates,
  PluginConnectionStaticStateSharedContext,
  PluginStaticStateSharedContextInputKeys,
} from 'core/modules/plugins-connection/models';

describe('ConnectionStateSwitcherService', () => {
  let service: ConnectionStateSwitcherService;
  let pluginsEventService: PluginsEventService;
  let urlHandler: OAuthUrlHandlerService;
  let windowHelper: WindowHelperService;
  let pluginFacade: PluginConnectionFacadeService;
  let multiAccountEventService: MultiAccountsEventService;

  const sharedContext: PluginConnectionStaticStateSharedContext = {
    [PluginStaticStateSharedContextInputKeys.service]: {
      service_display_name: 'some-name',
      service_evidence_list: [{}, {}],
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        ConnectionStateSwitcherService,
        { provide: WindowHelperService, useValue: {} },
        { provide: OAuthUrlHandlerService, useValue: {} },
        { provide: PluginConnectionFacadeService, useValue: {} },
        { provide: PluginNavigationService, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: PluginsEventService, useValue: {} },
        { provide: MultiAccountsEventService, useValue: {} }
      ],
    });
    service = TestBed.inject(ConnectionStateSwitcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Amplitude events sending', () => {
    beforeEach(() => {
      pluginsEventService = TestBed.inject(PluginsEventService);
      multiAccountEventService = TestBed.inject(MultiAccountsEventService);
      pluginsEventService.trackConnectPluginClick = jasmine.createSpy('trackConnectPluginClick');
      pluginsEventService.trackDisconnectPluginClick = jasmine.createSpy('trackDisconnectPluginClick');
      pluginsEventService.trackUpdatePermissionClick = jasmine.createSpy('trackUpdatePermissionClick');
      multiAccountEventService.trackMultiAccountWithPluginName = jasmine.createSpy('trackMultiAccountWithPluginName');

      pluginFacade = TestBed.inject(PluginConnectionFacadeService);
      pluginFacade.disconnectPlugin = jasmine.createSpy('disconnectPlugin');

      urlHandler = TestBed.inject(OAuthUrlHandlerService);
      urlHandler.modifyRedirectUri = jasmine.createSpy('modifyRedirectUri');
      windowHelper = TestBed.inject(WindowHelperService);
      windowHelper.openUrl = jasmine.createSpy('openUrl');
    });
    it('should call pluginsEventService.trackConnectPluginClick on Connect Plugin click', () => {
      // Arrange
      const componentToSwitch = service.pluginConnectionStatePages.find(
        (value) => value.id === PluginConnectionStates.OAUTHConnection
      );

      // Act
      componentToSwitch.contextData.mainButton.action('', sharedContext);

      // Assert
      expect(pluginsEventService.trackConnectPluginClick).toHaveBeenCalledWith(sharedContext[PluginStaticStateSharedContextInputKeys.service]);
    });

    it('should call pluginsEventService.trackDisconnectPluginClick on Disconnect Plugin', () => {
      // Arrange
      const componentToSwitch = service.pluginConnectionStatePages.find(
        (value) => value.id === PluginConnectionStates.DisablePlugin
      );

      // Act
      componentToSwitch.contextData.mainButton.action('', sharedContext);

      // Assert
      expect(pluginsEventService.trackDisconnectPluginClick).toHaveBeenCalledWith(sharedContext[PluginStaticStateSharedContextInputKeys.service]);
    });

    it('should call pluginsEventService.trackUpdatePermissionClick on Update Permission click', () => {
      // Arrange
      const componentToSwitch = service.pluginConnectionStatePages.find(
        (value) => value.id === PluginConnectionStates.OAUTH_EvidenceSuccessfullyCollected
      );

      // Act
      componentToSwitch.contextData.secondaryButton.action('', sharedContext);

      // Assert
      expect(pluginsEventService.trackUpdatePermissionClick).toHaveBeenCalledWith(sharedContext[PluginStaticStateSharedContextInputKeys.service]);
    });
  });
});
