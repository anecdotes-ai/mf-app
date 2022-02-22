import { ComponentSwitcherModule } from 'core/modules/component-switcher';
import { OnboardingModule } from './../onboarding/onboarding.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomePageComponent } from './components';
import { Route, RouterModule } from '@angular/router';
import { GuidelineOverviewComponent } from './components/guideline-overview/guideline-overview.component';
import { CoreModule } from 'core';
import { TranslateModule } from '@ngx-translate/core';
import { WelcomeHeaderComponent } from './components/welcome-header/welcome-header.component';

const routes: Route[] = [{ path: '', component: WelcomePageComponent }];

@NgModule({
  imports: [
    CoreModule,
    TranslateModule,
    CommonModule,
    RouterModule.forChild(routes),
    OnboardingModule,
    ComponentSwitcherModule,
  ],
  declarations: [WelcomePageComponent, GuidelineOverviewComponent, WelcomeHeaderComponent],
})
export class WelcomeModule {}
