import { AbstractDynamicControl, ControlConfiguration } from 'core/modules/dynamic-form';
import { CopyTextFieldComponent } from 'core/modules/form-controls';

export class CopiableFieldControl extends AbstractDynamicControl<CopyTextFieldComponent, any, any, string> {
  constructor(config: ControlConfiguration<any, any, string>) {
    super(config, CopyTextFieldComponent);
  }
}
