import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { TranslateConfigModule } from 'core/modules/translate-config';
import { FormControlsModule } from 'core/modules/form-controls';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { TextAreaComponent } from './text-area.component';

@Component({
  selector: 'app-text-area-wrapper',
  template: `<ng-content></ng-content>`,
})
class TextAreaWrapperComponent {
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
  title: 'Moleculas/Form controls/Text area',
  component: TextAreaComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        SvgIconsModule.forRoot(),
        TranslateConfigModule,
        FormControlsModule,
        ReactiveFormsModule,
      ],
      declarations: [TextAreaWrapperComponent],
    }),
  ],
} as Meta;

const WrapperTemplate: Story<TextAreaComponent> = (args: TextAreaComponent) => ({
  props: {
    label: 'Some textarea',
    placeholder: 'Input something',
    ...args,
  } as TextAreaComponent,
  template: `
        <app-text-area-wrapper [errors]="errors" #wrapper>
            <form [formGroup]="wrapper.formGroup">
                <app-text-area
                    style="width: 400px"
                    [formControl]="wrapper.formControl"
                    [placeholder]="placeholder"
                    [placeholderIcon]="placeholderIcon"
                    [isDisabled]="isDisabled"
                    [errorTexts]="errorTexts"
                    [validateOnDirty]="validateOnDirty"
                    [required]="required"
                    [label]="label"
                    [index]="index"
                    [displayCharactersCounter]="displayCharactersCounter"
                    [maxLength]="maxLength"
                    [resizable]="resizable"
                    [rows]="rows"
                ></app-text-area>
            </form>            
        </app-text-area-wrapper>
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
} as TextAreaComponent;

export const ValidateOnDirtyIsFalse = WrapperTemplate.bind({});
ValidateOnDirtyIsFalse.args = {
  required: true,
  validateOnDirty: false,
  errorTexts: {
    required: 'This field is required',
  } as any,
  label: 'Label',
} as TextAreaComponent;

export const Invalid = WrapperTemplate.bind({});
Invalid.args = {
  ...({
    required: true,
    validateOnDirty: false,
    errorTexts: {
      required: 'This field is required',
    } as any,
    label: 'Label',
  } as TextAreaComponent),
  errors: { required: true },
};

export const WithCounter = WrapperTemplate.bind({});
WithCounter.args = {
  displayCharactersCounter: true,
  maxLength: 12,
} as TextAreaComponent;

export const Disabled = WrapperTemplate.bind({});
Disabled.args = {
  isDisabled: true,
} as TextAreaComponent;

export const WithPlaceholderContainingIcon = WrapperTemplate.bind({});
WithPlaceholderContainingIcon.args = {
  placeholderIcon: 'search'
} as TextAreaComponent;

export const ResizabilityIsDisabled = WrapperTemplate.bind({});
ResizabilityIsDisabled.args = {
  placeholderIcon: 'search',
  resizable: false
} as TextAreaComponent;

export const WithRowsSpecified = WrapperTemplate.bind({});
WithRowsSpecified.args = {
  placeholderIcon: 'search',
  rows: 5
} as TextAreaComponent;

export const WithIndex = WrapperTemplate.bind({});
WithIndex.args = {
  index: 8,
} as TextAreaComponent;

export const WithIconInPlaceholder = WrapperTemplate.bind({});
WithIconInPlaceholder.args = {
  placeholderIcon: 'coming-soon'
} as TextAreaComponent;
