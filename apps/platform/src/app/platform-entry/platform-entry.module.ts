import { DirectivesModule } from 'core/modules/directives';
import { UserProfileModule } from 'core/modules/user-profile/user-profile.module';
import { MultiselectModule } from 'core/modules/multiselect';
import { HttpBackend } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule }from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AmplitudeService, HttpLoaderFactory } from 'core';
import { DataManipulationModule } from 'core/modules/data-manipulation';
import player from 'lottie-web';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { LottieModule } from 'ngx-lottie';
import { LottiePlayer } from 'ngx-lottie/src/symbols';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CoreModule } from 'core';
import { DataModule } from 'core/modules/data';
import { RiskDataModule } from 'core/modules/risk';
import { AuthCoreModule } from 'core/modules/auth-core';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { NotesModule } from 'core/modules/notes';
import { SharedPoliciesModule } from 'core/modules/shared-policies/shared-policies.module';
import { ControlsSharedModule } from 'core/modules/shared-controls/shared-controls.module';
import { NavigationBarModule } from 'core/modules/navigation-bar';
import { DataInitializationModule } from 'core/modules/data-initialization';
import { CommentingModule } from 'core/modules/commenting';
import { SlidingPanelModule } from 'core/modules/sliding-panel';
import { ApmErrorHandler } from '@elastic/apm-rum-angular';
import { ApmModule } from '@elastic/apm-rum-angular';
import { PluginsConnectionModule } from 'core/modules/plugins-connection';
import { AppRoutingModule } from './app-routing.module';
import { PlatformRemoteEntryComponent, RootComponent } from './components';

function playerFactory(): LottiePlayer {
  return player;
}

@NgModule({
  declarations: [PlatformRemoteEntryComponent, RootComponent],
  imports: [
    AppRoutingModule,
    MatButtonModule,
    CoreModule.forRoot(),
    SvgIconsModule.forRoot(),
    LottieModule.forRoot({ player: playerFactory }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpBackend],
      },
    }),
    ApmModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      // enabled: environment.production,
      enabled: true,

    }),
    PerfectScrollbarModule,
    NgCircleProgressModule.forRoot(),
    // DataModule.forRoot(),
    RiskDataModule.forRoot(),
    DataManipulationModule.forRoot(),
    DataManipulationModule,
    AuthCoreModule.forRoot(),
    NotesModule.forRoot(),
    PluginsConnectionModule.forRoot(),
    DataInitializationModule.forRoot(),
    CommentingModule.forRoot(),
    SlidingPanelModule,
    MultiselectModule,
    UserProfileModule,
    DirectivesModule,
    NavigationBarModule,
    ControlsSharedModule.forRoot(),
    SharedPoliciesModule,
  ],
  providers: [
    AmplitudeService,
    {
      provide: ErrorHandler,
      useClass: ApmErrorHandler,
    },
  ],
})
export class PlatformEntryModule {}
