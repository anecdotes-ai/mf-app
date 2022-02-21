// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { ControlHeaderComponent } from './control-header.component';
import { LoadersModule } from 'core/modules/loaders';
import { SvgIconsModule } from 'core/modules/svg-icons';

export default {
  title: 'Control-Header component',
  component: ControlHeaderComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, TranslateModule.forRoot(), SvgIconsModule.forRoot(),  LoadersModule],
      declarations: [ControlHeaderComponent],
    }),
  ],
} as Meta;

const Template: Story<ControlHeaderComponent> = (args: ControlHeaderComponent) => ({
  props: args,
  template: '<app-control-header [infoTooltip]="infoTooltip" [label]="label" [infoTooltipPlacement]="infoTooltipPlacement" ' +
    '[infoTooltipClass]="infoTooltipClass" [index]="index" [labelParamsObj]="labelParamsObj" [required]="required"></app-control-header>',
});

export const BasicExample = Template.bind({});
BasicExample.args = {
  label: 'Field',
  infoTooltip: 'tooltip'
};

export const RequiredField = Template.bind({});
RequiredField.args = {
  label: 'Required field',
  required: true
};
