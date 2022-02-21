import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { TranslateConfigModule } from '../../../translate-config';
import { DropdownMenuModule } from '../../dropdown-menu.module';
import { MultiDropdownControlComponent } from './multi-dropdown-control.component';

export default {
  title: 'Moleculas/Dropdowns/Controls/Multi dropdown form control',
  component: MultiDropdownControlComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        DropdownMenuModule,
        TranslateConfigModule,
        SvgIconsModule.forRoot(),
        BrowserAnimationsModule,
      ],
    }),
    componentWrapperDecorator((story) => `<div style="margin: 4em">${story}</div>`),
  ],
} as Meta;

const Template: Story<MultiDropdownControlComponent> = (args: MultiDropdownControlComponent) => ({
  props: {
    data: ['Value1', 'Value2', 'Value3', 'Value4', 'Value5', 'Value6', 'Value7', 'Value8', 'Value9', 'Value10'],
    titleTranslationKey: 'Some dropdown',
    placeholderTranslationKey: 'Pick some value',
    ...args,
  },
});

export const WithoutSearch = Template.bind({});

export const WithSearch = Template.bind({});
WithSearch.args = {
  searchEnabled: true,
  searchFieldPlaceholder: 'Input something to search values'
};

export const Required = Template.bind({});
Required.args = {
  required: true
};

export const ConfigurableVisibleItemsCount = Template.bind({});
ConfigurableVisibleItemsCount.args = {
  visibleItemsCount: 6
};
