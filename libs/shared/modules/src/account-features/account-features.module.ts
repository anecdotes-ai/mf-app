import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from 'core/core.module';
import { AccountFeatureEnabledDirective } from './directives';
import { ExclusiveFeatureButtonComponent, ExclusiveFeatureModalComponent } from './components';
import { ButtonsModule } from 'core/modules/buttons';
import { ExclusiveFeatureModalService } from './services';

@NgModule({
  declarations: [AccountFeatureEnabledDirective, ExclusiveFeatureModalComponent, ExclusiveFeatureButtonComponent],
  imports: [CommonModule, CoreModule, TranslateModule.forChild(), ButtonsModule],
  providers: [ ExclusiveFeatureModalService ],
  exports: [AccountFeatureEnabledDirective, ExclusiveFeatureButtonComponent],
})
export class AccountFeaturesModule {}
