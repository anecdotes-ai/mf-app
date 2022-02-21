import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LoadersModule } from '../loaders';
import { StatusBadgeComponent } from './components/status-badge/status-badge.component';

@NgModule({
  declarations: [StatusBadgeComponent],
  imports: [CommonModule, TranslateModule, LoadersModule],
  exports: [StatusBadgeComponent],
})
export class StatusBadgeModule {}
