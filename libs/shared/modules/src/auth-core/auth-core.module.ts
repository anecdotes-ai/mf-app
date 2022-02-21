import { AuthEventService } from './services/auth/auth-event-service/auth-event.service';
import { SamlFacadeService } from './services/facades/saml-facade/saml-facade.service';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AuthGuardService, AuthRoleGuard, RoleService, AuthService, UserFacadeService, TenantFacadeService, SamlService } from './services';
import { FirebaseWrapperService, TenantService, UserService, TenantSubDomainExtractorService } from './services';
import { StoreModule } from '@ngrx/store';
import * as storeFeature from './store';
import { EffectsModule } from '@ngrx/effects';
import { PluginOauthHandlerService, PluginRedirectionGuardService } from './services';
import { UserLogoComponent } from './components';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { UtilsModule } from 'core/modules/utils';

@NgModule({
  imports: [
    CommonModule,
    AngularFireModule.initializeApp(environment.config.firebase),
    StoreModule.forFeature(storeFeature.featureKey, storeFeature.reducers),
    EffectsModule.forFeature([storeFeature.UserEffects]),
    SvgIconsModule,
    UtilsModule
  ],
  declarations: [UserLogoComponent],
  exports: [UserLogoComponent]
})
export class AuthCoreModule {
  static forRoot(): ModuleWithProviders<AuthCoreRootModule> {
    return {
      ngModule: AuthCoreModule,
      providers: [
        AuthService,
        AuthEventService,
        RoleService,
        SamlService,
        AuthRoleGuard,
        AuthGuardService,
        FirebaseWrapperService,
        TenantService,
        UserService,
        UserFacadeService,
        TenantFacadeService,
        SamlFacadeService,
        TenantSubDomainExtractorService,
        PluginOauthHandlerService,
        PluginRedirectionGuardService,
      ],
    };
  }
}

@NgModule({
  imports: [CommonModule, AuthCoreModule, AngularFireModule.initializeApp(environment.config.firebase)],
})
class AuthCoreRootModule {}
