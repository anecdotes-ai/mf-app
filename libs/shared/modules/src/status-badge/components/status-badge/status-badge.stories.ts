// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { CommonModule } from '@angular/common';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { ResourceStatusEnum } from '../../../data/models';
import { TranslateConfigModule } from '../../../translate-config';
import { StatusBadgeComponent } from './status-badge.component';

export default {
  title: 'Organisms/StatusBadge',
  component: StatusBadgeComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, TranslateConfigModule],
    }),
  ],
} as Meta;

const Template: Story<StatusBadgeComponent> = (args: StatusBadgeComponent) => ({
  props: args,
});

// Default

export const NotStarted = Template.bind({});
NotStarted.args = {
  status: ResourceStatusEnum.NOTSTARTED,
  hoverable: false,
};

export const Pending = Template.bind({});
Pending.args = {
  status: ResourceStatusEnum.PENDING,
  hoverable: false,
};
export const OnHold = Template.bind({});
OnHold.args = {
  status: ResourceStatusEnum.ON_HOLD,
  hoverable: false,
};
export const Approved = Template.bind({});
Approved.args = {
  status: ResourceStatusEnum.APPROVED,
  hoverable: false,
};

export const HoverableNotStarted = Template.bind({});
HoverableNotStarted.args = {
  status: ResourceStatusEnum.NOTSTARTED,
  hoverable: true,
};

export const HoverablePending = Template.bind({});
HoverablePending.args = {
  status: ResourceStatusEnum.PENDING,
  hoverable: true,
};
export const HoverableOnHold = Template.bind({});
HoverableOnHold.args = {
  status: ResourceStatusEnum.ON_HOLD,
  hoverable: true,
};
export const HoverableApproved = Template.bind({});
HoverableApproved.args = {
  status: ResourceStatusEnum.APPROVED,
  hoverable: true,
};

export const LoadingNotStarted = Template.bind({});
LoadingNotStarted.args = {
  status: ResourceStatusEnum.NOTSTARTED,
  loading: true
};

export const LoadingPending = Template.bind({});
LoadingPending.args = {
  status: ResourceStatusEnum.PENDING,
  loading: true
};
export const LoadingOnHold = Template.bind({});
LoadingOnHold.args = {
  status: ResourceStatusEnum.ON_HOLD,
  loading: true
};
export const LoadingApproved = Template.bind({});
LoadingApproved.args = {
  status: ResourceStatusEnum.APPROVED,
  loading: true
};
