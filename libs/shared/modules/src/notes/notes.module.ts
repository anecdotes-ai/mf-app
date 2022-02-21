import { DynamicFormModule } from 'core/modules/dynamic-form';
import { NoteModalWindowService } from './services/note-modal-window/note-modal-window.service';
import { NoteElementComponent, NoteModalWindowComponent } from './components';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from 'core/core.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as storeFeature from './store';
import { NoteService } from './services';
import { NoteFacadeService } from './services/facades';
import { NoteTooltipComponent } from './components/note-tooltip/note-tooltip.component';

@NgModule({
  imports: [
    CoreModule,
    TranslateModule,
    DynamicFormModule,
    StoreModule.forFeature(storeFeature.featureKey, storeFeature.reducers),
    EffectsModule.forFeature([storeFeature.NoteEffects]),
  ],
  declarations: [NoteElementComponent, NoteModalWindowComponent, NoteTooltipComponent],
  exports: [NoteElementComponent, NoteModalWindowComponent],
  providers: [NoteModalWindowService],
})
export class NotesModule {
  static forRoot(): ModuleWithProviders<NotesModule> {
    return {
      ngModule: NotesModule,
      providers: [NoteService, NoteFacadeService],
    };
  }
}
