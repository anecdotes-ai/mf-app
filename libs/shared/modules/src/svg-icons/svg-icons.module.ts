import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { LoggerService } from 'core/services/logger/logger.service';
import { SvgIconComponent } from './components';
import { SvgLoaderService, SvgRegistryService, SVG_SPRITE_PATH } from './services';

export function loadSprite(injector: SvgRegistryService): () => Promise<any> {
  return () => injector.initAsync();
}

@NgModule({
  imports: [CommonModule, HttpClientModule],
  declarations: [SvgIconComponent],
  exports: [SvgIconComponent],
})
export class SvgIconsModule {
  static forRoot(svgSpritePath?: string): ModuleWithProviders<SvgIconsModule> {
    svgSpritePath = svgSpritePath || '/assets/sprites/icons-sprite.svg';

    return {
      ngModule: SvgIconsModule,
      providers: [
        SvgLoaderService,
        SvgRegistryService,
        LoggerService,
        { provide: SVG_SPRITE_PATH, useValue: svgSpritePath },
        { provide: APP_INITIALIZER, useFactory: loadSprite, multi: true, deps: [SvgRegistryService] },
      ],
    };
  }
}
