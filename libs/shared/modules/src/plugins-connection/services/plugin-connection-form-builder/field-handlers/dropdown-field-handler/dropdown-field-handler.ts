import { AbstractFieldHandler } from '../abstract-field-handler/abstract-field-handler';
import { ServiceField, ParamTypeEnum } from 'core/modules/data/models/domain';
import { DropdownControl } from 'core/models';
import { AbstractDynamicControl, CustomValidators } from 'core/modules/dynamic-form';

export class DropdownFieldHandler extends AbstractFieldHandler {
  handleField(currentField: ServiceField, index: number): AbstractDynamicControl<any> {
    const commonConfig = this.getCommonConfig(currentField, index);

    return new DropdownControl({
      initialInputs: {
        ...commonConfig.initialInputs,
        data: currentField.multiple_field_values,
        searchEnabled: true,
        titleTranslationKey: currentField.display_name
      }
    });
  }
}
