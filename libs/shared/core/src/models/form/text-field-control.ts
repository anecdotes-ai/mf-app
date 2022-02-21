import { AbstractDynamicControl, ControlConfiguration } from 'core/modules/dynamic-form';
import { TextFieldComponent } from 'core/modules/form-controls';

export class TextFieldControl extends AbstractDynamicControl<TextFieldComponent, any, any, string> {
  constructor(config: ControlConfiguration<any, any, string>) {
    super(config, TextFieldComponent);
  }
}
