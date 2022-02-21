/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { ParamTypeEnum, ServiceField } from 'core/modules/data/models/domain';
import { GenericDynamicControl } from 'core/modules/dynamic-form';
import {
  CheckboxFieldHandler,
  CheckBoxGroupFieldHandler,
  FileFieldHandler,
  TextAreaHandler,
  TextFieldHandler,
} from './field-handlers';
import { PluginConnectionFormBuilderService } from './plugin-connection-form-builder.service';

describe('PluginConnectionFormBuilder', () => {
  let pluginConnectionFormBuilderService: PluginConnectionFormBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PluginConnectionFormBuilderService,
        FileFieldHandler,
        CheckboxFieldHandler,
        TextFieldHandler,
        CheckBoxGroupFieldHandler,
        TextAreaHandler,
      ],
    });
  });

  beforeEach(() => {
    pluginConnectionFormBuilderService = TestBed.inject(PluginConnectionFormBuilderService);
  });

  describe('CheckBoxGroupFieldHandler', () => {
    let mockControl: GenericDynamicControl<any>;
    let firstCheckBoxProduct: ServiceField;
    let secondCheckBoxProduct: ServiceField;
    let handleFieldsSpy: jasmine.Spy;

    beforeEach(() => {
      firstCheckBoxProduct = {
        field_name: 'fileField',
        param_type: ParamTypeEnum.CHECKBOXPRODUCT,
      };
      mockControl = new GenericDynamicControl({}, null);

      firstCheckBoxProduct = {
        field_name: 'firstCheckBoxProduct',
        param_type: ParamTypeEnum.CHECKBOXPRODUCT,
      };
      secondCheckBoxProduct = {
        field_name: 'secondCheckBoxProduct',
        param_type: ParamTypeEnum.CHECKBOXPRODUCT,
      };
    });

    // it(`should be used for ${ParamTypeEnum.CHECKBOXPRODUCT}`, () => {
    //   // Arrange
    //   const handler = TestBed.inject(CheckBoxGroupFieldHandler);
    //   handleFieldsSpy = spyOn(handler, 'handleFields').and.returnValue(mockControl);
    //   const serviceFields: ServiceField[] = [
    //     {
    //       field_name: 'fieldName',
    //       param_type: ParamTypeEnum.EMAIL,
    //     },
    //     firstCheckBoxProduct,
    //     secondCheckBoxProduct,
    //   ];

    //   // Act
    //   const dynamicFormGroup = pluginConnectionFormBuilderService.buildDynamicFormGroup(serviceFields);

    //   // Assert
    //   expect(dynamicFormGroup.controls[ParamTypeEnum.CHECKBOXPRODUCT]).toBe(mockControl);
    //   expect(handleFieldsSpy).toHaveBeenCalledWith([firstCheckBoxProduct, secondCheckBoxProduct], 1);
    // });
  });

  describe('FileFieldHandler', () => {
    let mockControl: GenericDynamicControl<any>;
    let fieldValue: File;
    let serviceField: ServiceField;
    let handleFieldSpy: jasmine.Spy;

    beforeEach(() => {
      serviceField = {
        field_name: 'fileField',
      };
      mockControl = new GenericDynamicControl({}, null);
      const handler = TestBed.inject(FileFieldHandler);
      handleFieldSpy = spyOn(handler, 'handleField').and.returnValue(mockControl);
      fieldValue = new File([], 'someName');
    });

    // it(`should be used for ${ParamTypeEnum.FILE}`, () => {
    //   // Arrange
    //   serviceField.param_type = ParamTypeEnum.FILE;

    //   // Act
    //   const dynamicFormGroup = pluginConnectionFormBuilderService.buildDynamicFormGroup([serviceField], {
    //     [serviceField.field_name]: fieldValue,
    //   });

    //   // Assert
    //   expect(dynamicFormGroup.controls[serviceField.field_name]).toBe(mockControl);
    //   expect(dynamicFormGroup.controls[serviceField.field_name].value).toBe(fieldValue);
    //   expect(handleFieldSpy).toHaveBeenCalledWith(serviceField, 0);
    // });
  });

  describe('CheckBoxFieldHandler', () => {
    let mockControl: GenericDynamicControl<any>;
    let fieldValue: boolean;
    let serviceField: ServiceField;
    let handleFieldSpy: jasmine.Spy;

    beforeEach(() => {
      serviceField = {
        field_name: 'checkBoxField',
      };
      mockControl = new GenericDynamicControl({}, null);
      const handler = TestBed.inject(CheckboxFieldHandler);
      handleFieldSpy = spyOn(handler, 'handleField').and.returnValue(mockControl);
      fieldValue = true;
    });

    it(`should be used for ${ParamTypeEnum.CHECKBOX}`, () => {
      // Arrange
      serviceField.param_type = ParamTypeEnum.CHECKBOX;

      // Act
      const dynamicFormGroup = pluginConnectionFormBuilderService.buildDynamicFormGroup([serviceField], {
        [serviceField.field_name]: fieldValue,
      });

      // Assert
      expect(dynamicFormGroup.controls[serviceField.field_name]).toBe(mockControl);
      expect(dynamicFormGroup.controls[serviceField.field_name].value).toBe(fieldValue);
      expect(handleFieldSpy).toHaveBeenCalledWith(serviceField, 0);
    });
  });

  describe('TextFieldHandler related', () => {
    let mockControl: GenericDynamicControl<any>;
    let fieldValue: string;
    let serviceField: ServiceField;
    let handleFieldSpy: jasmine.Spy;

    beforeEach(() => {
      serviceField = {
        field_name: 'textField',
      };
      mockControl = new GenericDynamicControl({}, null);
      const handler = TestBed.inject(TextFieldHandler);
      handleFieldSpy = spyOn(handler, 'handleField').and.returnValue(mockControl);
      fieldValue = 'someValue';
    });

    it(`should use TextFieldHandler for ${ParamTypeEnum.TEXT}`, () => {
      // Arrange
      serviceField.param_type = ParamTypeEnum.TEXT;

      // Act
      const dynamicFormGroup = pluginConnectionFormBuilderService.buildDynamicFormGroup([serviceField], {
        [serviceField.field_name]: fieldValue,
      });

      // Assert
      expect(dynamicFormGroup.controls[serviceField.field_name]).toBe(mockControl);
      expect(dynamicFormGroup.controls[serviceField.field_name].value).toBe(fieldValue);
      expect(handleFieldSpy).toHaveBeenCalledWith(serviceField, 0);
    });

    it(`should use TextFieldHandler for ${ParamTypeEnum.NUMBER}`, () => {
      // Arrange
      serviceField.param_type = ParamTypeEnum.NUMBER;

      // Act
      const dynamicFormGroup = pluginConnectionFormBuilderService.buildDynamicFormGroup([serviceField], {
        [serviceField.field_name]: fieldValue,
      });

      // Assert
      expect(dynamicFormGroup.controls[serviceField.field_name]).toBe(mockControl);
      expect(dynamicFormGroup.controls[serviceField.field_name].value).toBe(fieldValue);
      expect(handleFieldSpy).toHaveBeenCalledWith(serviceField, 0);
    });

    it(`should use TextFieldHandler for ${ParamTypeEnum.EMAIL}`, () => {
      // Arrange
      serviceField.param_type = ParamTypeEnum.EMAIL;

      // Act
      const dynamicFormGroup = pluginConnectionFormBuilderService.buildDynamicFormGroup([serviceField], {
        [serviceField.field_name]: fieldValue,
      });

      // Assert
      expect(dynamicFormGroup.controls[serviceField.field_name]).toBe(mockControl);
      expect(dynamicFormGroup.controls[serviceField.field_name].value).toBe(fieldValue);
      expect(handleFieldSpy).toHaveBeenCalledWith(serviceField, 0);
    });

    it(`should use TextFieldHandler for ${ParamTypeEnum.URL}`, () => {
      // Arrange
      serviceField.param_type = ParamTypeEnum.URL;

      // Act
      const dynamicFormGroup = pluginConnectionFormBuilderService.buildDynamicFormGroup([serviceField], {
        [serviceField.field_name]: fieldValue,
      });

      // Assert
      expect(dynamicFormGroup.controls[serviceField.field_name]).toBe(mockControl);
      expect(dynamicFormGroup.controls[serviceField.field_name].value).toBe(fieldValue);
      expect(handleFieldSpy).toHaveBeenCalledWith(serviceField, 0);
    });

    it(`should use TextFieldHandler for ${ParamTypeEnum.PASSWORD}`, () => {
      // Arrange
      serviceField.param_type = ParamTypeEnum.PASSWORD;

      // Act
      const dynamicFormGroup = pluginConnectionFormBuilderService.buildDynamicFormGroup([serviceField], {
        [serviceField.field_name]: fieldValue,
      });

      // Assert
      expect(dynamicFormGroup.controls[serviceField.field_name]).toBe(mockControl);
      expect(dynamicFormGroup.controls[serviceField.field_name].value).toBe(fieldValue);
      expect(handleFieldSpy).toHaveBeenCalledWith(serviceField, 0);
    });
  });

  describe('TextAreaHandler related', () => {
    let mockControl: GenericDynamicControl<any>;
    let fieldValue: string;
    let serviceField: ServiceField;
    let handleFieldSpy: jasmine.Spy;

    beforeEach(() => {
      serviceField = {
        field_name: 'textField',
      };
      mockControl = new GenericDynamicControl({}, null);
      const handler = TestBed.inject(TextAreaHandler);
      handleFieldSpy = spyOn(handler, 'handleField').and.returnValue(mockControl);
      fieldValue = 'someValue';
    });

    it(`should use TextAreaHandler for ${ParamTypeEnum.LONGTEXT}`, () => {
      // Arrange
      serviceField.param_type = ParamTypeEnum.LONGTEXT;

      // Act
      const dynamicFormGroup = pluginConnectionFormBuilderService.buildDynamicFormGroup([serviceField], {
        [serviceField.field_name]: fieldValue,
      });

      // Assert
      expect(dynamicFormGroup.controls[serviceField.field_name]).toBe(mockControl);
      expect(dynamicFormGroup.controls[serviceField.field_name].value).toBe(fieldValue);
      expect(handleFieldSpy).toHaveBeenCalledWith(serviceField, 0);
    });

    it(`should set undefined to control value if fulfill_data is undefined`, () => {
      // Arrange
      serviceField.param_type = ParamTypeEnum.TEXT;

      // Act
      const dynamicFormGroup = pluginConnectionFormBuilderService.buildDynamicFormGroup([serviceField], undefined);

      // Assert
      expect(dynamicFormGroup.controls[serviceField.field_name].value).toEqual(undefined);
    });

    it(`should set appropriate value to control value if fulfill_data is defined`, () => {
      // Arrange
      serviceField.param_type = ParamTypeEnum.TEXT;

      // Act
      const dynamicFormGroup = pluginConnectionFormBuilderService.buildDynamicFormGroup([serviceField], {
        [serviceField.field_name]: 'some-value'
      });

      // Assert
      expect(dynamicFormGroup.controls[serviceField.field_name].value).toEqual('some-value');
    });
  });
});
