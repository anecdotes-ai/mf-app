import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from 'core';
import { DataManipulationModule } from 'core/modules/data-manipulation';
import { DropdownMenuModule } from 'core/modules/dropdown-menu';
import { DynamicFormModule } from 'core/modules/dynamic-form';
import { InviteUserModule } from 'core/modules/invite-user';
import { RenderingModule } from 'core/modules/rendering';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import {
    UserItemComponent,
    UserManagementComponent,
    UserManagementHeaderComponent,
    UsersListComponent
} from './components';

const routes: Route[] = [{ path: '', component: UserManagementComponent }];

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    InviteUserModule,
    SvgIconsModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    PerfectScrollbarModule,
    DynamicFormModule,
    DataManipulationModule,
    RenderingModule,
    DropdownMenuModule,
  ],
  declarations: [UserItemComponent, UserManagementComponent, UserManagementHeaderComponent, UsersListComponent],
})
export class UserManagementModule {}
