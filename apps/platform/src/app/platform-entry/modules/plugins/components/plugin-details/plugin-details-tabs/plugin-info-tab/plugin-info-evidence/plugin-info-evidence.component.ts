import { Component, Input, OnInit } from '@angular/core';
import { Service, EvidenceInstance } from 'core/modules/data/models/domain';
import { EvidenceTypeIconMapping } from 'core';

@Component({
  selector: 'app-plugin-info-evidence',
  templateUrl: './plugin-info-evidence.component.html',
  styleUrls: ['./plugin-info-evidence.component.scss'],
})
export class PluginInfoEvidenceComponent implements OnInit {
  @Input()
  evidenceInstance: EvidenceInstance;
  @Input()
  service: Service;
  evidenceType: { icon: string };

  ngOnInit(): void {
    if (this.evidenceInstance) {
      this.evidenceType = EvidenceTypeIconMapping[this.evidenceInstance.evidence_type];
    }
  }
}
