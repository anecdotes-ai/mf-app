import { Injector } from '@angular/core';
import { AppConfigService } from '../services/config/app.config.service';
import { TranslateService } from '@ngx-translate/core';

export function setDefaultLanguage(injector: Injector): any {
  const configService = injector.get(AppConfigService);
  const translateService = injector.get(TranslateService);
  const defaultLangFromConfig = configService.config.internationalization.defaultLanguage;
  const defaultResolvedLang = defaultLangFromConfig ? defaultLangFromConfig : 'en-US';
  translateService.setDefaultLang(defaultResolvedLang);
  translateService.use(defaultResolvedLang);
}
