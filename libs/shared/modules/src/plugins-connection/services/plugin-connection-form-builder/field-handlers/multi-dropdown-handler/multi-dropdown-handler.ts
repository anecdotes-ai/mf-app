import { AbstractFieldHandler } from '../abstract-field-handler/abstract-field-handler';
import { ServiceField } from 'core/modules/data/models/domain';
import { MultiDropdownControl } from 'core/models';
import { AbstractDynamicControl } from 'core/modules/dynamic-form';
import { Validators } from '@angular/forms';

export class MultiDropdownHandler extends AbstractFieldHandler {
  handleField(currentField: ServiceField, index: number): AbstractDynamicControl<any> {
    const commonConfig = this.getCommonConfig(currentField, index);

    return new MultiDropdownControl({
      initialInputs: {
        ...commonConfig.initialInputs,
        data: currentField.multiple_field_values,
        searchEnabled: true,
        titleTranslationKey: currentField.display_name,
        placeholderTranslationKey: 'core.multiSelect.selectPlaceholder',
        displaySelectedItemsList: false,
      },
      validators: currentField.mandatory_requirement ? [Validators.required] : undefined,
    });
  }
}
