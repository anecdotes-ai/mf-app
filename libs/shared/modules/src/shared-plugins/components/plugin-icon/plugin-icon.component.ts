import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-plugin-icon',
  templateUrl: './plugin-icon.component.html',
  styleUrls: ['./plugin-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PluginIconComponent  {
  @HostBinding()
  private classes = 'inline';

  @Input()
  serviceId: string;

  getIconSrc(): string {
    return `plugins/${this.serviceId}`;
  }
}
