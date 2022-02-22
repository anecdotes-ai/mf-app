import { OnboardingUserEventService } from './services/onboarding-user-event.service';
import { FormControlsModule } from 'core/modules/form-controls';
import { ButtonsModule } from 'core/modules/buttons/buttons.module';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconsModule } from 'core/modules/svg-icons/svg-icons.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingWelcomeComponent } from './components/onboarding-welcome/onboarding-welcome.component';
import { OnboardingDoneComponent } from './components/onboarding-done/onboarding-done.component';
import { OnboardingFrameworksComponent } from './components/onboarding-frameworks/onboarding-frameworks.component';
import { TipsModule } from 'core/modules/tips/tips.module';
import { OnboardingPluginsComponent } from './components/onboarding-plugins/onboarding-plugins.component';
import { OnboardingPolicyComponent } from './components/onboarding-policy/onboarding-policy.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OnboardingCompanyComponent } from './components/onboarding-company/onboarding-company.component';
import { OnboardingPolicyManagingComponent } from './components/onboarding-policy-managing/onboarding-policy-managing.component';

@NgModule({
  declarations: [
    OnboardingWelcomeComponent,
    OnboardingDoneComponent,
    OnboardingFrameworksComponent,
    OnboardingPluginsComponent,
    OnboardingPolicyComponent,
    OnboardingCompanyComponent,
    OnboardingPolicyManagingComponent,
  ],
  imports: [
    CommonModule,
    SvgIconsModule.forRoot(),
    TranslateModule,
    ButtonsModule,
    TipsModule,
    FormControlsModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    OnboardingWelcomeComponent,
    OnboardingDoneComponent,
    OnboardingFrameworksComponent,
    OnboardingPluginsComponent,
    OnboardingPolicyComponent,
    OnboardingCompanyComponent,
  ],
  providers:[
    OnboardingUserEventService
  ]
})
export class OnboardingModule {}
