import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { FormControlsModule } from 'core/modules/form-controls';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { TextFieldComponent } from './text-field.component';
import { TranslateConfigModule } from 'core/modules/translate-config';

@Component({
  selector: 'app-text-field-wrapper',
  template: `<ng-content></ng-content>`,
})
class TextFieldWrapperComponent {
  formControl: FormControl;
  formGroup: FormGroup;

  @Input()
  set errors(v: {}) {
    this.formControl.setErrors(v);

    if (v) {
      this.formControl.markAsDirty();
    }
  }

  constructor() {
    this.formControl = new FormControl('');
    this.formGroup = new FormGroup({
      textFieldControl: this.formControl,
    });
  }
}

export default {
  title: 'Moleculas/Form controls/Text field',
  component: TextFieldComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        SvgIconsModule.forRoot(),
        TranslateConfigModule,
        FormControlsModule,
        ReactiveFormsModule,
      ],
      declarations: [TextFieldWrapperComponent],
    }),
  ],
} as Meta;

const WrapperTemplate: Story<TextFieldComponent> = (args: TextFieldComponent) => ({
  props: {
    label: 'Some textfield',
    placeholder: 'Input something',
    ...args,
  } as TextFieldComponent,
  template: `
        <app-text-field-wrapper [errors]="errors" #wrapper>
            <form [formGroup]="wrapper.formGroup">
                <app-text-field
                    style="width: 400px"
                    [formControl]="wrapper.formControl"
                    [required]="required"
                    [index]="index"
                    [validateOnDirty]="validateOnDirty"
                    [inputType]="inputType"
                    [errorTexts]="errorTexts"
                    [displayCharactersCounter]="displayCharactersCounter"
                    [maxLength]="maxLength"
                    [isDisabled]="isDisabled"
                    [label]="label"
                    [placeholder]="placeholder"
                    [placeholderIcon]="placeholderIcon"
                    [showHideText]="showHideText"
                    [minValue]="minValue"
                    [maxValue]="maxValue"
                    [removable]="removable"
                    [addonText]="addonText"
                    [suggestions]="suggestions"
                    [suggestionsConfig]="suggestionsConfig"
                    [clearButtonEnabled]="clearButtonEnabled"
                ></app-text-field>
            </form>            
        </app-text-field-wrapper>
    `,
});

export const Required = WrapperTemplate.bind({});
Required.args = {
  required: true,
  validateOnDirty: true,
  errorTexts: {
    required: 'This field is required',
  } as any,
  label: 'Label',
} as TextFieldComponent;

export const ValidateOnDirtyIsFalse = WrapperTemplate.bind({});
ValidateOnDirtyIsFalse.args = {
  required: true,
  validateOnDirty: false,
  errorTexts: {
    required: 'This field is required',
  } as any,
  label: 'Label',
} as TextFieldComponent;

export const Invalid = WrapperTemplate.bind({});
Invalid.args = {
  ...({
    required: true,
    validateOnDirty: false,
    errorTexts: {
      required: 'This field is required',
    } as any,
    label: 'Label',
  } as TextFieldComponent),
  errors: { required: true },
};

export const WithCounter = WrapperTemplate.bind({});
WithCounter.args = {
  displayCharactersCounter: true,
  maxLength: 12,
} as TextFieldComponent;

export const Disabled = WrapperTemplate.bind({});
Disabled.args = {
  isDisabled: true,
} as TextFieldComponent;

export const WithShowHideText = WrapperTemplate.bind({});
WithShowHideText.args = {
  showHideText: true,
} as TextFieldComponent;

export const NumberTypeWithMinAndMaxValue = WrapperTemplate.bind({});
NumberTypeWithMinAndMaxValue.args = {
  inputType: 'number',
  minValue: 3,
  maxValue: 10,
  placeholder: '5',
} as TextFieldComponent;

export const WithTextClearingButton = WrapperTemplate.bind({});
WithTextClearingButton.args = {
  clearButtonEnabled: true,
} as TextFieldComponent;

export const WithAddonText = WrapperTemplate.bind({});
WithAddonText.args = {
  addonText: 'Lorem Ipsum',
} as TextFieldComponent;

export const WithSuggestions = WrapperTemplate.bind({});
WithSuggestions.args = {
  suggestions: ['Lor', 'Lorem', 'Loremlorem', 'removable', 'export', 'Template'],
  suggestionsConfig: {
    maxItemsToDisplay: 2,
  },
} as TextFieldComponent;

export const WithIndex = WrapperTemplate.bind({});
WithIndex.args = {
  index: 8,
} as TextFieldComponent;

export const WithIconInPlaceholder = WrapperTemplate.bind({});
WithIconInPlaceholder.args = {
  placeholderIcon: 'coming-soon'
} as TextFieldComponent;
