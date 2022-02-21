import { FilterOptionState } from 'core/modules/data-manipulation/data-filter';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DynamicFormGroup } from 'core/modules/dynamic-form';
import { RadioButtonsGroupControl } from 'core';
import { CalculatedControl } from 'core/modules/data/models';
import { ControlsCsvExportService } from 'core/modules/shared-controls/services';
import { ModalWindowService } from 'core/modules/modals';
import { Framework } from 'core/modules/data/models/domain';

export const enum ExportMethods {
  category = 'Controls Categories',
  tsc = 'Trust Services Criteria',
}

@Component({
  selector: 'app-controls-export-modal',
  templateUrl: './controls-export-modal.component.html',
  styleUrls: ['./controls-export-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlsExportModalComponent {
  @Input('controls')
  controls: CalculatedControl[];

  @Input('framework')
  framework: Framework;

  @Input('currentFiltersNames')
  currentFiltersNames: string[];

  @Input('isFiltersApplied')
  isFiltersApplied: boolean;

  form = new DynamicFormGroup({
    exportMethod: new RadioButtonsGroupControl({
      initialInputs: {
        required: true,
        buttons: [
          {
            value: ExportMethods.category,
            label: ExportMethods.category,
          },
          {
            value: ExportMethods.tsc,
            label: ExportMethods.tsc,
          },
        ],
      },
    }),
  });

  constructor(private csvExporter: ControlsCsvExportService, private modalWindowService: ModalWindowService) {}

  buildTranslationKey(relativeKey: string): string {
    return `controlsExportModal.${relativeKey}`;
  }

  exportControls(): void {
    if (this.form.controls.exportMethod.value === ExportMethods.category) {
      this.isFiltersApplied
      ? this.csvExporter.exportControlsToCsv(this.controls, this.framework, this.currentFiltersNames)
      : this.csvExporter.exportControlsToCsv(this.controls, this.framework);
    } else {
      this.isFiltersApplied
      ? this.csvExporter.exportControlsWithTsc(this.controls, this.framework, this.currentFiltersNames)
      : this.csvExporter.exportControlsWithTsc(this.controls, this.framework);
    }
    this.modalWindowService.close();
  }
}
