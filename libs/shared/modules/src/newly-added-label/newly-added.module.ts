import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewlyAddedComponent } from './component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [NewlyAddedComponent],
  imports: [CommonModule, TranslateModule ],
  exports: [NewlyAddedComponent],
})
export class NewlyAddedModule {}
