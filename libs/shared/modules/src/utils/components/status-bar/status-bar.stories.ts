import { CommonModule } from '@angular/common';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { TranslateConfigModule } from 'core/modules/translate-config';
import { StatusBarComponent } from './status-bar.component';

export default {
  title: 'Atoms/Utils/Status bar',
  component: StatusBarComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, TranslateConfigModule, SvgIconsModule.forRoot()],
    }),
  ],
} as Meta;

const Template: Story<StatusBarComponent> = (args: StatusBarComponent) => ({
  props: args,
});

export const Default = Template.bind({});
Default.args = {
  definition: [
    { count: 20, cssClass: 'bg-navy-60' },
    { count: 15, cssClass: 'bg-orange-50' },
    { count: 35, cssClass: 'bg-orange-70' },
    { count: 17, cssClass: 'bg-pink-50' },
    { count: 35, cssClass: 'bg-blue-60' },
    { count: 50, cssClass: 'bg-navy-80' },
  ],
} as StatusBarComponent;
