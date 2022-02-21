import { FileFieldControl } from 'core';
import { ServiceField } from 'core/modules/data/models/domain';
import { FileFieldHandler } from './file-field-handler';

describe('FileFieldHandler', () => {
  let fieldHandler: FileFieldHandler;
  let serviceField: ServiceField;
  let fieldIndex: number;

  beforeEach(() => {
    fieldHandler = new FileFieldHandler();
    serviceField = {
      display_name: 'displayName',
      mandatory_requirement: true,
    };
    fieldIndex = 293;
  });

  describe('handleField', () => {
    it('should return instance of FileFieldControl', () => {
      // Arrange
      // Act
      const dynamicControl = fieldHandler.handleField(serviceField, fieldIndex);

      // Assert
      expect(dynamicControl).toBeInstanceOf(FileFieldControl);
    });

    it('should have common config', () => {
      // Arrange
      // Act
      const dynamicControl = fieldHandler.handleField(serviceField, fieldIndex);

      // Assert
      expect(dynamicControl.inputs.label).toBe(serviceField.display_name);
      expect(dynamicControl.inputs.required).toBe(serviceField.mandatory_requirement);
      expect(dynamicControl.inputs.index).toBe(fieldIndex + 1);
      expect(dynamicControl.inputs.validateOnDirty).toBeTrue();
      expect(dynamicControl.valid).toBeFalse();
      dynamicControl.setValue('someValue');
      expect(dynamicControl.valid).toBeTrue();
    });
  });
});
