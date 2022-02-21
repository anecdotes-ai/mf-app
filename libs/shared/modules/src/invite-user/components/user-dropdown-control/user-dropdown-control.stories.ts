import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { TranslateConfigModule } from '../../../translate-config';
import { FormControlsModule } from 'core/modules/form-controls';
import { UserDropdownControlComponent, User } from './user-dropdown-control.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SubscriptionDetacher } from 'core/utils';
import { of } from 'rxjs';
import { InviteUserModalService } from '../../services';
import { OverlayModule } from '@angular/cdk/overlay';
import { UtilsModule } from 'core/modules/utils';
import { DropdownAtomsModule } from 'core/modules/dropdown-menu';
import { LoadersModule } from 'core/modules/loaders';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const user1 = {
  first_name: 'first-name1',
  last_name: 'last-name1',
  email: 'some-email1',
  photo: 'fake',
} as User;

const user2 = {
  first_name: 'first-name2',
  last_name: 'last-name2',
  email: 'some-email2',
  photo: 'fake',
} as User;

const user3 = {
  first_name: 'first-name3',
  last_name: 'last-name3',
  email: 'some-email3',
  photo: 'fake',
} as User;

const user4 = {
  first_name: 'first-name4',
  last_name: 'last-name4',
  email: 'some-email4',
  photo: 'fake',
} as User;

export default {
  title: 'Moleculas/Dropdowns/Controls/User dropdown form control',
  component: UserDropdownControlComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        FormControlsModule,
        TranslateConfigModule,
        SvgIconsModule.forRoot(),
        BrowserAnimationsModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot(),
        OverlayModule,
        UtilsModule,
        DropdownAtomsModule,
        LoadersModule,
        NgbModule,
        PerfectScrollbarModule
      ],
      providers: [
        { provide: InviteUserModalService, useValue: {} },
        {
          provide: SubscriptionDetacher,
          useValue: {
            detach: () => of(),
            takeUntilDetach: () => of(),
          },
        },
      ],
    }),
    componentWrapperDecorator((story) => `<div style="margin: 4em">${story}</div>`),
  ],
} as Meta;

const Template: Story<UserDropdownControlComponent> = (args: UserDropdownControlComponent) => ({
  props: {
    users: [user1, user2, user3, user4],
    ...args,
  },
});

export const Selected = Template.bind({});
Selected.args = {
  selectedUserEmail: 'true',
};
