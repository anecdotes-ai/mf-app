import { CommonModule } from '@angular/common';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { IconsViewComponent } from './icons-view.component';
import { LoggerService } from 'core/services/logger/logger.service';

export default {
  title: 'Atoms/Icons',
  decorators: [
    moduleMetadata({
      imports: [CommonModule, SvgIconsModule.forRoot()],
      declarations: [IconsViewComponent],
      providers: [
        {
          provide: LoggerService,
          useValue: {
            log: () => {},
            error: () => {},
          } as LoggerService,
        },
      ],
    }),
  ],
} as Meta;

const Template: Story<IconsViewComponent> = (args: IconsViewComponent) => ({
  props: args,
  template: '<app-icons-view></app-icons-view>',
});

export const Viewer = Template.bind({});
