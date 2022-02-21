import { MultiDropdownControlComponent } from 'core/modules/dropdown-menu';
import { AbstractDynamicControl, ControlConfiguration } from 'core/modules/dynamic-form';

export class MultiDropdownControl extends AbstractDynamicControl<MultiDropdownControlComponent, any, any, any> {
  constructor(config: ControlConfiguration<any, any, any>) {
    super(config, MultiDropdownControlComponent);
  }
}
