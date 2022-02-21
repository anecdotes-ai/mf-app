// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { CommonModule } from '@angular/common';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SvgIconsModule } from '../../../svg-icons';
import { TranslateConfigModule } from '../../../translate-config';
import { ComingSoonButtonComponent } from './coming-soon-button.component';

export default {
  title: 'Atoms/Buttons/Coming soon Button',
  component: ComingSoonButtonComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, TranslateConfigModule, SvgIconsModule.forRoot()],
    }),
  ],
} as Meta;

const Template: Story<ComingSoonButtonComponent> = (args: ComingSoonButtonComponent) => ({
  props: args,
  template: '<app-coming-soon-button>Hover me</app-coming-soon-button>',
});

export const ComingSoonPrimary = Template.bind({});
ComingSoonPrimary.args = {
  type: 'primary',
  svgIconPath: 'adopt',
};

export const ComingSoonSecondary = Template.bind({});
ComingSoonSecondary.args = {
  type: 'secondary',
  svgIconPath: 'adopt',
};

export const ComingSoonBasic = Template.bind({});
ComingSoonBasic.args = {
  type: 'basic',
  svgIconPath: 'adopt',
};

export const ComingSoonDisabledPrimary = Template.bind({});
ComingSoonDisabledPrimary.args = {
  type: 'primary',
  svgIconPath: 'adopt',
  disabled: true,
};

export const ComingSoonDisabledSecondary = Template.bind({});
ComingSoonDisabledSecondary.args = {
  type: 'secondary',
  svgIconPath: 'adopt',
  disabled: true,
};

export const ComingSoonDisabledBasic = Template.bind({});
ComingSoonDisabledBasic.args = {
  type: 'basic',
  svgIconPath: 'adopt',
  disabled: true,
};
