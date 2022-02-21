import { CheckBoxControl } from 'core';
import { ServiceField } from 'core/modules/data/models/domain';
import { CheckboxFieldHandler } from './checkbox-field-handler';

describe('CheckboxFieldHandler', () => {
  let fieldHandler: CheckboxFieldHandler;
  let serviceField: ServiceField;
  let fieldIndex: number;

  beforeEach(() => {
    fieldHandler = new CheckboxFieldHandler();
    serviceField = {
      display_name: 'displayName',
      mandatory_requirement: true,
    };
    fieldIndex = 293;
  });

  describe('handleField', () => {
    it('should return instance of CheckBoxControl', () => {
      // Arrange
      // Act
      const dynamicControl = fieldHandler.handleField(serviceField, fieldIndex);

      // Assert
      expect(dynamicControl).toBeInstanceOf(CheckBoxControl);
    });

    it('should have common config', () => {
      // Arrange
      // Act
      const dynamicControl = fieldHandler.handleField(serviceField, fieldIndex);

      // Assert
      expect(dynamicControl.inputs.valueLabel).toBe(serviceField.display_name);
      expect(dynamicControl.inputs.index).toBe(fieldIndex + 1);
      expect(dynamicControl.inputs.validateOnDirty).toBeTrue();
    });
  });
});
