import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { TranslateConfigModule } from '../../../translate-config';
import { AvatarModule } from 'core/modules/avatar/avatar.module';
import { AvatarComponent } from 'core/modules/avatar/components/avatar/avatar.component';

export default {
  title: 'Avatar',
  component: AvatarComponent,
  decorators: [
    moduleMetadata({
      imports: [
        TranslateConfigModule,
        SvgIconsModule.forRoot(),
        BrowserAnimationsModule,
        AvatarModule
      ],
    }),
    componentWrapperDecorator((story) => `<div style="margin: 4em">${story}</div>`),
  ],
} as Meta;

const Template: Story<AvatarComponent> = (args: AvatarComponent) => ({
  props: {
      name: '',
    ...args,
  },
});

export const EmptyAvatar = Template.bind({});

export const AvatarWithName = Template.bind({});
AvatarWithName.args = {
    name: 'Sample name'
};
