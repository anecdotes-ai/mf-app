import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { FormControlsModule } from 'core/modules/form-controls';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { ToggleBoxComponent } from './toggle-box.component';
import { TranslateConfigModule } from 'core/modules/translate-config';

export default {
  title: 'Moleculas/Form controls/Toggle Box',
  component: ToggleBoxComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        SvgIconsModule.forRoot(),
        TranslateConfigModule,
        FormControlsModule,
        ReactiveFormsModule,
      ],
    }),
    componentWrapperDecorator((story) => `<div style="margin: 4em width: 400px">${story}</div>`),
  ],
} as Meta;

const Template: Story<ToggleBoxComponent> = (args: ToggleBoxComponent) => ({
  props: {
    title: 'Some Title',
    subtitle: 'Sub title',
    titleTranslationKey: 'Some dropdown',
    placeholderTranslationKey: 'Pick some value',
    ...args,
  },
});

export const WithoutIcon = Template.bind({});

export const WithIcon = Template.bind({});
WithIcon.args = {
  iconSrc: 'adopt'
};

export const ComingSoon = Template.bind({});
ComingSoon.args = {
  comingSoon: true
};
