import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SvgIconsModule } from '../../../svg-icons';
import { ChipComponent } from './chip.component';

export default {
  title: 'Atoms/Chip',
  component: ChipComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, TranslateModule.forRoot(), SvgIconsModule.forRoot()],
    }),
  ],
} as Meta;

const Template: Story<ChipComponent> = (args: ChipComponent) => ({
  props: args,
  template: '<app-chip [class]="bgClass">Some inner text</app-chip>',
});

export const Orange = Template.bind({});
Orange.args = {
    bgClass: 'bg-orange-90'
};

export const Pink = Template.bind({});
Pink.args = {
    bgClass: 'bg-pink-90'
};

export const Blue = Template.bind({});
Blue.args = {
    bgClass: 'bg-blue-90'
};
