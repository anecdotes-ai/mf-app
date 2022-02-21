import { TextAreaControl } from 'core/models';
import { ServiceField } from 'core/modules/data/models/domain';
import { AbstractDynamicControl } from 'core/modules/dynamic-form';
import { AbstractFieldHandler } from '../abstract-field-handler/abstract-field-handler';

export class TextAreaHandler extends AbstractFieldHandler {
  handleField(currentField: ServiceField, index: number): AbstractDynamicControl<any> {
    const commonConfig = this.getCommonConfig(currentField, index);

    return new TextAreaControl({
      initialInputs: {
        ...commonConfig.initialInputs,
        maxLength: currentField.max_len ? currentField.max_len : null,
      },
    });
  }
}
