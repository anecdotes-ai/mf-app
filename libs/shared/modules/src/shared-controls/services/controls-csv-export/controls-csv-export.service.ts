import { ControlsFacadeService } from 'core/modules/data/services/facades';
import { FilterOptionState } from 'core/modules/data-manipulation/data-filter';
import { Injectable } from '@angular/core';
import { CsvFormatterService, FileDownloadingHelperService } from 'core/services';
import { Framework } from 'core/modules/data/models/domain';
import { CalculatedControl } from 'core/modules/data/models';
import { HipaaFrameworkId, ITGCFrameworkId, SocTwoFrameworkId, SocTwoFrameworkName } from 'core/constants';
import { createSortCallback } from 'core/utils';
import { AnecdotesUnifiedFramework } from 'core/modules/data/constants';
import { UserEventService } from 'core/services/user-event/user-event.service';
import { UserEvents, ControlEventDataProperty, ControlsExportingType } from 'core/models/user-events/user-event-data.model';

export const csvHeaders = ['Category', 'Control name', 'Control description', 'FW reference'];

export const tscHeaders = ['Trusted service Criteria ', 'Control name', 'Control description'];

@Injectable()
export class ControlsCsvExportService {
  constructor(
    private csvFormatterService: CsvFormatterService,
    private fileDownloadingHelperService: FileDownloadingHelperService,
    private userEventService: UserEventService,
    private controlsFacadeService: ControlsFacadeService
  ) {}

  exportControlsToCsv(controls: CalculatedControl[], framework: Framework, filters?: string[]): void {
    this.controlsFacadeService.trackControlsExporting(controls, framework, ControlsExportingType.Controls, filters);

    const controlsCsvData = this.formatControlsData(controls, framework);
    const controlsCsvHeaders = this.formatCsvHeaders(controls);
    this.prepareAndDownloadCsv(controlsCsvData, controlsCsvHeaders, framework.framework_name);
  }

  exportControlsWithTsc(controls: CalculatedControl[], framework: Framework, filters?: string[]): void {
    let controlsData: string[][] = [];
    let controlsWithoutTsc: string[][] = [];
    controls.map((control) => {
      const tscList = control.control_related_frameworks_names[SocTwoFrameworkName];
      if (tscList?.length > 1) {
        tscList.map((tscItem) => {
          controlsData.push([tscItem, control.control_name, control.control_description]);
        });
      }
      if (tscList?.length === 1 && tscList[0] !== '') {
        controlsData.push([tscList[0], control.control_name, control.control_description]);
      }
      if (!tscList || (tscList.length === 1 && tscList[0] === '')) {
        controlsWithoutTsc.push(['', control.control_name, control.control_description]);
      }
    });
    controlsData = this.sortCcvData(controlsData);
    controlsData = [...controlsData, ...controlsWithoutTsc];
    this.prepareAndDownloadCsv(controlsData, tscHeaders, framework.framework_name);

    this.controlsFacadeService.trackControlsExporting(controls, framework, ControlsExportingType.TrustServiceCriteria, filters);
  }

  private sortCcvData(data: string[][]): string[][] {
    return  data.sort((a, b) =>
      a[0].localeCompare(b[0], undefined, { numeric: true })
    );
  }

  private formatCsvHeaders(controls: CalculatedControl[]): string[] {
    const maxRequirementsCount = this.getMaxRequirementsCount(controls);
    return [...csvHeaders, ...Array.from({ length: maxRequirementsCount }, (_, i) => `Requirement ${i + 1}`)];
  }

  private formatControlsData(controls: CalculatedControl[], framework: Framework): string[][] {
    const maxRequirementsCount = this.getMaxRequirementsCount(controls);

    return controls.map((control) => {
      const applicableRequirementNames = control.control_calculated_requirements
        .filter((req) => req.requirement_applicability)
        .map((req) => req.requirement_name);

      return [
        control.control_category,
        control.control_name,
        control.control_description,
        this.getControlCriterias(control, framework)?.join(','),
        ...Array.from({
          ...applicableRequirementNames,
          length: maxRequirementsCount,
        }),
      ];
    });
  }

  private getMaxRequirementsCount(controls: CalculatedControl[]): number {
    return Math.max(...controls.map((control) => control.control_number_of_requirements));
  }

  private getControlCriterias(control: CalculatedControl, framework: Framework): string[] {
    let controlCriterias: string[] = [];
    if (framework.framework_id === AnecdotesUnifiedFramework.framework_id) {
      controlCriterias = Object.values(control.control_related_frameworks_names).reduce((a, b) => a.concat(b), []);
    } else if (
      framework.framework_id === SocTwoFrameworkId ||
      framework.framework_id === HipaaFrameworkId ||
      framework.framework_id === ITGCFrameworkId
    ) {
      controlCriterias = control.control_related_frameworks_names[framework.framework_name];
    }

    return (controlCriterias || [])
      .map((controlName) => controlName.split(' ')[0].replace(/\n/g, ','))
      .sort(createSortCallback((controlName) => controlName.toLocaleLowerCase()));
  }

  private prepareAndDownloadCsv(csvData: string[][], headers: string[], frameworkName: string): void {
    const csv = this.csvFormatterService.createCsvBlob(csvData, headers);
    this.fileDownloadingHelperService.downloadBlob(csv, `${frameworkName}_controls_list_by_anecdotes.csv`);
  }
}
