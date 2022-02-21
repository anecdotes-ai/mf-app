import { AbstractDynamicControl, ControlConfiguration } from 'core/modules/dynamic-form';
import { TextAreaComponent } from 'core/modules/form-controls';

export class TextAreaControl extends AbstractDynamicControl<TextAreaComponent, any, any, string> {
  constructor(config: ControlConfiguration<any, any, string>) {
    super(config, TextAreaComponent);
  }
}
