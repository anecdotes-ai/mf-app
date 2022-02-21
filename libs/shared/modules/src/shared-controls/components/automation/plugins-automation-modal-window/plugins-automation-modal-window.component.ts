import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { Service } from 'core/modules/data/models/domain';
import { Observable } from 'rxjs';
import { EvidenceCreationModalParams } from '../../../models';

export const PluginsAutomationModalInputFields = {
  cornerTitle: 'cornerTitle',
  relatedPlugins: 'relatedPlugins',
  baseModalConfigData: 'baseModalConfigData',
  iconName: 'iconName',
};

@Component({
  selector: 'app-plugins-automation-modal-window',
  templateUrl: './plugins-automation-modal-window.component.html',
  styleUrls: ['./plugins-automation-modal-window.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PluginsAutomationModalWindowComponent implements OnInit {
  @Input(PluginsAutomationModalInputFields.iconName)
  iconName = 'automate';

  @Input(PluginsAutomationModalInputFields.cornerTitle)
  cornerTitle: string;

  @Input(PluginsAutomationModalInputFields.relatedPlugins)
  relatedPlugins: Service[];

  @Input(PluginsAutomationModalInputFields.baseModalConfigData)
  baseModalConfigData: {
    titleKey: string;
    descriptionKey: string;
  } = {
    titleKey: this.buildTranslationKey('title'),
    descriptionKey: this.buildTranslationKey('description'),
  };

  context$: Observable<EvidenceCreationModalParams>;

  get isBackEnabled(): boolean {
    return this.componentsSwitcher.previousIndex !== undefined;
  }

  constructor(public componentsSwitcher: ComponentSwitcherDirective) {}

  ngOnInit(): void {
    this.context$ = this.componentsSwitcher.sharedContext$;
  }

  buildTranslationKey(relativeKey: string): string {
    return `automatePluginsModal.${relativeKey}`;
  }

  buildSwitcherTranslationKey(relativeKey: string): string {
    return `componentSwitcher.${relativeKey}`;
  }

  trackByFn(_: number, service: Service): string {
    return service.service_id;
  }

  backModalButtonClick(): void {
    this.componentsSwitcher.goBack();
  }
}
