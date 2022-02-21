// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { CommonModule } from '@angular/common';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { LoadersModule } from '../../../loaders';
import { SvgIconsModule } from '../../../svg-icons';
import { TranslateConfigModule } from '../../../translate-config';
import { FilterButtonComponent } from './filter-button.component';

export default {
  title: 'Atoms/Buttons/Filters button',
  component: FilterButtonComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, TranslateConfigModule, SvgIconsModule.forRoot(), LoadersModule],
    }),
  ],
} as Meta;

const Template: Story<FilterButtonComponent> = (args: FilterButtonComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
