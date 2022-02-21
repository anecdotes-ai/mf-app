import { CommonModule } from '@angular/common';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { FontsViewComponent } from './fonts-view.component';

const mainFontClass = 'font-main';
const secondaryFontClass = 'font-secondary';
const fontSizeClasses = ['xs', 'sm', 'lg', 'base', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'].map((size) => `text-${size}`);
const boldClass = 'bold';
const underlineClass = 'underline';

export default {
  title: 'Atoms/Typography/Fonts',
  decorators: [
    moduleMetadata({
      imports: [CommonModule],
      declarations: [FontsViewComponent],
    }),
  ],
  parameters: {
    backgrounds: {
      default: 'white',
      values: [
        { name: 'white', value: 'white' }
      ]
    }
  }
} as Meta;

const Template: Story<FontsViewComponent> = (args: FontsViewComponent) => ({
  props: {
    ...args,
    fontSizeClasses,
    boldClass,
    underlineClass
  },
  template: '<app-fonts-view [fontFamilyClass]="fontFamilyClass" [fontSizeClasses]="fontSizeClasses" [boldClass]="boldClass" [underlineClass]="underlineClass"></app-fonts-view>',
});

export const MainRegular = Template.bind({});
MainRegular.args = {
  fontFamilyClass: mainFontClass,
};

export const SecondaryRegular = Template.bind({});
SecondaryRegular.args = {
  fontFamilyClass: secondaryFontClass,
};
