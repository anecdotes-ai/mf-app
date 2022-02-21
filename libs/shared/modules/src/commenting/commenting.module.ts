import { AnecdotesCommentingModule } from '@anecdotes/commenting';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { ButtonsModule } from 'core/modules/buttons';
import { DropdownAtomsModule, DropdownMenuModule } from 'core/modules/dropdown-menu';
import { FormControlsModule } from 'core/modules/form-controls';
import { RenderingModule } from 'core/modules/rendering';
import { UtilsModule } from 'core/modules/utils';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import {
  CommentingPanelComponent,
  CommentBubbleComponent,
  CommentViewComponent,
  CommentInputComponent,
  ThreadCreationComponent,
  ThreadHeaderComponent,
  ThreadItemComponent,
  ReplyComponent,
  ThreadStateFilterComponent,
  ActiveThreadComponent,
  ResolvedThreadComponent,
  ResolveButtonComponent,
  NoCommentsEmptyStateComponent,
  ResolveAllActionComponent,
  DeleteAllActionComponent,
  CommentingPannelButtonComponent
} from './components';
import {
  CommentingConfigurationProviderService,
  CommentingTokenProviderService,
  CommentPanelManagerService,
  ConfirmationModalService,
  CommentingFacadeService,
  CommentingUserEventsService
} from './services';
import { featureKey, reducers } from './store';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { DirectivesModule } from 'core/modules/directives';
import { FocusingMechanismModule } from 'core/modules/focusing-mechanism';
import { AuthCoreModule } from 'core/modules/auth-core';
import { EffectsModule } from '@ngrx/effects';
import { effects } from './store/effects';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RenderingModule,
    DropdownMenuModule,
    DropdownAtomsModule,
    RenderingModule,
    DropdownMenuModule,
    FormControlsModule,
    UtilsModule,
    StoreModule.forFeature(featureKey, reducers),
    FocusingMechanismModule.forRoot(),
    PerfectScrollbarModule,
    ButtonsModule,
    ReactiveFormsModule,
    SvgIconsModule,
    NgbTooltipModule,
    TranslateModule,
    DirectivesModule,
    AnecdotesCommentingModule,
    AuthCoreModule
  ],
  declarations: [
    CommentingPanelComponent,
    ThreadItemComponent,
    CommentViewComponent,
    CommentBubbleComponent,
    ThreadHeaderComponent,
    ThreadCreationComponent,
    CommentingPannelButtonComponent,
    CommentInputComponent,
    ReplyComponent,
    ThreadStateFilterComponent,
    ActiveThreadComponent,
    ResolvedThreadComponent,
    ResolveButtonComponent,
    NoCommentsEmptyStateComponent,
    ResolveAllActionComponent,
    DeleteAllActionComponent,
  ],
  exports: [CommentingPanelComponent, CommentBubbleComponent, CommentingPannelButtonComponent],
})
export class CommentingModule {
  static forRoot(): ModuleWithProviders<CommentingModule> {
    return {
      ngModule: CommentingModule,
      providers: [
        ...AnecdotesCommentingModule.forRoot(CommentingConfigurationProviderService, CommentingTokenProviderService)
          .providers,
        ...EffectsModule.forFeature(effects).providers,
        CommentPanelManagerService,
        ConfirmationModalService,
        CommentingFacadeService,
        CommentingUserEventsService
      ],
    };
  }
}
