import { TextFieldControl } from 'core';
import { ParamTypeEnum, ServiceField } from 'core/modules/data/models/domain';
import { TextFieldHandler } from './text-field-handler';

describe('TextFieldHandler', () => {
  let fieldHandler: TextFieldHandler;
  let serviceField: ServiceField;
  let fieldIndex: number;

  beforeEach(() => {
    fieldHandler = new TextFieldHandler();
    serviceField = {
      display_name: 'displayName',
      mandatory_requirement: true,
      max_len: 39310,
    };
    fieldIndex = 293;
  });

  describe('handleField', () => {
    it('should return instance of TextFieldControl', () => {
      // Arrange
      // Act
      const dynamicControl = fieldHandler.handleField(serviceField, fieldIndex);

      // Assert
      expect(dynamicControl).toBeInstanceOf(TextFieldControl);
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
      expect(dynamicControl.valid).toBeFalse();
      dynamicControl.setValue('someValue');
      expect(dynamicControl.valid).toBeTrue();
    });

    describe('input type related inputs', () => {
      it(`should have inputType equal to "text" if param_type is ${ParamTypeEnum.TEXT}`, () => {
        // Arrange
        serviceField.param_type = ParamTypeEnum.TEXT;

        // Act
        const dynamicControl = fieldHandler.handleField(serviceField, fieldIndex);

        // Assert
        expect(dynamicControl.inputs.inputType).toBe('text');
      });

      it(`should have inputType equal to "text" if param_type is ${ParamTypeEnum.TEXT} and regexp validation is specified`, () => {
        // Arrange
        serviceField.param_type = ParamTypeEnum.TEXT;
        serviceField.regex_validator = '\\d+';

        // Act
        const dynamicControl = fieldHandler.handleField(serviceField, fieldIndex);
        dynamicControl.setValue('1223');

        // Assert
        expect(dynamicControl.inputs.inputType).toBe('text');
        expect(dynamicControl.valid).toBeTrue();
        dynamicControl.setValue('addsadsd');
        expect(dynamicControl.valid).toBeFalse();
      });

      it(`should have inputType equal to "number" if param_type is ${ParamTypeEnum.NUMBER}`, () => {
        // Arrange
        serviceField.param_type = ParamTypeEnum.NUMBER;

        // Act
        const dynamicControl = fieldHandler.handleField(serviceField, fieldIndex);

        // Assert
        expect(dynamicControl.inputs.inputType).toBe('number');
      });

      it(`should have inputType equal to "text" if param_type is ${ParamTypeEnum.EMAIL}`, () => {
        // Arrange
        serviceField.param_type = ParamTypeEnum.EMAIL;

        // Act
        const dynamicControl = fieldHandler.handleField(serviceField, fieldIndex);
        dynamicControl.setValue('some@email.brom');

        // Assert
        expect(dynamicControl.inputs.inputType).toBe('text');
        expect(dynamicControl.valid).toBeTrue();
        dynamicControl.setValue('addsaadadasdmail.brom');
        expect(dynamicControl.valid).toBeFalse();
      });

      it(`should have inputType equal to "text" if param_type is ${ParamTypeEnum.URL}`, () => {
        // Arrange
        serviceField.param_type = ParamTypeEnum.URL;

        // Act
        const dynamicControl = fieldHandler.handleField(serviceField, fieldIndex);
        dynamicControl.setValue('https://github.com/');

        // Assert
        expect(dynamicControl.inputs.inputType).toBe('text');
        expect(dynamicControl.valid).toBeTrue();
        dynamicControl.setValue('addsaadadasdmail.brom');
        expect(dynamicControl.valid).toBeFalse();
      });

      it(`should have inputType equal to "text" if param_type is ${ParamTypeEnum.PASSWORD}`, () => {
        // Arrange
        serviceField.param_type = ParamTypeEnum.PASSWORD;

        // Act
        const dynamicControl = fieldHandler.handleField(serviceField, fieldIndex);

        // Assert
        expect(dynamicControl.inputs.inputType).toBe('password');
      });
    });
  });
});
