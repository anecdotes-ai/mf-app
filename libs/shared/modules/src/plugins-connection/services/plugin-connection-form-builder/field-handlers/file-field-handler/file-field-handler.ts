import { AbstractFieldHandler } from '../abstract-field-handler/abstract-field-handler';
import { ServiceField } from 'core/modules/data/models/domain';
import { AbstractDynamicControl } from 'core/modules/dynamic-form';
import { FileFieldControl } from 'core/models';
import { Validators } from '@angular/forms';
import { placeholderFile } from 'core/modules/plugins-connection/utils/placeholder-file';
import { CustomValidators } from 'core/modules/dynamic-form/validators';

export class FileFieldHandler extends AbstractFieldHandler {

  handleField(currentField: ServiceField, index: number): AbstractDynamicControl<any> {
    const commonConfig = this.getCommonConfig(currentField, index);

    let resultInitialvalue: any;
    if (currentField.field_value) {

      if ((currentField.field_value as any) instanceof File) {
        resultInitialvalue = currentField.field_value;
      } else {
        resultInitialvalue = new File([], currentField.field_value, { type: placeholderFile });
      }
    }

    const validators = [currentField.regex_validator ? Validators.pattern(currentField.regex_validator) : null];
    return new FileFieldControl({
      initialInputs: {
        ...commonConfig.initialInputs,
      },
      initialValue: resultInitialvalue,
      validators: currentField.mandatory_requirement ? [...validators, Validators.required] : validators,
      asyncValidators: currentField.json_file_format ? [CustomValidators.jsonValidator] : []
    });
  }
}
