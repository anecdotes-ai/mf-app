import { Meta, Story } from '@storybook/angular';
import { CrossButtonComponent } from './cross-button.component';

export default {
  title: 'Atoms/Buttons/Cross button component',
  component: CrossButtonComponent,
  parameters: {
    backgrounds: {
      default: 'light',
    },
  },
} as Meta;

const Template: Story<CrossButtonComponent> = (args: CrossButtonComponent) => ({
  props: args,
});

export const Default = Template.bind({});
