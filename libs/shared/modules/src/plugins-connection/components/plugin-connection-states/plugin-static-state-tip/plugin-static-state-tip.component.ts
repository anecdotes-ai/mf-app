import { AppRoutes, AppSettingsRoutesSegments } from 'core/constants/routes';
import { Service, StatusTip } from 'core/modules/data/models/domain';
import { Component, Input } from '@angular/core';
import { WindowHelperService, AppConfigService } from 'core/services';
import { TipTypeEnum } from 'core/models';
import { OnPremEventService } from 'core/services/on-prem-event-service/on-prem-event.service';

export const PluginTipTypesToTipTypes = {
  info: TipTypeEnum.TIP,
  severity: TipTypeEnum.NOTICE,
  notice: TipTypeEnum.NOTICE,
  error: TipTypeEnum.ERROR
};

@Component({
  selector: 'app-plugin-static-state-tip',
  templateUrl: './plugin-static-state-tip.component.html',
  styleUrls: ['./plugin-static-state-tip.component.scss'],
})
export class PluginStaticStateTipComponent {
  @Input()
  service: Service;

  @Input()
  displayTip: boolean;

  PluginTipTypesToTipTypes = PluginTipTypesToTipTypes;

  onPremLink = `/${AppRoutes.Settings}/${AppSettingsRoutesSegments.Connectors}`;

  constructor(
    private windowHelper: WindowHelperService,
    private configService: AppConfigService,
    private onPremEventService: OnPremEventService
  ) {}

  buildTranslationKey(key: string): string {
    return `pluginConnection.${key}`;
  }

  buildTipType(tip: StatusTip): TipTypeEnum {
    return PluginTipTypesToTipTypes[tip.type.toLocaleLowerCase()];
  }

  openOnPremTipLink(): void {
    this.windowHelper.openUrlInNewTab(this.onPremLink);
    this.onPremEventService.trackNavigationFromPluginToConnectorsEvent();
  }

  opeMultiAccountsLink(): void {
    this.windowHelper.openUrlInNewTab(this.configService.config.redirectUrls.multiAccountsPage);
  }
}
