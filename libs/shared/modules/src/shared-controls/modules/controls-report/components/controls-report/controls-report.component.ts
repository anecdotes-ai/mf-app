import { Component, HostBinding, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoaderManagerService } from 'core/services';
import { CalculatedControl } from 'core/modules/data/models';
import { Customer, Framework } from 'core/modules/data/models/domain';
import { ControlsFacadeService, CustomerFacadeService, FrameworksFacadeService } from 'core/modules/data/services/facades';
import { SubscriptionDetacher } from 'core/utils';
import { combineLatest, Observable } from 'rxjs';
import { map, mapTo, shareReplay, take } from 'rxjs/operators';

@Component({
  selector: 'app-controls-report',
  templateUrl: './controls-report.component.html',
  styleUrls: ['./controls-report.component.scss'],
})
export class ControlsReportComponent implements OnInit, OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  private readonly control_ids: string[];
  private readonly framework_id: string;

  customer$: Observable<Customer>;
  controls$: Observable<CalculatedControl[]>;
  framework$: Observable<Framework>;
  isAllLoaded$: Observable<boolean>;

  @HostBinding('class.on-printing')
  private onPrintingStyles: boolean;

  @HostListener('window:beforeprint', [])
  private onBeforePrint(): void {
    this.onPrintingStyles = true;
  }

  @HostListener('window:afterprint', [])
  private onAfterPrint(): void {
    this.onPrintingStyles = false;
  }

  constructor(
    private route: ActivatedRoute,
    private controlsFacade: ControlsFacadeService,
    private loaderManagerService: LoaderManagerService,
    private frameworksFacade: FrameworksFacadeService,
    private customerFacadeService: CustomerFacadeService,
  ) {
    this.framework_id = this.route.snapshot.queryParams['framework_id'];
    if (!this.framework_id) {
      this.control_ids = JSON.parse(this.route.snapshot.queryParams['control_ids']);
    }
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  ngOnInit(): void {
    // Set loader display
    this.loaderManagerService.show();

    const combineLatestArray = [];

    // Set data listeners
    this.customer$ = this.customerFacadeService.getCurrentCustomer();

    if (this.framework_id) {
      this.controls$ = this.controlsFacade.getControlsByFrameworkId(this.framework_id).pipe(
        shareReplay()
      );
      this.framework$ = this.frameworksFacade.getFrameworkById(this.framework_id);
      combineLatestArray.push(this.framework$);

    } else {
      this.controls$ = this.controlsFacade.getAllControls().pipe(
        map((controls) => controls.filter((control) => this.control_ids.includes(control.control_id))),
        shareReplay()
      );
    }

    combineLatestArray.push(this.controls$, this.customer$);

    this.isAllLoaded$ = combineLatest(combineLatestArray).pipe(take(1), mapTo(true), shareReplay());

    this.isAllLoaded$.pipe(this.detacher.takeUntilDetach()).subscribe(() => this.loaderManagerService.hide());
  }

  buildTranslationKey(key: string): string {
    return `controls.report.${key}`;
  }
}
