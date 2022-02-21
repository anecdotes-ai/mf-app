import { AbstractDynamicControl, ControlConfiguration } from 'core/modules/dynamic-form';
import { DropdownControlComponent } from 'core/modules/dropdown-menu';

export class DropdownControl extends AbstractDynamicControl<DropdownControlComponent, any, any, any> {
  constructor(config: ControlConfiguration<any, any, any>) {
    super(config, DropdownControlComponent);
  }
}
