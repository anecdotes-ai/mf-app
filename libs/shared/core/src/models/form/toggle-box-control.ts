import { AbstractDynamicControl, ControlConfiguration } from 'core/modules/dynamic-form';
import { ToggleBoxComponent } from 'core/modules/form-controls';

export class ToggleBoxControl extends AbstractDynamicControl<ToggleBoxComponent, any, any, boolean> {
  constructor(config: ControlConfiguration<any, any, boolean>) {
    super(config, ToggleBoxComponent);
  }

  setValue(
    value: boolean,
    options: {
      onlySelf?: boolean;
      emitEvent?: boolean;
      emitModelToViewChange?: boolean;
      emitViewToModelChange?: boolean;
    } = {}
  ): void {
    super.setValue(value, options);
  }
}
