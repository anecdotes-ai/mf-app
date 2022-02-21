import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { CalculatedControl } from 'core/modules/data/models';

@Component({
  selector: 'app-controls-status-barr',
  templateUrl: './controls-status-bar.component.html',
  styleUrls: ['./controls-status-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlsStatusBarComponent {
  @HostBinding('class')
  private classes = 'flex flex-row items-center';
  
  @Input()
  controls: CalculatedControl[];
}
