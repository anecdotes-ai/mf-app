import { AbstractDynamicControl, ControlConfiguration } from 'core/modules/dynamic-form';
import { FileInputComponent } from 'core/modules/form-controls';

export class FileFieldControl extends AbstractDynamicControl<FileInputComponent, any, any, { name: string }> {
  constructor(config: ControlConfiguration<any, any, { name: string }>) {
    super(config, FileInputComponent);
  }
}
