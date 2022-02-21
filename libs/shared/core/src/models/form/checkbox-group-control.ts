import { AbstractDynamicControl, ControlConfiguration } from 'core/modules/dynamic-form';
import { CheckboxGroupComponent } from 'core/modules/form-controls';

export class CheckBoxGroupControl extends AbstractDynamicControl<CheckboxGroupComponent, any, any, boolean> {
  constructor(config: ControlConfiguration<any, any, boolean>) {
    super(config, CheckboxGroupComponent);
  }
}
