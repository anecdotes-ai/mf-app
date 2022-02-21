import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { LoadersModule } from '../../../loaders';
import { SvgIconsModule } from '../../../svg-icons';
import { ButtonNewComponent } from './button.component';

export default {
  title: 'Atoms/Buttons/Button component',
  component: ButtonNewComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, TranslateModule.forRoot(), SvgIconsModule.forRoot(), LoadersModule]
    }),
  ],
} as Meta;

const Template: Story<ButtonNewComponent> = (args: ButtonNewComponent) => ({
  props: args,
  template: '<app-new-button [svgIconPath]="svgIconPath">Button text</app-new-button>',
});

export const Primary = Template.bind({});
Primary.args = {
  type: 'primary',
  svgIconPath: 'adopt',
} as ButtonNewComponent;

export const PrimaryDisabled = Template.bind({});
PrimaryDisabled.args = {
  type: 'primary',
  svgIconPath: 'adopt',
  disabled: true,
} as ButtonNewComponent;

export const WithLoaderPrimary = Template.bind({});
WithLoaderPrimary.args = {
  type: 'primary',
  loading: true,
} as ButtonNewComponent;

export const FocusedPrimary = Template.bind({});
FocusedPrimary.args = {
  type: 'primary',
  focused: true
} as ButtonNewComponent;

export const Secondary = Template.bind({});
Secondary.args = {
  type: 'secondary',
  svgIconPath: 'adopt',
} as ButtonNewComponent;

export const SecondaryDisabled = Template.bind({});
SecondaryDisabled.args = {
  type: 'secondary',
  svgIconPath: 'adopt',
  disabled: true,
} as ButtonNewComponent;

export const WithLoaderSecondary = Template.bind({});
WithLoaderSecondary.args = {
  type: 'secondary',
  loading: true,
} as ButtonNewComponent;

export const FocusedSecondary = Template.bind({});
FocusedSecondary.args = {
  type: 'secondary',
  focused: true
} as ButtonNewComponent;

export const Basic = Template.bind({});
Basic.args = {
  type: 'basic',
  svgIconPath: 'adopt',
} as ButtonNewComponent;

export const BasicDisabled = Template.bind({});
BasicDisabled.args = {
  type: 'basic',
  svgIconPath: 'adopt',
} as ButtonNewComponent;

export const WithLoaderBasic = Template.bind({});
WithLoaderBasic.args = {
  type: 'basic',
  svgIconPath: 'adopt',
} as ButtonNewComponent;

export const FocusedBasic = Template.bind({});
FocusedBasic.args = {
  type: 'basic',
  focused: true
} as ButtonNewComponent;
