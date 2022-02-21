import { TextAreaControl } from 'core';
import { ParamTypeEnum, ServiceField } from 'core/modules/data/models/domain';
import { TextAreaHandler } from './text-area-handler';

describe('TextAreaHandler', () => {
  let fieldHandler: TextAreaHandler;
  let serviceField: ServiceField;
  let fieldIndex: number;

  beforeEach(() => {
    fieldHandler = new TextAreaHandler();
    serviceField = {
      max_len: 39310,
    };
    fieldIndex = 293;
  });

  describe('handleField', () => {
    it('should return instance of TextAreaControl', () => {
      // Arrange
      // Act
      const dynamicControl = fieldHandler.handleField(serviceField, fieldIndex);

      // Assert
      expect(dynamicControl).toBeInstanceOf(TextAreaControl);
    });

    it('should have common config', () => {
      // Arrange
      // Act
      const dynamicControl = fieldHandler.handleField(serviceField, fieldIndex);

      // Assert
      expect(dynamicControl.inputs.label).toBe(serviceField.display_name);
      expect(dynamicControl.inputs.required).toBe(serviceField.mandatory_requirement);
      expect(dynamicControl.inputs.index).toBe(fieldIndex + 1);
      expect(dynamicControl.inputs.maxLength).toBe(serviceField.max_len);
      expect(dynamicControl.inputs.validateOnDirty).toBeTrue();
      dynamicControl.setValue('someValue');
      expect(dynamicControl.valid).toBeTrue();
    });
  });
});
