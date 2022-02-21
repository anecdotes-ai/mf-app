import {
  AnecdotesFooterComponent,
  StatusMarkComponent,
  SuccessAnimationComponent,
  TextComponent,
  StepperHeaderComponent,
  StatusBarComponent,
  CircleProgressComponent,
  TimeComponent,
  ChipComponent,
  EmptyStateComponent,
  LinkedEntitiesComponent,
  MultilineTextWithElipsisComponent,
  UserAvatarComponent
} from './components';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LottieModule } from 'ngx-lottie';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { RouterModule } from '@angular/router';
import { ButtonsModule } from './../buttons/buttons.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DirectivesModule } from 'core/modules/directives';
import { MutationObserverWrapper } from './services';

@NgModule({
  imports: [
    CommonModule,
    LottieModule,
    SvgIconsModule,
    TranslateModule,
    NgCircleProgressModule,
    RouterModule,
    ButtonsModule,
    NgbTooltipModule,
    DirectivesModule,
  ],
  declarations: [
    SuccessAnimationComponent,
    StatusMarkComponent,
    TextComponent,
    AnecdotesFooterComponent,
    StepperHeaderComponent,
    StatusBarComponent,
    CircleProgressComponent,
    TimeComponent,
    ChipComponent,
    EmptyStateComponent,
    LinkedEntitiesComponent,
    MultilineTextWithElipsisComponent,
    UserAvatarComponent
  ],
  exports: [
    SuccessAnimationComponent,
    StatusMarkComponent,
    TextComponent,
    AnecdotesFooterComponent,
    StepperHeaderComponent,
    StatusBarComponent,
    CircleProgressComponent,
    TimeComponent,
    ChipComponent,
    EmptyStateComponent,
    LinkedEntitiesComponent,
    MultilineTextWithElipsisComponent,
    UserAvatarComponent
  ],
  providers: [MutationObserverWrapper],
})
export class UtilsModule {}
