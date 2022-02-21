import { CheckBoxGroupControl } from 'core';
import { ServiceField } from 'core/modules/data/models/domain';
import { CheckBoxGroupFieldHandler } from './checkbox-group-field-handler';

describe('CheckBoxGroupFieldHandler', () => {
  let fieldHandler: CheckBoxGroupFieldHandler;
  let firstServiceField: ServiceField;
  let secondServiceField: ServiceField;
  let serviceFields: ServiceField[];
  let fieldIndex: number;

  beforeEach(() => {
    fieldHandler = new CheckBoxGroupFieldHandler();
    firstServiceField = {
      display_name: 'firstDisplayName',
      field_name: 'firstFieldName',
    };
    secondServiceField = {
      display_name: 'secondDisplayName',
      field_name: 'secondFieldName',
    };
    serviceFields = [firstServiceField, secondServiceField];
    fieldIndex = 293;
  });

  describe('handleField', () => {
    it('should return instance of CheckBoxGroupControl', () => {
      // Arrange
      // Act
      const dynamicControl = fieldHandler.handleFields(serviceFields, fieldIndex);

      // Assert
      expect(dynamicControl).toBeInstanceOf(CheckBoxGroupControl);
    });

    it('should have common config', () => {
      // Arrange
      // Act
      const dynamicControl = fieldHandler.handleFields(serviceFields, fieldIndex);

      // Assert
      expect(dynamicControl.inputs.index).toBe(fieldIndex + 1);
      expect(dynamicControl.inputs.checkboxes).toEqual([
        {
          valueLabel: firstServiceField.display_name,
          value: false,
          fieldName: firstServiceField.field_name,
        },
        {
          valueLabel: secondServiceField.display_name,
          value: false,
          fieldName: secondServiceField.field_name,
        },
      ]);
    });
  });
});
