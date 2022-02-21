import { CommonModule } from '@angular/common';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { ButtonsModule } from 'core/modules/buttons';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { UtilsModule } from 'core/modules/utils';
import { TranslateConfigModule } from '../../../translate-config';
import { Notification, NotificationState } from '../../models';
import { NotificationItemComponent } from './notification-item.component';

const notification: Notification = {
  id: 'bla2',
  content: 'Inbar Dor tagged you in a comment',
  creation_time: 'Sun Dec 05 2021 15:05:51 GMT+0200 (Israel Standard Time)',
  state: NotificationState.New,
  data: {
    extraParams: {
      path: ['SOC 2', 'Board of director- bla bla bla'],
    },
  },
};

export default {
  title: 'Organisms/Notification',
  component: NotificationItemComponent,
  decorators: [
    moduleMetadata({
      declarations: [NotificationItemComponent],
      imports: [CommonModule, TranslateConfigModule, UtilsModule, ButtonsModule, SvgIconsModule.forRoot()],
    }),
  ],
} as Meta;

const Template: Story<NotificationItemComponent> = (args: NotificationItemComponent) => ({
  props: args,
  template: '<app-notification-item [notification]="notification" [path]="path" [icon]="icon"></app-notification-item>',
});

export const DefaultNewNotification = Template.bind({});
DefaultNewNotification.args = {
  icon: 'notification',
  notification: notification,
};

export const DefaultSeenNotification = Template.bind({});
DefaultSeenNotification.args = {
  icon: 'notification',
  notification: { ...notification, state: NotificationState.Seen },
};

export const CommentNewNotification = Template.bind({});
CommentNewNotification.args = {
  path: notification.data?.extraParams?.path?.join(' > '),
  icon: 'notifications/comment',
  notification: notification,
};

export const CommentSeenNotification = Template.bind({});
CommentSeenNotification.args = {
  path: notification.data?.extraParams?.path?.join(' > '),
  icon: 'notifications/comment',
  notification: { ...notification, state: NotificationState.Seen },
};
