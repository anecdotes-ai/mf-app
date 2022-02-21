import { TranslateModule } from '@ngx-translate/core';
import { ButtonsModule } from 'core/modules/buttons';
import { EmptyStateComponent } from './empty-state.component';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { CommonModule } from '@angular/common';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

export default {
  title: 'Empty state with plugins component',
  component: EmptyStateComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule,  TranslateModule.forChild(), ButtonsModule, SvgIconsModule.forRoot(), PerfectScrollbarModule],
      declarations: [],
      providers: []
    }),
  ],
} as Meta;

const Template: Story<EmptyStateComponent> = (args: EmptyStateComponent) => ({
  props: args,
  
  
});

export const EmptyPage = Template.bind({});
EmptyPage.args = {
    mainDescriptionText: 'Here is displayed main message',
    secondaryDescriptionText: 'Here is displayed secondary message',
    mainButtonText: 'Main action'
};
