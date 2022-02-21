// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { LoadersModule } from '../../../loaders';
import { DatePickerComponent } from './date-picker.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SvgIconsModule } from 'core/modules/svg-icons';

export default {
  title: 'Datepicker component',
  component: DatePickerComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, TranslateModule.forRoot(), SvgIconsModule.forRoot(),
        LoadersModule, MatDatepickerModule, MatNativeDateModule, BrowserAnimationsModule],
      declarations: [DatePickerComponent],
    }),
  ],
} as Meta;

const Template: Story<DatePickerComponent> = (args: DatePickerComponent) => ({
  props: args,
  template: '<app-date-picker [svgIconPath]="svgIconPath" [label]="label"></app-date-picker>',
});

export const Default = Template.bind({});
Default.args = {};
