import { CheckBoxGroupControl, CheckBoxGroupItem } from 'core/models';
import { ServiceField } from 'core/modules/data/models/domain';
import { AbstractDynamicControl } from 'core/modules/dynamic-form';

export class CheckBoxGroupFieldHandler {
  handleFields(fields: ServiceField[], index: number): AbstractDynamicControl<any> {
    const groupItems: CheckBoxGroupItem[] = fields.map((serviceField) => {
      const item: CheckBoxGroupItem = {
        valueLabel: serviceField.display_name,
        value: false,
        fieldName: serviceField.field_name,
      };
      return item;
    });

    return new CheckBoxGroupControl({
      initialInputs: {
        checkboxes: groupItems,
        index: ++index,
      },
    });
  }
}
