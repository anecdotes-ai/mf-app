import { CommonModule } from '@angular/common';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { RadioButtonComponent } from './radio-button.component';
import { SvgIconsModule } from '../../../svg-icons';

export default {
  title: 'Moleculas/Form controls/Radio Button',
  component: RadioButtonComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, SvgIconsModule.forRoot()],
    }),
  ],
} as Meta;

const Template: Story<RadioButtonComponent> = (args: RadioButtonComponent) => ({
  props: args,
  template: `
    <app-radio-button [allowToggle]="allowToggle">
      <svg-icon [src]="icon"></svg-icon>
      <span>{{value}}</span>
    </app-radio-button>
  `
});

export const withoutLabelAndIcon = Template.bind({});
withoutLabelAndIcon.args = {
  allowToggle: true,
};

export const withLabel = Template.bind({});
withLabel.args = {
  value: 'Some Label',
  allowToggle: true,
};

export const withLabelAndIcon = Template.bind({});
withLabelAndIcon.args = {
  value: 'Some Label',
  icon: 'edit',
  allowToggle: true,
};

export const radioDisabled = Template.bind({});
radioDisabled.args = {
  value: 'Some Label',
  icon: 'edit',
  allowToggle: true,
  disabled: true,
};
