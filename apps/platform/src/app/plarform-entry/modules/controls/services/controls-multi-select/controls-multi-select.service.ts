import { MultiselectRootTranslationKey } from 'core/modules/multiselect/constants/constants';
import { StatusWindowModalComponent, StatusModalWindowInputKeys, StatusType, ModalWindowService } from 'core/modules/modals';
import { ControlsFacadeService } from 'core/modules/data/services';
import { ControlsReportService } from '../controls-report/controls-report.service';
import { MultiselectButtonDefinition } from 'core/modules/multiselect/models/multiselect-button.model';
import { CalculatedControl } from 'core/modules/data/models';
import { Injectable } from '@angular/core';
import { MenuAction } from 'core/modules/dropdown-menu';

@Injectable()
export class ControlsMultiSelectService {
  readonly controlsMarkedAsNASuccessfully = {
    id: 'controls-marked-as-na-successfully',
    componentType: StatusWindowModalComponent,
    contextData: {
      [StatusModalWindowInputKeys.statusType]: StatusType.SUCCESS,
      [StatusModalWindowInputKeys.closeModalOnClick]: true,
      [StatusModalWindowInputKeys.withDescriptionText]: false,
      [StatusModalWindowInputKeys.translationKey]: `${MultiselectRootTranslationKey}.controls.successNAModal`
    },
  };

  readonly controlsMarkedAsRelevantSuccessfully = {
    id: 'controls-marked-as-relevant-successfully',
    componentType: StatusWindowModalComponent,
    contextData: {
      [StatusModalWindowInputKeys.statusType]: StatusType.SUCCESS,
      [StatusModalWindowInputKeys.closeModalOnClick]: true,
      [StatusModalWindowInputKeys.withDescriptionText]: false,
      [StatusModalWindowInputKeys.translationKey]: `${MultiselectRootTranslationKey}.controls.successRelevantModal`
    },
  };

  get threeDotsButtons(): MenuAction<Map<string, any>>[] {
    return [
      {
        translationKey: 'multiselect.buttons.setAsNA',
        action: async (selectedItems) => {
          const controls_ids = Array.from(selectedItems.keys());
          await this.controlsFacadeService.batchChangeApplicability(controls_ids, false);
          this.modalWindowService.openInSwitcher({
            componentsToSwitch: [
              this.controlsMarkedAsNASuccessfully
            ]
          });
        },
      },
      {
        translationKey: 'multiselect.buttons.markAsRelevant',
        action: async (selectedItems) => {
          const controls_ids = Array.from(selectedItems.keys());
          await this.controlsFacadeService.batchChangeApplicability(controls_ids, true);
          this.modalWindowService.openInSwitcher({
            componentsToSwitch: [
              this.controlsMarkedAsRelevantSuccessfully
            ]
          });
        },
      },
    ];
  }

  get multiselectButtons(): MultiselectButtonDefinition[] {
    return [
      {
        translationKey: 'generateReport',
        cssClass: 'secondary-white',
        action: (selectedItems) => {
          const control_ids = Array.from(selectedItems.keys());
          this.controlsReportService.generateReport(control_ids);
        },
      },
    ];
  }

  private multiselectItems: CalculatedControl[];

  get MultiselectItems(): CalculatedControl[] {
    return this.multiselectItems;
  }

  constructor(private controlsReportService: ControlsReportService, private controlsFacadeService: ControlsFacadeService, private modalWindowService: ModalWindowService) { }

  setControlsForMultiselect(controlListEntities: CalculatedControl[]): void {
    this.multiselectItems = controlListEntities;
  }
}
