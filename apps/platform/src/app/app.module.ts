import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from 'core';
import { DataModule } from 'core/modules/data';
import { AuthCoreModule } from 'core/modules/auth-core';
import { SvgIconsModule } from 'core/modules/svg-icons';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    CoreModule.forRoot(), //
    DataModule.forRoot(), //
    AuthCoreModule.forRoot(), //
    SvgIconsModule.forRoot(), //

    RouterModule.forRoot(
      [
        {
          path: '',
          loadChildren: () =>
            import('./platform-entry/platform-entry.module').then(
              (m) => m.PlatformEntryModule
            ),
        },
      ],
      { initialNavigation: 'enabledBlocking' }
    ),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
