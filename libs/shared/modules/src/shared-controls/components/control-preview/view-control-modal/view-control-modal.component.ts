import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CalculatedControl } from 'core/modules/data/models';
import { ControlsFacadeService } from 'core/modules/data/services';
import { ControlsNavigator } from 'core/modules/shared-controls';
import { ExploreControlsSource } from 'core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ControlPreviewModalParams } from 'core/modules/shared-controls/models';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { SubscriptionDetacher } from 'core/utils';

@Component({
  selector: 'app-view-control-modal',
  templateUrl: './view-control-modal.component.html',
  styleUrls: ['./view-control-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewControlModal implements OnInit, OnDestroy {
  private detacher = new SubscriptionDetacher();

  @Input()
  controlId: string;

  control$: Observable<CalculatedControl>;

  context: ControlPreviewModalParams;

  constructor(
    private controlsNavigator: ControlsNavigator,
    private controlFacade: ControlsFacadeService,
    private componentSwitcher: ComponentSwitcherDirective
  ) {}

  ngOnInit(): void {
    this.control$ = this.controlFacade.getControl(this.controlId);
    this.componentSwitcher.sharedContext$
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((context) => (this.context = context));
  }

  async viewFullControl(): Promise<void> {
    const control = await this.control$.pipe(take(1)).toPromise();
    await this.controlsNavigator.navigateToControlsPageAsync(
      control.control_framework_id,
      { searchQuery: control.control_name },
      ExploreControlsSource.RiskManagement,
      true,
      {
        expandControlsIds: [control.control_id],
      }
    );
  }

  buildTranslationKey(relativeKey: string): string {
    return `controls.viewControlModal.${relativeKey}`;
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }
}
