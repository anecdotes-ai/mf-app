import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { ActionMenuButtonComponent, DropdownMenuModule, MenuAction } from 'core/modules/dropdown-menu';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { TranslateConfigModule } from 'core/modules/translate-config';

export default {
  title: 'Moleculas/Dropdowns/Menus/Action Menu Button',
  component: ActionMenuButtonComponent,
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
    componentWrapperDecorator((story) => `<div style="margin: 6em">${story}</div>`),
  ],
} as Meta;

function createBaseMenuActions(): MenuAction[] {
  return [
    {
      translationKey: 'Audit zone',
      action: () => {},
    },
    {
      translationKey: 'Connect',
      icon: 'add_req_framework',
      action: () => {},
    },
  ];
}

const Template: Story<ActionMenuButtonComponent> = (args: ActionMenuButtonComponent) => ({
  props: args,
});

export const BasicButton = Template.bind({});
BasicButton.args = {
  menuActions: createBaseMenuActions(),
  buttonTextTranslationKey: 'Some Action',
  type: 'basic',
};

export const PrimaryButton = Template.bind({});
PrimaryButton.args = {
  menuActions: createBaseMenuActions(),
  buttonTextTranslationKey: 'Some Action',
  type: 'primary',
};

export const SecondaryButton = Template.bind({});
SecondaryButton.args = {
  menuActions: createBaseMenuActions(),
  buttonTextTranslationKey: 'Some Action',
  type: 'secondary',
};

export const PrimaryButtonWithIcon = Template.bind({});
PrimaryButtonWithIcon.args = {
  menuActions: createBaseMenuActions(),
  buttonTextTranslationKey: 'Some Action',
  type: 'primary',
  icon: 'adopt',
};

export const SecondaryButtonWithIcon = Template.bind({});
SecondaryButtonWithIcon.args = {
  menuActions: createBaseMenuActions(),
  buttonTextTranslationKey: 'Some Action',
  type: 'secondary',
  icon: 'adopt',
};

export const ListWithSmallWidth = Template.bind({});
ListWithSmallWidth.args = {
  menuActions: createBaseMenuActions(),
  buttonTextTranslationKey: 'Some Action',
  type: 'primary',
  listWidth: 'small',
};

export const ListWithMediumWidth = Template.bind({});
ListWithMediumWidth.args = {
  menuActions: createBaseMenuActions(),
  buttonTextTranslationKey: 'Some Action',
  type: 'primary',
  listWidth: 'medium',
};

export const ListWithDropdownButtonWidth = Template.bind({});
ListWithDropdownButtonWidth.args = {
  menuActions: createBaseMenuActions(),
  buttonTextTranslationKey: 'Some Action',
  type: 'primary',
  listWidth: 'asDropdownButton',
};

export const ListPositionOnTopLeftCorner = Template.bind({});
ListPositionOnTopLeftCorner.args = {
  menuActions: createBaseMenuActions(),
  buttonTextTranslationKey: 'Some Action',
  type: 'primary',
  listWidth: 'small',
  menuPositionX: 'before',
  menuPositionY: 'above',
};

export const ListPositionOnTopRightCorner = Template.bind({});
ListPositionOnTopRightCorner.args = {
  menuActions: createBaseMenuActions(),
  buttonTextTranslationKey: 'Some Action',
  type: 'primary',
  listWidth: 'small',
  menuPositionX: 'after',
  menuPositionY: 'above',
};

export const ListPositionOnBottomLeftCorner = Template.bind({});
ListPositionOnBottomLeftCorner.args = {
  menuActions: createBaseMenuActions(),
  buttonTextTranslationKey: 'Some Action',
  type: 'primary',
  listWidth: 'small',
  menuPositionX: 'before',
  menuPositionY: 'below',
};

export const ListPositionOnBottomRightCorner = Template.bind({});
ListPositionOnBottomRightCorner.args = {
  menuActions: createBaseMenuActions(),
  buttonTextTranslationKey: 'Some Action',
  type: 'primary',
  listWidth: 'small',
  menuPositionX: 'after',
  menuPositionY: 'below',
};
