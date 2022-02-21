import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { TranslateConfigModule } from '../../../translate-config';
import { FormControlsModule } from '../../form-controls.module';
import { CheckboxComponent } from './checkbox.component';

export default {
  title: 'Moleculas/Form controls/Checkbox',
  component: CheckboxComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        FormControlsModule,
        TranslateConfigModule,
        SvgIconsModule.forRoot(),
        BrowserAnimationsModule,
      ],
    }),
    componentWrapperDecorator((story) => `<div style="margin: 4em">${story}</div>`),
  ],
} as Meta;

const Template: Story<CheckboxComponent> = (args: CheckboxComponent) => ({
  props: args
});

export const Basic = Template.bind({});
Basic.args = {
  checkBoxVariant: 'basic',
  valueLabel: 'Some label'
} as CheckboxComponent;

export const BasicWithIndex = Template.bind({});
BasicWithIndex.args = {
  checkBoxVariant: 'basic',
  label: 'Some label',
  valueLabel: 'Some value label',
  index: 6
} as CheckboxComponent;

export const BasicWithRequiredMark = Template.bind({});
BasicWithRequiredMark.args = {
  checkBoxVariant: 'basic',
  label: 'Some label',
  valueLabel: 'Some value label',
  required: true,
  index: 6
} as CheckboxComponent;

export const Rounded = Template.bind({});
Rounded.args = {
  checkBoxVariant: 'multiselect'
} as CheckboxComponent;
