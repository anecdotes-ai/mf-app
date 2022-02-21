import { EvidenceSourcesEnum } from './../../models/evidence-sources.model';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CombinedEvidenceInstance, EvidenceTypeEnum } from 'core/modules/data/models/domain';
import { removeWhitespaces } from 'core/utils/remove-whitespaces.function';
import { RegularDateFormat, RegularDateFormatMMMdyyyy } from 'core/constants/date';
import { DateViewTypeEnum } from 'core/modules/shared-controls/constants/dateViewType';

@Component({
  selector: 'app-evidence-metadata',
  templateUrl: './evidence-metadata.component.html',
  styleUrls: ['./evidence-metadata.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvidenceMetadataComponent {
  dateViewTypes = DateViewTypeEnum;
  evidenceTypes = EvidenceTypeEnum;
  evidenceIsApplicable: boolean;

  @Input() evidence: CombinedEvidenceInstance;
  @Input() viewPreviewMode: boolean;
  @Input() icon?: string;

  @Input()
  itemsCount: number;
  @Input()
  dateViewType = DateViewTypeEnum.Regular;

  @Input()
  shouldDisplay = false;

  @Input()
  contextSource: EvidenceSourcesEnum;

  sources = EvidenceSourcesEnum;

  @Input()
  displaySearchItemsAmount = false;

  get dateFormat(): string {
    return this.viewPreviewMode ? RegularDateFormat : RegularDateFormatMMMdyyyy;
  }

  buildTranslationKey(relativeKey: string): string {
    return `evidences.${relativeKey}`;
  }

  removeWhitespacesFunc(str: string): string {
    return removeWhitespaces(str);
  }

  getTranslationKeyForEvidenceItemCount(): string {
    const relativeKey = `evidenceItemsCount.${(this.evidence.evidence_type || '').toLowerCase()}`;
    const partialKey = this.evidence.evidence_items_count > 1 ? 'plural' : 'singular';
    return this.buildTranslationKey(`${relativeKey}.${partialKey}`);
  }
}
