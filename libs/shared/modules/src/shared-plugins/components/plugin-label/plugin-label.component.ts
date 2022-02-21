import { Component, HostBinding, Input } from '@angular/core';

export const PluginLabelTypeEnum = {
  NewPlugin: 'new-plugin',
  PremPlugin: 'prem-plugin'
};

@Component({
  selector: 'app-plugin-label',
  templateUrl: './plugin-label.component.html',
  styleUrls: ['./plugin-label.component.scss']
})
export class PluginLabelComponent {

  @HostBinding('class')
  private get class(): string {
    return `${this.position} ${this.type}`;
  }

  @Input()
  type: string = PluginLabelTypeEnum.NewPlugin;

  @Input()
  position: 'left' | 'right' = 'left';

  @Input()
  translationKey: string;

  buildTranslationKey(relativeKey: string): string {
    return `plugins.pluginItem.${relativeKey}`;
  }

}
