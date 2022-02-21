import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SvgIconsModule } from '../svg-icons';
import { EvidenceWrapperComponent, EvidenceIconComponent } from './components';

@NgModule({
  imports: [CommonModule, SvgIconsModule],
  declarations: [EvidenceWrapperComponent, EvidenceIconComponent],
  exports: [EvidenceWrapperComponent, EvidenceIconComponent],
})
export class SharedEvidenceModule {}
