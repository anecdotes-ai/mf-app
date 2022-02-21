import { Injectable, Injector, Type } from '@angular/core';
import { AbstractDynamicControl, DynamicFormGroup } from 'core/modules/dynamic-form';
import { ParamTypeEnum, ServiceField } from 'core/modules/data/models/domain';
import {
  AbstractFieldHandler,
  CheckboxFieldHandler,
  CheckBoxGroupFieldHandler,
  CopiableFieldHandler,
  FileFieldHandler,
  TextFieldHandler,
  TextAreaHandler,
  DropdownFieldHandler,
  MultiDropdownHandler,
} from './field-handlers';

@Injectable()
export class PluginConnectionFormBuilderService {
  private static handlers: { [key: string]: Type<any> } = {
    [ParamTypeEnum.TEXT]: TextFieldHandler,
    [ParamTypeEnum.LONGTEXT]: TextAreaHandler,
    [ParamTypeEnum.EMAIL]: TextFieldHandler,
    [ParamTypeEnum.NUMBER]: TextFieldHandler,
    [ParamTypeEnum.URL]: TextFieldHandler,
    [ParamTypeEnum.PASSWORD]: TextFieldHandler,
    [ParamTypeEnum.PREGENERATEDUUID]: CopiableFieldHandler,
    [ParamTypeEnum.FILE]: FileFieldHandler,
    [ParamTypeEnum.CHECKBOX]: CheckboxFieldHandler,
    [ParamTypeEnum.DROPDOWN]: DropdownFieldHandler,
    [ParamTypeEnum.MULTIDROPDOWN]: MultiDropdownHandler,
  };

  constructor(private injector: Injector) { }

  buildDynamicFormGroup(
    serviceFields: ServiceField[],
    fulfill_data?: { [key: string]: any },
    form_options?: { password_show_hide_button: boolean }
  ): DynamicFormGroup<any> {
    const config = {};
    const otherFields = serviceFields.filter((s) => s.param_type !== ParamTypeEnum.CHECKBOXPRODUCT);
    otherFields.forEach((sf, index) => {
      const field = this.resolveHandler(sf.param_type).handleField(sf, index);

      if (!fulfill_data) {
        field.setValue(undefined);
      } else  {
        field.setValue(fulfill_data[sf.field_name]);
      }

      config[sf.field_name] = field;

      this.setFormOptions(sf, field, form_options);
    });

    const checkBoxGroup = this.resolveCheckBoxGroupField(serviceFields, otherFields.length);

    if (checkBoxGroup) {
      config[ParamTypeEnum.CHECKBOXPRODUCT] = checkBoxGroup;
    }

    return new DynamicFormGroup(config);
  }

  private setFormOptions(
    sf: ServiceField,
    resolvedFormField: AbstractDynamicControl<any>,
    options: { password_show_hide_button: boolean }
  ): void {
    if (options) {
      if (sf.param_type === ParamTypeEnum.PASSWORD && options.password_show_hide_button) {
        resolvedFormField.inputs['showHideText'] = true;
      }
    }
  }

  private resolveCheckBoxGroupField(serviceFields: ServiceField[], groupIndex: number): AbstractDynamicControl<any> {
    const checkBoxes = serviceFields.filter((s) => s.param_type === ParamTypeEnum.CHECKBOXPRODUCT);

    const handler = this.resolveCheckboxGroupHandler();

    return checkBoxes.length ? handler.handleFields(checkBoxes, groupIndex) : null;
  }

  private resolveCheckboxGroupHandler(): CheckBoxGroupFieldHandler {
    return this.injector.get(CheckBoxGroupFieldHandler);
  }

  private resolveHandler(paramType: ParamTypeEnum): AbstractFieldHandler {
    return this.injector.get(PluginConnectionFormBuilderService.handlers[paramType]);
  }
}
