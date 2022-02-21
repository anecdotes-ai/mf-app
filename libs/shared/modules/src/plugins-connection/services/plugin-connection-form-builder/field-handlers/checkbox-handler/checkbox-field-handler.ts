import { AbstractFieldHandler } from '../abstract-field-handler/abstract-field-handler';
import { ServiceField } from 'core/modules/data/models/domain';
import { CheckBoxControl } from 'core/models';
import { AbstractDynamicControl } from 'core/modules/dynamic-form';

export class CheckboxFieldHandler extends AbstractFieldHandler {
  handleField(currentField: ServiceField, index: number): AbstractDynamicControl<any> {
    const commonConfig = this.getCommonConfig(currentField, index);

    return new CheckBoxControl({
      initialInputs: {
        ...commonConfig.initialInputs,
        valueLabel: currentField.display_name,
      },
    });
  }
}
