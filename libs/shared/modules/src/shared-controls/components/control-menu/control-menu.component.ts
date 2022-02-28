import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MenuAction } from 'core/modules/dropdown-menu';
import { CalculatedControl } from 'core/modules/data/models';
import { ControlsFacadeService } from 'core/modules/data/services';
import { SubscriptionDetacher } from 'core/utils';
import { ControlsReportService } from 'core/modules/shared-controls/services';
import { ControlsCustomizationModalService } from '../../modules/customization/control/services';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-control-menu',
  templateUrl: './control-menu.component.html',
  styleUrls: ['./control-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlMenuComponent implements OnInit, OnDestroy {
  private detacher = new SubscriptionDetacher();
  public isLoading = false;

  @Input()
  controlId: string;

  @Input()
  frameworkId: string;

  calculatedControl: CalculatedControl;
  threeDotsMenuActions: MenuAction<CalculatedControl>[] = [
    {
      translationKey: this.buildTranslationKey('threeDotsMenu.edit'),
      action: () => this.editControl(),
      disabledCondition: (control) => control.is_snapshot
    },
    {
      translationKey: this.buildTranslationKey('threeDotsMenu.remove'),
      displayCondition: (control) => control.control_is_custom,
      action: () => this.removeCustomControl(),
      disabledCondition: (control) => control.is_snapshot
    },
    {
      translationKeyFactory: (control) =>
        this.buildTranslationKey(
          control.control_is_applicable ? 'threeDotsMenu.markAsNotApplicable' : 'threeDotsMenu.markAsRelevant'
        ),
      action: () => this.changeControlApplicability(),
      disabledCondition: (control) => control.is_snapshot
    },
    {
      translationKey: this.buildTranslationKey('threeDotsMenu.generateReport'),
      action: () => this.generateReport(),
    },
  ];

  constructor(
    private controlsFacade: ControlsFacadeService,
    private controlsCustomizationModalService: ControlsCustomizationModalService,
    private controlsReportService: ControlsReportService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.controlsFacade
      .getSingleControl(this.controlId)
      .pipe(filter(control => !!control), this.detacher.takeUntilDetach())
      .subscribe((calculatedControl) => {
        this.calculatedControl = calculatedControl;
        this.cd.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  threeDotsMenuClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  buildTranslationKey(relativeKey: string): string {
    return `controls.${relativeKey}`;
  }

  private editControl(): void {
    this.controlsCustomizationModalService.openEditCustomControlModal(this.frameworkId, this.controlId);
  }

  private removeCustomControl(): void {
    this.controlsCustomizationModalService.openRemoveCustomControlConfirmation(this.controlId);
    this.cd.detectChanges();
  }

  private async changeControlApplicability(): Promise<void> {
    this.isLoading = true;
    this.cd.detectChanges();
    try {
      await this.controlsFacade.batchChangeApplicability([this.controlId], !this.calculatedControl.control_is_applicable);
    } finally {
      this.isLoading = false;
      this.cd.detectChanges();
    }
  }

  private generateReport(): void {
    this.controlsReportService.generateReport([this.controlId], this.frameworkId);
  }
}
