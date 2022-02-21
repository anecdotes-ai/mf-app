// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { CommonModule } from '@angular/common';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SvgIconsModule } from '../../../svg-icons';
import { IconButtonComponent } from './icon-button.component';

export default {
  title: 'Atoms/Buttons/Icon Button',
  component: IconButtonComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, SvgIconsModule.forRoot()],
    }),
  ],
} as Meta;

const Template: Story<IconButtonComponent> = (args: IconButtonComponent) => ({
  props: args,
});

export const IconButtonPrimary = Template.bind({});
IconButtonPrimary.args = {
  type: 'primary',
  svgIconPath: 'adopt',
};

export const IconButtonSecondary = Template.bind({});
IconButtonSecondary.args = {
  type: 'secondary',
  svgIconPath: 'adopt',
};


export const IconButtonBasic = Template.bind({});
IconButtonBasic.args = {
  type: 'basic',
  svgIconPath: 'adopt'
};

export const IconButtonDisabledPrimary = Template.bind({});
IconButtonDisabledPrimary.args = {
  type: 'primary',
  svgIconPath: 'adopt',
  disabled: true,
};

export const IconButtonDisabledSecondary = Template.bind({});
IconButtonDisabledSecondary.args = {
  type: 'secondary',
  svgIconPath: 'adopt',
  disabled: true,
};


export const IconButtonDisabledBasic = Template.bind({});
IconButtonDisabledBasic.args = {
  type: 'basic',
  svgIconPath: 'adopt',
  disabled: true,
};
