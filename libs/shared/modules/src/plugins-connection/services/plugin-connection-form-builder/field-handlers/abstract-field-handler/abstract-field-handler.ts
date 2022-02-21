import { ServiceField } from 'core/modules/data/models/domain';
import { AbstractDynamicControl, ControlConfiguration } from 'core/modules/dynamic-form';

export abstract class AbstractFieldHandler {
  abstract handleField(currentField: ServiceField, index: number): AbstractDynamicControl<any>;

  protected getCommonConfig(currentField: ServiceField, index: number): ControlConfiguration<any, any, any> {
    return {
      initialInputs: {
        index: ++index,
        label: currentField.display_name,
        required: currentField.mandatory_requirement,
        validateOnDirty: true,
      },
    };
  }
}
