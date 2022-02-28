import { RootTranslationkey } from './../../constants/translation-keys.constant';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding, Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { FrameworkService } from 'core/modules/data/services';
import { ControlsCustomizationModalService } from 'core/modules/shared-controls/modules/customization/control/services/controls-customization-modal-service/controls-customization-modal.service';
import { SubscriptionDetacher } from 'core/utils';
import { DataSearchComponent, SearchDefinitionModel } from 'core/modules/data-manipulation/search';
import { DataFilterManagerService } from 'core/modules/data-manipulation/data-filter';
import { EvidenceInstance } from 'core/modules/data/models/domain';
@Component({
  selector: 'app-evidence-pool-header',
  templateUrl: './evidence-pool-header.component.html',
  styleUrls: ['./evidence-pool-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvidencePoolHeaderComponent implements OnInit {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  @Input()
  isEmptyStateWithNoEvidence: boolean;

  @ViewChild(DataSearchComponent)
  private searchComponent: DataSearchComponent;

  searchDefinitions: SearchDefinitionModel<EvidenceInstance>[] = [
    {
      propertySelector: (c) => c.evidence_name,
    }
  ];

  filteredCount: number;

  @HostBinding('class.padding-right')
  filtersBtnDisplayed = true;

  constructor(
    private cd: ChangeDetectorRef,
    private filterManager: DataFilterManagerService,
    public controlsCustomizationModalService: ControlsCustomizationModalService,
    public frameworkService: FrameworkService
  ) { }

  ngOnInit(): void {
    this.filterManager
      .getToggledEvent()
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((v) => {
        this.filtersBtnDisplayed = !v;
        this.cd.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.filterManager.close(true);
    this.detacher.detach();
  }

  filtersButtonClick(): void {
    this.filterManager.open();
  }

  resetAllFilters(): void {
    this.searchComponent.reset();
    this.filterManager.reset();
    this.cd.detectChanges();
  }

  buildTranslationKey(key: string): string {
    return `${RootTranslationkey}.header.${key}`;
  }
}
