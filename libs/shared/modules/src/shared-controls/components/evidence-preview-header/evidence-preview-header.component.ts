import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-evidence-preview-header',
  templateUrl: './evidence-preview-header.component.html',
  styleUrls: ['./evidence-preview-header.component.scss'],
})
export class EvidencePreviewHeaderComponent {
  @Input()
  dataToDisplay: string[] = [];
}
