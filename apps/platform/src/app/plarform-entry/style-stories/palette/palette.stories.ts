import { CommonModule } from '@angular/common';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { Color, PaletteViewComponent } from './palette-view.component';

function createColor(sufix): Color {
  return {
    backgroundClass: `bg-${sufix}`,
    fontColorClass: `text-${sufix}`,
    variable: `$mc-${sufix}`,
  };
}

export default {
  title: 'Atoms/Palette',
  decorators: [
    moduleMetadata({
      imports: [CommonModule],
      declarations: [PaletteViewComponent],
    }),
  ],
  parameters: {
    backgrounds: {
      values: [{ name: 'white', value: 'white' }, { name: 'red', value: 'red' }, { name: 'blue', value: 'blue' }, { name: 'gray', value: 'gray' }],
    },
  },
} as Meta;

const Template: Story<PaletteViewComponent> = (args: PaletteViewComponent) => ({
  props: args,
  template: '<app-palette-view [colors]="colors"></app-palette-view>',
});

export const Blue = Template.bind({});
Blue.args = {
  colors: [
    createColor('blue-0'),
    createColor('blue-10'),
    createColor('blue-50'),
    createColor('blue-60'),
    createColor('blue-70'),
    createColor('blue-90'),
    createColor('blue-90-05'),
    createColor('blue-90-10'),
    createColor('blue-90-15'),
  ],
};

export const Orange = Template.bind({});
Orange.args = {
  colors: [
    createColor('orange-0'),
    createColor('orange-10'),
    createColor('orange-30'),
    createColor('orange-50'),
    createColor('orange-70'),
    createColor('orange-90'),
  ],
};

export const Pink = Template.bind({});
Pink.args = {
  colors: [
    createColor('pink-0'),
    createColor('pink-10'),
    createColor('pink-50'),
    createColor('pink-70'),
    createColor('pink-90'),
  ],
};

export const Navy = Template.bind({});
Navy.args = {
  colors: [
    createColor('navy-10'),
    createColor('navy-30'),
    createColor('navy-40'),
    createColor('navy-60'),
    createColor('navy-70'),
    createColor('navy-80'),
    createColor('navy-90'),
  ],
};

export const White = Template.bind({});
White.args = {
  colors: [createColor('white')],
};
