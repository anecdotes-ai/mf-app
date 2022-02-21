// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { CommonModule } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/auth';
import { RouterTestingModule } from '@angular/router/testing';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { RoleEnum } from 'core/modules/auth-core/models/domain';
import { UserClaims } from 'core/modules/auth-core/models/user-claims';
import { AuthService } from 'core/modules/auth-core/services/auth/auth.service';
import { RoleService } from 'core/modules/auth-core/services/role/role.service';
import { Customer } from 'core/modules/data/models/domain';
import { CustomerFacadeService } from 'core/modules/data/services/facades/customer-facade/customer-facade.service';
import { DirectivesModule } from 'core/modules/directives';
import { DropdownAtomsModule } from 'core/modules/dropdown-menu/dropdown-atoms.module';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { TranslateConfigModule } from 'core/modules/translate-config/translate-config.module';
import { Observable, of } from 'rxjs';
import { NavigationModel } from '../../models/navigation.model';
import { NavigationBarItemComponent } from '../navigation-bar-item/navigation-bar-item.component';
import { NavigationBarComponent } from '../navigation-bar/navigation-bar.component';
import { AppRoutes } from 'core/constants/routes';
import { WindowHelperService } from 'core/services/window-helper/window-helper.service';
import { NavigationBarEventsTrackingService } from './../../services/navigation-bar-events-tracking.service';

class MockAuthService {
  getUserAsync(): Promise<UserClaims> {
    return of({ name: 'User Name', customer_id: 'Company Name' } as UserClaims).toPromise();
  }
  getUser(): Observable<UserClaims> {
    return of({ name: 'User Name', customer_id: 'Company Name' } as UserClaims);
  }
}
const routes: NavigationModel[] = [
  {
    key: 'dashboard',
    route: AppRoutes.Dashboard,
    icon: 'dashboard',
    visibleFor: [RoleEnum.Admin, RoleEnum.Collaborator],
    iconColorMode: 'stroke',
  },
  {
    key: 'frameworks',
    icon: 'frameworks',
    visibleFor: [RoleEnum.Admin, RoleEnum.Collaborator, RoleEnum.Auditor],
    route: AppRoutes.Frameworks,
    iconColorMode: 'fill',
  },
  {
    key: 'evidencePool',
    route: AppRoutes.EvidencePool,
    icon: 'evidence-pool',
    visibleFor: [RoleEnum.Admin, RoleEnum.Collaborator],
    iconColorMode: 'fill',
  },
  {
    key: 'plugins',
    route: AppRoutes.Plugins,
    icon: 'plugins',
    visibleFor: [RoleEnum.Admin, RoleEnum.It],
    iconColorMode: 'fill',
  },
  {
    key: 'policyManager',
    route: AppRoutes.PolicyManager,
    icon: 'policy-nav',
    visibleFor: [RoleEnum.Admin, RoleEnum.Collaborator],
    iconColorMode: 'fill',
    inBeta: false,
  },
  {
    key: 'api',
    route: AppRoutes.Api,
    icon: 'api',
    visibleFor: [RoleEnum.Admin, RoleEnum.Collaborator],
    iconColorMode: 'mixed',
  }
];

export default {
  title: 'Navbar component',
  component: NavigationBarComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, TranslateConfigModule, SvgIconsModule.forRoot(), RouterTestingModule, DirectivesModule, DropdownAtomsModule, ],
      declarations: [NavigationBarItemComponent],
      providers: [
        {
          provide: CustomerFacadeService,
          useValue: {
            getCurrentCustomer: ()=> of({customer_name: "Customer name"} as Customer)
          },
        },
        {
          provide: RoleService,
          useValue: {
            getCurrentUserRole: () => of({ role: 'admin' }),
          },
        },
        {
          provide: WindowHelperService,
          useValue: {
            /* eslint-disable no-console */
            openUrlInNewTab: () => console.log('OpenedNewTab'),
            getWindow: () => window,
          },
        },
        {
          provide: AngularFireAuth,
          useValue: {},
        },
        {
          provide: AuthService,
          useClass: MockAuthService,
        },
        {
          provide: NavigationBarEventsTrackingService,
          useValue: {}
        }
      ],
    }),
  ],
} as Meta;

const Template: Story<NavigationBarComponent> = (args: NavigationBarComponent) => ({
  props: args,
  template: '<app-navigation-bar style="height : 650px" [routes]="routes"></app-navigation-bar>',
});

export const Primary = Template.bind({});
Primary.args = {
  routes: routes,
};
