import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { SocTwoFrameworkName } from 'core/constants';
import { FileDownloadingHelperService } from 'core/services';
import { AccountFeaturesService, ExclusiveFeatureModalService } from 'core/modules/account-features';
import { CalculatedControl } from 'core/modules/data/models';
import { AccountFeatureEnum, Framework } from 'core/modules/data/models/domain';
import { ControlsFacadeService, EvidenceService } from 'core/modules/data/services';
import { MenuAction } from 'core/modules/dropdown-menu';
import { ModalWindowService } from 'core/modules/modals';
import { ControlsCsvExportService } from 'core/modules/shared-controls';
import { SubscriptionDetacher } from 'core/utils';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ControlsExportModalComponent } from '../controls-export-modal/controls-export-modal.component';
import { ActionsIds } from 'core/modules/shared-controls/models';
import { ControlsExportingType } from 'core/models/user-events/user-event-data.model';

export enum ExportType {
  Controls,
  FilteredControls,
  Evidence,
  Logs,
}
@Component({
  selector: 'app-controls-export-menu',
  templateUrl: './controls-export-menu.component.html',
})
export class ControlsExportMenuComponent implements OnInit, OnChanges, OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  @Input()
  filteredData: CalculatedControl[];

  @Input()
  framework: Framework;

  @Input('appliedFiltersNames')
  appliedFiltersNames: string[];

  exportLoading$ = new Subject<boolean>();
  exportMenuActions: MenuAction[];
  allControls: CalculatedControl[] = [];
  canExport: boolean;

  constructor(
    private controlsCsvExporter: ControlsCsvExportService,
    private evidenceService: EvidenceService,
    private fileDownloadingHelperService: FileDownloadingHelperService,
    private modalWindowService: ModalWindowService,
    private controlsFacade: ControlsFacadeService,
    private accountFeaturesService: AccountFeaturesService,
    private exclusiveModal: ExclusiveFeatureModalService
  ) {}

  ngOnInit(): void {
    this.accountFeaturesService
      .doesAccountHaveFeature(AccountFeatureEnum.ExportControls)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((canExport) => (this.canExport = canExport));

    this.controlsFacade
      .getControlsByFrameworkId(this.framework.framework_id)
      .pipe(
        filter((controls) => !!controls),
        this.detacher.takeUntilDetach()
      )
      .subscribe((controls) => {
        this.allControls = controls.filter((control) => control.control_is_applicable);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const filteredDataName = 'filteredData';
    if (filteredDataName in changes && changes[filteredDataName].currentValue) {
      if (this.allControls.length > changes[filteredDataName].currentValue.length) {
        this.exportMenuActions = this.createExportActions(true);
      } else {
        this.exportMenuActions = this.createExportActions(false);
      }
    }
  }

  buildTranslationKey(relativeKey: string): string {
    return `controls.secondaryHeader.${relativeKey}`;
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  private createExportActions(isDataFiltered: boolean): MenuAction[] {
    const commonActions = [
      {
        translationKey: this.buildTranslationKey('exportMenu.allControls'),
        action: () => this.exportDataByType(ExportType.Controls),
        id: ActionsIds.ExportAllControls,
      },
      {
        translationKey: this.buildTranslationKey('exportMenu.allEvidence'),
        action: () => this.exportDataByType(ExportType.Evidence),
        id: ActionsIds.ExportAllEvidence,
      },
      {
        translationKey: this.buildTranslationKey('exportMenu.allLogs'),
        action: () => this.exportDataByType(ExportType.Logs),
        id: ActionsIds.ExportAllLogs,
      },
    ];

    return isDataFiltered
      ? [
          {
            translationKey: this.buildTranslationKey('exportMenu.filteredControls'),
            action: () => this.exportDataByType(ExportType.FilteredControls),
            id: ActionsIds.ExportFilteredControls,
          },
          ...commonActions,
        ]
      : commonActions;
  }

  private exportDataByType(exportType: ExportType): void {
    if (!this.canExport) {
      this.exclusiveModal.openExclusiveFeatureModal(AccountFeatureEnum.ExportControls);
      return;
    }
    switch (exportType) {
      case ExportType.Controls:
        this.exportAllControls();
        break;
      case ExportType.Evidence:
        this.downloadAllEvidences();
        break;
      case ExportType.Logs:
        this.downloadLogs();
        break;
      case ExportType.FilteredControls:
        this.exportFilteredControls();
        break;
    }
  }

  private exportFilteredControls(): void {
    if (this.framework.framework_name === SocTwoFrameworkName) {
      this.openControlsExportModal(this.filteredData, true);
    } else {
      this.controlsCsvExporter.exportControlsToCsv(this.filteredData, this.framework, this.appliedFiltersNames);
    }
  }

  private exportAllControls(): void {
    if (this.framework.framework_name === SocTwoFrameworkName) {
      this.openControlsExportModal(this.allControls, false);
    } else {
      this.controlsCsvExporter.exportControlsToCsv(this.allControls, this.framework);
    }
  }

  private async downloadAllEvidences(): Promise<any> {
    this.exportLoading$.next(true);
    const url = await this.evidenceService.downloadAllEvidences(this.framework.framework_id).toPromise();
    this.fileDownloadingHelperService.downloadFileByUrl(url);
    this.exportLoading$.next(false);

    this.controlsFacade.trackControlsExporting(this.allControls, this.framework, ControlsExportingType.Evidences);
  }

  private async downloadLogs(): Promise<any> {
    this.exportLoading$.next(true);
    const url = await this.evidenceService.downloadLogs().toPromise();
    this.fileDownloadingHelperService.downloadFileByUrl(url);

    this.controlsFacade.trackControlsExporting(this.allControls, this.framework, ControlsExportingType.Logs);

    this.exportLoading$.next(false);
  }

  private openControlsExportModal(controls: CalculatedControl[], isFiltersApplied: boolean): void {
    this.modalWindowService.openInSwitcher({
      componentsToSwitch: [
        {
          id: 'controls-export-modal',
          componentType: ControlsExportModalComponent,
          contextData: {
            controls: controls,
            framework: this.framework,
            currentFiltersNames: this.appliedFiltersNames,
            isFiltersApplied: isFiltersApplied,
          },
        },
      ],
    });
  }
}
