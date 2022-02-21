import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { MenuAction } from '../../types';
import { TranslateConfigModule } from '../../../translate-config';
import { DropdownMenuModule } from '../../dropdown-menu.module';
import { ColoredDropdownMenuComponent } from './colored-dropdown-menu.component';
import { SvgIconsModule } from 'core/modules/svg-icons';

export default {
  title: 'Moleculas/Dropdowns/Menus/Colored dropdown menu',
  component: ColoredDropdownMenuComponent,
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

function createBaseMenuActions(): MenuAction[] {
  return [
    {
      icon: 'add_req_framework',
      translationKey: 'Evidence collection',
      // eslint-disable-next-line no-console
      action: () => console.log('action one'),
    },
    {
      translationKey: 'Evidence collection',
      // eslint-disable-next-line no-console
      action: () => console.log('action two'),
    },
  ];
}

const Template: Story<ColoredDropdownMenuComponent> = (args: ColoredDropdownMenuComponent) => ({
  props: args,
});

export const Pink = Template.bind({});
Pink.args = {
  menuActions: createBaseMenuActions(),
  buttonText: 'Lorem ipsum',
  buttonBackgroundClass: 'bg-pink-70',
  tooltip: 'Lorem ipsum dolor sit amet',
};

export const Orange = Template.bind({});
Orange.args = {
  menuActions: createBaseMenuActions(),
  buttonText: 'Lorem ipsum',
  buttonBackgroundClass: 'bg-orange-50',
  tooltip: 'Lorem ipsum dolor sit amet',
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
  menuActions: createBaseMenuActions(),
  buttonText: 'Lorem ipsum',
  buttonBackgroundClass: 'bg-orange-50',
  tooltip: 'Lorem ipsum dolor sit amet',
  isReadOnly: true,
};

export const largeRadius = Template.bind({});
largeRadius.args = {
  menuActions: createBaseMenuActions(),
  buttonText: 'Lorem ipsum',
  buttonBackgroundClass: 'bg-orange-50',
  tooltip: 'Lorem ipsum dolor sit amet',
  radius: 'large',
};

export const withButtonIcon = Template.bind({});
withButtonIcon.args = {
  menuActions: createBaseMenuActions(),
  buttonText: 'Lorem ipsum',
  buttonBackgroundClass: 'bg-orange-50',
  tooltip: 'Lorem ipsum dolor sit amet',
  radius: 'large',
  buttonIcon: 'arrow-down',
};
