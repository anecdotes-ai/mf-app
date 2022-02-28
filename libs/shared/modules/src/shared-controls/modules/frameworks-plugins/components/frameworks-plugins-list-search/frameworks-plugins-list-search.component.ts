import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { SearchDefinitionModel } from 'core/modules/data-manipulation/search';
import { Service, EvidenceInstance } from 'core/modules/data/models/domain';
import { BehaviorSubject, Observable } from 'rxjs';
import { EvidenceFacadeService, PluginFacadeService } from 'core/modules/data/services';
import { SubscriptionDetacher } from 'core/utils';
import { FormControl } from '@angular/forms';
import { shareReplay, take } from 'rxjs/operators';

@Component({
  selector: 'app-frameworks-plugins-list-search',
  templateUrl: './frameworks-plugins-list-search.component.html',
  styleUrls: ['./frameworks-plugins-list-search.component.scss'],
})
export class FrameworksPluginsListSearchComponent implements OnInit, OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  private translationKey = 'frameworksPlugins.frameworksPluginsList.search';
  private foundPluginsSubject = new BehaviorSubject<Service[]>([]);
  private allEvidencesList: EvidenceInstance[];

  searchDefinitions: SearchDefinitionModel<Service>[] = [
    {
      propertySelector: (s) => s.service_display_name,
    },
  ];

  searchTerm: string;
  allPlugins$: Observable<Service[]>;
  foundPlugins$: Observable<Service[]>;
  foundPlugins: Service[];
  pluginSearchControl = new FormControl();

  @Input() activateAllPluginsDisabled = false;

  @Output() activateAllPluginsEvent = new EventEmitter<any>();

  constructor(
    private pluginFacade: PluginFacadeService,
    private cd: ChangeDetectorRef,
    private evidenceFacadeService: EvidenceFacadeService
  ) {}

  ngOnInit(): void {
    this.setUpDataForFiltering();
    this.foundPlugins$ = this.foundPluginsSubject.pipe(shareReplay());
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  handleSearch(foundPlugins: Service[]): void {
    this.foundPluginsSubject.next(foundPlugins);
  }

  activateAllPlugins(): void {
    this.activateAllPluginsEvent.emit(true);
  }

  buildTranslationKey(key: string): string {
    return `${this.translationKey}.${key}`;
  }

  private setUpDataForFiltering(): void {
    this.evidenceFacadeService
      .getAllEvidences()
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((evidences) => {
        this.allEvidencesList = evidences;
        this.getPluginsList();
      });
  }

  private getPluginsList(): void {
    this.allPlugins$ = this.pluginFacade.getInstalledAndFailedPlugins().pipe(this.detacher.takeUntilDetach());
    this.allPlugins$.pipe(this.detacher.takeUntilDetach(), take(1)).subscribe((plugins) => {
      plugins.forEach((p) => {
        p.service_evidence_list = [];
        p.service_evidence_list = [...this.getEvidenceListForPlugin(p.service_id)];
      });
      this.foundPluginsSubject.next(plugins);
      this.foundPlugins = plugins;
      this.cd.detectChanges();
    });
  }

  private getEvidenceListForPlugin(plugin_id: string): EvidenceInstance[] {
    const evidencesOfPlugin: EvidenceInstance[] = this.allEvidencesList.filter(
      (e) => e.evidence_service_id == plugin_id && e.evidence_collection_timestamp
    );
    return evidencesOfPlugin;
  }
}
