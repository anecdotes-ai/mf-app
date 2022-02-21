import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { SearchDefinitionModel } from 'core/modules/data-manipulation/search';
import { SortDefinition } from 'core/modules/data-manipulation/sort';
import { CalculatedEvidence } from 'core/modules/data/models';
import { Service } from 'core/modules/data/models/domain';
import { DataAggregationFacadeService, EvidenceFacadeService, RequirementsFacadeService } from 'core/modules/data/services';
import { SubscriptionDetacher } from 'core/utils';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, shareReplay, take } from 'rxjs/operators';
import { DropdownControlComponent } from 'core/modules/dropdown-menu';

@Component({
  selector: 'app-evidence-list-filter',
  templateUrl: './evidence-list-filter.component.html',
  styleUrls: ['./evidence-list-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvidenceListFilterComponent implements OnInit, OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  private translationKey = 'connectEvidenceModal.evidenceConnectFromRequirement';
  private filteredEvidencesSubject = new BehaviorSubject<CalculatedEvidence[]>([]);
  private currentPluginFilter: string;
  private sortedEvidence: CalculatedEvidence[];

  sortDefinitions: SortDefinition<CalculatedEvidence>[] = [
    {
      id: 'evidence_name',
      propertySelector: (e) => e.evidence_name,
      translationKey: 'x',
    },
  ];

  searchDefinitions: SearchDefinitionModel<CalculatedEvidence>[] = [
    {
      propertySelector: (e) => e.evidence_name,
    },
  ];

  @Input() requirementId: string;
  @Input() frameworkId: string;

  @HostListener('window:keyup', ['$event'])
  private keyEvent(event: KeyboardEvent): void {
    if (event.key == 'Backspace' || event.key == 'Delete') {
      this.handleKeyboardEvent();
    }
  }

  @ViewChild(DropdownControlComponent) private dropdownControlComponent: DropdownControlComponent;

  searchTerm: string;
  selectedPlugin: Service;
  allEvidences$: Observable<CalculatedEvidence[]>;
  filteredEvidences$: Observable<CalculatedEvidence[]>;
  filteredEvidence: CalculatedEvidence[];
  pluginNames: string[];
  pluginFilterControl: FormControl;

  constructor(
    private requirementFacade: RequirementsFacadeService,
    private dataAggregationFacadeService: DataAggregationFacadeService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.pluginFilterControl = new FormControl();
    this.filteredEvidences$ = this.filteredEvidencesSubject.pipe(shareReplay());
    this.getEvidenceList();
  }

  private handleKeyboardEvent(): void {
    if (this.dropdownControlComponent.isDropdownOpened) {
      this.dropdownControlComponent.selectItem(undefined);
    }
  }

  handleSearch(foundEvidence: CalculatedEvidence[]): void {
    this.filteredEvidencesSubject.next(foundEvidence);
  }

  handlePluginFilter(pluginName: string): void {
    this.currentPluginFilter = pluginName;
    this.filterEvidence();
    this.cd.detectChanges();
  }

  handleSort(sortedEvidence: CalculatedEvidence[]): void {
    this.sortedEvidence = sortedEvidence;
    this.filterEvidence();
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  buildTranslationKey(key: string): string {
    return `${this.translationKey}.${key}`;
  }

  private filterEvidence(): void {
    if (this.currentPluginFilter) {
      this.filteredEvidence = this.sortedEvidence.filter(
        (ev) => ev.evidence_service_display_name === this.currentPluginFilter
      );
    } else {
      this.filteredEvidence = this.sortedEvidence;
    }
  }

  private getEvidenceList(): void {
    this.allEvidences$ = combineLatest([
      this.requirementFacade.getRequirement(this.requirementId),
      this.dataAggregationFacadeService.getEvidenceRelevantForFramework(this.frameworkId)
    ]).pipe(
      map(([requirement, evidences]) =>
        evidences.filter((evidence) => !requirement.requirement_evidence_ids.some((x) => x === evidence.evidence_id))
      ),
      this.detacher.takeUntilDetach(),
      shareReplay()
    );

    this.allEvidences$.pipe(this.detacher.takeUntilDetach(), take(1)).subscribe((evidences) => {
      this.filteredEvidencesSubject.next(evidences);
      this.pluginNames = Array.from(new Set(evidences.map((ev) => ev.evidence_service_display_name)));
      this.cd.detectChanges();
    });
  }
}
