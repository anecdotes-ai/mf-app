import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from 'core/core.module';
import { SelectFromExistingComponent, ItemCreationModalComponent, ItemEditModalComponent } from './components';
import { DynamicFormModule } from '../dynamic-form';
import { CustomizationModalService } from './services/customization-modal-service/customization-modal.service';

@NgModule({
  imports: [CoreModule, TranslateModule, DynamicFormModule],
  declarations: [SelectFromExistingComponent, ItemEditModalComponent, ItemCreationModalComponent],
  exports: [ItemEditModalComponent, ItemCreationModalComponent],
  providers: [CustomizationModalService],
})
export class CustomizationModule {}
