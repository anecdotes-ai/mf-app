import { AbstractFieldHandler } from '../abstract-field-handler/abstract-field-handler';
import { ServiceField, ParamTypeEnum } from 'core/modules/data/models/domain';
import { TextFieldControl } from 'core/models';
import { AbstractDynamicControl, CustomValidators } from 'core/modules/dynamic-form';
import { Validators, ValidatorFn } from '@angular/forms';

export class TextFieldHandler extends AbstractFieldHandler {
  handleField(currentField: ServiceField, index: number): AbstractDynamicControl<any> {
    const commonConfig = this.getCommonConfig(currentField, index);

    const typeConfiguration = this.getTypeConfigurationBasedOnParamType(
      currentField.param_type,
      currentField.regex_validator
    );

    const validators = typeConfiguration.validators ? typeConfiguration.validators.filter((x) => x) : [];

    return new TextFieldControl({
      initialInputs: {
        ...commonConfig.initialInputs,
        inputType: typeConfiguration.type,
        maxLength: currentField.max_len ? currentField.max_len : null,
      },
      validators: currentField.mandatory_requirement ? [...validators, Validators.required] : validators,
    });
  }

  private getTypeConfigurationBasedOnParamType(
    paramType: ParamTypeEnum,
    regexp: string
  ): { type: string; validators?: ValidatorFn[] } {
    switch (paramType) {
      case ParamTypeEnum.NUMBER: {
        return { type: 'number' };
      }
      case ParamTypeEnum.EMAIL: {
        return { type: 'text', validators: [Validators.email] };
      }
      case ParamTypeEnum.URL: {
        return { type: 'text', validators: [CustomValidators.strictUrl] };
      }
      case ParamTypeEnum.PASSWORD: {
        return { type: 'password' };
      }
      default: {
        return { type: 'text', validators: [regexp ? Validators.pattern(regexp) : null] };
      }
    }
  }
}
