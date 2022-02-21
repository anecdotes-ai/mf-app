import { CommonModule } from '@angular/common';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { TranslateConfigModule } from 'core/modules/translate-config';
import { AnecdotesFooterComponent } from './anecdotes-footer.component';

export default {
  title: 'Atoms/Utils/Anecdotes footer',
  component: AnecdotesFooterComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, TranslateConfigModule, SvgIconsModule.forRoot()],
    }),
    componentWrapperDecorator((story) => 
    `<div style="height: 100vh; display: flex; flex-direction: column; justify-content: flex-end;">${story}</div>`
    ),
  ],
  parameters:{
    layout:'fullscreen',
  },
} as Meta;

const Template: Story<AnecdotesFooterComponent> = (args: AnecdotesFooterComponent) => ({
  props: args,
});

export const Default = Template.bind({});
