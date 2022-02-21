import { CommonModule } from '@angular/common';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { TranslateConfigModule } from 'core/modules/translate-config';
import { StatusMarkComponent } from './status-mark.component';

export default {
  title: 'Atoms/Utils/Status mark',
  component: StatusMarkComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, TranslateConfigModule, SvgIconsModule.forRoot()],
      declarations: [StatusMarkComponent],
    }),
  ],
} as Meta;

const Template: Story<StatusMarkComponent> = (args: StatusMarkComponent) => ({
  props: args,
});

export const NotStarted = Template.bind({});
NotStarted.args = {
  status: 'NOT_STARTED',
};

export const InProgress = Template.bind({});
InProgress.args = {
  status: 'IN_PROGRESS',
};

export const Compliant = Template.bind({});
Compliant.args = {
  status: 'COMPLIANT',
};
