// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { LoadersModule } from '../../../loaders';
import { SvgIconsModule } from '../../../svg-icons';
import { TranslateConfigModule } from '../../../translate-config';
import { GapMarkComponent } from './gap-mark.component';

export default {
  title: 'Atoms/Gap mark',
  component: GapMarkComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, TranslateConfigModule, SvgIconsModule.forRoot(), NgbTooltipModule],
    }),
  ],
} as Meta;

const Template: Story<GapMarkComponent> = (args: GapMarkComponent) => ({
  props: args,
});

// Default
export const Top = Template.bind({});

export const Bottom = Template.bind({});
Bottom.args = {
  tooltipPlacement: 'bottom'
};

export const Right = Template.bind({});
Right.args = {
  tooltipPlacement: 'right'
};

export const Left = Template.bind({});
Left.args = {
  tooltipPlacement: 'left'
};
