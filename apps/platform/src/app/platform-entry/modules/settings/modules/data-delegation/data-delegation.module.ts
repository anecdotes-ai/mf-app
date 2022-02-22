import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from 'core';
import { ComponentSwitcherModule } from 'core/modules/component-switcher';
import { DynamicFormModule } from 'core/modules/dynamic-form';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { DataDelegationPageComponent } from './components/data-delegation-page/data-delegation-page.component';
import { DelegationSectionComponent } from './components/delegation-section/delegation-section.component';
import { DelegationItemComponent } from './components/delegation-item/delegation-item.component';

const routes: Route[] = [{ path: '', component: DataDelegationPageComponent }];

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    PerfectScrollbarModule,
    DynamicFormModule,
    ComponentSwitcherModule,
  ],
  declarations: [
    DataDelegationPageComponent,
    DelegationSectionComponent,
    DelegationItemComponent
  ],
})
export class DataDelegationModule {}
