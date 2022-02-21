import { RequirementCustomizationModalService } from './requirement/services/requirement-customization-modal-service/requirement-customization-modal.service';
import { ControlCustomizationComponent } from './control/components/control-customization/control-customization.component';
import { ControlsCustomizationModalService } from './control/services';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from 'core/core.module';
import {
  RequirementCreationModalComponent, SelectFromExistingComponent,
} from './requirement';
import { DynamicFormModule } from 'core/modules/dynamic-form/';
import { RequirementEditModalComponent } from './requirement/components/requirement-edit-modal/requirement-edit-modal.component';

@NgModule({
  imports: [CoreModule, TranslateModule, DynamicFormModule],
  declarations: [
    RequirementCreationModalComponent,
    SelectFromExistingComponent,
    ControlCustomizationComponent,
    RequirementEditModalComponent,
  ],
  exports: [
    RequirementCreationModalComponent,
    ControlCustomizationComponent,
  ],
  providers: [ControlsCustomizationModalService, RequirementCustomizationModalService],
})
export class CustomizationModule {}
