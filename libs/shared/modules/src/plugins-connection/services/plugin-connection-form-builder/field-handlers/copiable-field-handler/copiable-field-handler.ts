import { AbstractFieldHandler } from '../abstract-field-handler/abstract-field-handler';
import { ServiceField } from 'core/modules/data/models/domain';
import { CopiableFieldControl } from 'core/models';
import { AbstractDynamicControl } from 'core/modules/dynamic-form';
import { Validators, ValidatorFn } from '@angular/forms';

export class CopiableFieldHandler extends AbstractFieldHandler {
  handleField(currentField: ServiceField, index: number): AbstractDynamicControl<any> {
    const commonConfig = this.getCommonConfig(currentField, index);

    const typeConfiguration = this.getTypeConfigurationBasedOnParamType(currentField.regex_validator);

    const validators = typeConfiguration.validators ? typeConfiguration.validators.filter((x) => x) : [];

    return new CopiableFieldControl({
      initialInputs: {
        ...commonConfig.initialInputs,
        valueToPass: currentField.field_value,
        readonly: true,
        inputType: typeConfiguration.type,
        maxLength: currentField.max_len ? currentField.max_len : null,
      },
      validators: currentField.mandatory_requirement ? [...validators, Validators.required] : validators,
    });
  }

  private getTypeConfigurationBasedOnParamType(regexp: string): { type: string; validators?: ValidatorFn[] } {
    return { type: 'text', validators: [regexp ? Validators.pattern(regexp) : null] };
  }
}
