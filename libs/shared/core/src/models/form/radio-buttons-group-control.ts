import { AbstractDynamicControl, ControlConfiguration } from 'core/modules/dynamic-form';
import { RadioButtonGroupComponent } from 'core/modules/form-controls';

export class RadioButtonsGroupControl extends AbstractDynamicControl<RadioButtonGroupComponent, any, any, string> {
  constructor(config: ControlConfiguration<any, any, string>) {
    super(config, RadioButtonGroupComponent);
  }
}
