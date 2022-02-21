import { PluginConnectionFacadeService } from 'core/modules/plugins-connection/services';
import { PluginConnectionStates } from './../../../models/plugin-connection-states.enum';
import { Service } from 'core/modules/data/models/domain';
import { MenuAction } from 'core/modules/dropdown-menu';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-plugin-static-state-header',
  templateUrl: './plugin-static-state-header.component.html',
  styleUrls: ['./plugin-static-state-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PluginStaticStateHeaderComponent implements OnInit {
  @Input()
  service: Service;

  @Input()
  displayThreeDotsMenu: boolean;

  @Input()
  displayCloseButton: boolean;

  @Input()
  headerTitleTranslationKey?: string;

  @Output()
  closeBtnClick = new EventEmitter<any>(true);

  threeDotsMenu: MenuAction<Service>[] = [];

  constructor(private pluginConnectionFacade: PluginConnectionFacadeService) { }

  ngOnInit(): void {
    this.resolveThreeDotsMenu();
  }

  buildTranslationKey(relativeKey: string): string {
    return `openedPlugin.${relativeKey}`;
  }

  private resolveThreeDotsMenu(): void {
    this.threeDotsMenu = [
      {
        translationKey: this.buildTranslationKey('disconnectPluginMenuOption'),
        action: () => {
          this.pluginConnectionFacade.setState(this.service.service_id, PluginConnectionStates.DisablePlugin);
        },
      },
    ];
  }
}
