import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { LoaderManagerService } from 'core';
import { ControlsFacadeService, CustomerFacadeService } from 'core/modules/data/services';
import { ModalWindowService } from 'core/modules/modals';
import { SubscriptionDetacher } from 'core/utils';
import { Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
@Component({
  selector: 'app-controls-page',
  templateUrl: './controls-page.component.html',
  styleUrls: ['./controls-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlsPageComponent implements OnInit, OnDestroy {
  private displayOnboardingModal: boolean;
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  @ViewChild('startedWithFrameworksAdoption')
  private startedWithFrameworksAdoptionModalTemplate: TemplateRef<any>;

  customerIsOnboarded$: Observable<boolean>;
  noApplicableControls$: Observable<boolean>;
  isControlsDisplayed$: Observable<boolean>;

  constructor(
    private modalWindowService: ModalWindowService,
    private controlsFacade: ControlsFacadeService,
    private loaderManager: LoaderManagerService,
    private customerFacadeService: CustomerFacadeService
  ) {}

  async ngOnInit(): Promise<void> {
    this.loaderManager.show();

    this.customerIsOnboarded$ = this.customerFacadeService.getCurrentCustomerIsOnboarded();

    this.customerIsOnboarded$
      .pipe(
        filter((x) => x !== undefined),
        take(1),
        this.detacher.takeUntilDetach()
      )
      .subscribe((customerIsOnboarded) => {
        this.displayOnboardingModal = !customerIsOnboarded;
      });

    this.noApplicableControls$ = this.controlsFacade
      .getAllControls()
      .pipe(map((x) => x.every((control) => !control.control_is_applicable)));

    this.isControlsDisplayed$ = this.noApplicableControls$.pipe(
      map((noApplicableControls) => !noApplicableControls),
      tap((isDisplayed) => {
        // in case there are controls displayed, wait for them to be rendered
        if (!isDisplayed) {
          this.loaderManager.hide();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.detacher.detach();
    this.loaderManager.hide();
  }

  controlsLoaded(): void {
    this.loaderManager.hide();
    if (this.displayOnboardingModal) {
      this.modalWindowService.open({ template: this.startedWithFrameworksAdoptionModalTemplate });
      this.displayOnboardingModal = false;
    }
  }

  buildTranslationKey(relativeKey: string): string {
    return `controls.${relativeKey}`;
  }
}
