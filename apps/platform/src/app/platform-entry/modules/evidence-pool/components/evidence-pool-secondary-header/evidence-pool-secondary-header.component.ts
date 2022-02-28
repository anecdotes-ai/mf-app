import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { SortDefinition, DataSortComponent } from 'core/modules/data-manipulation/sort';
import { EvidenceInstance } from 'core/modules/data/models/domain';
import { RootTranslationkey } from './../../constants/translation-keys.constant';

@Component({
  selector: 'app-evidence-pool-secondary-header',
  templateUrl: './evidence-pool-secondary-header.component.html',
  styleUrls: ['./evidence-pool-secondary-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvidencePoolSecondaryHeaderComponent implements OnInit, OnChanges {
  sortDefinition: SortDefinition<EvidenceInstance>[];

  @ViewChild(DataSortComponent, { static: true })
  sortComponent: DataSortComponent;

  @Input()
  dataToDisplay: EvidenceInstance[];

  @Input()
  filteredCount: number;

  @Output()
  sort = new EventEmitter<EvidenceInstance[]>();

  ngOnChanges(changes: SimpleChanges): void {
    if ('dataToDisplay' in changes && this.dataToDisplay) {
      this.sortComponent.data = this.dataToDisplay;
      this.forceSort();
    }
  }

  ngOnInit(): void {
    this.createSortDefinition();
  }

  buildTranslationKey(key: string): string {
    return `${RootTranslationkey}.secondaryHeader.${key}`;
  }

  private forceSort(): void {
    this.sortComponent.sortBySelectedDefinition();
  }

  private createSortDefinition(): void {
    this.sortDefinition = [
      {
        id: 'by-date',
        propertySelector: (e: EvidenceInstance) => e.evidence_collection_timestamp,
        translationKey: 'By Date',
      },
      {
        id: 'by-plugin',
        propertySelector: (e: EvidenceInstance) => e.evidence_service_display_name,
        translationKey: 'By Plugin',
      },
    ];
  }
}
