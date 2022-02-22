import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter, Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { CalculatedControl } from 'core/modules/data/models';
import { Framework } from 'core/modules/data/models/domain';
import { ControlsFacadeService, CategoriesFacadeService, SnapshotsFacadeService } from 'core/modules/data/services';
import { MenuAction } from 'core/modules/dropdown-menu';
import { MultiselectButtonDefinition } from 'core/modules/multiselect/models/multiselect-button.model';
import { ControlsFocusingService } from 'core/modules/shared-controls/services';
import { SubscriptionDetacher } from 'core/utils';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { Observable, Subject } from 'rxjs';
import { delay, filter, shareReplay, take, tap } from 'rxjs/operators';
import { ControlOrCategory } from '../../models';
import { ControlsMultiSelectService } from '../../services/controls-multi-select/controls-multi-select.service';
import { VirtualScrollRendererComponent } from "core/modules/rendering/components";

export const EXPAND_DELAY = 50;

@Component({
  selector: 'app-controls-renderer',
  templateUrl: './controls-renderer.component.html',
  styleUrls: ['./controls-renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlsRendererComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  // ** SUBSCRIPTIONS **
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  private displayedDataSubject = new Subject<any[]>();
  private controlNameToScrollTo: string;
  // ** DATA **
  controlsIdsToExpand: { [controlId: string]: boolean } = {};
  newlyAddedControls: { [controlId: string]: boolean } = {};

  parentScrollElement: HTMLElement;
  multiselectData: {
    threeDotsMenu?: MenuAction<Map<string, any>>[];
    actionButtons?: MultiselectButtonDefinition[];
    items?: CalculatedControl[];
  } = {};
  allControlsStream$: Observable<CalculatedControl[]>;
  filteredControlsStream$: Observable<CalculatedControl[]>;
  controlAddingStream$: Observable<CalculatedControl>;
  controlOrCategoryIdSelector = this.selectIdFromControlOrCategory.bind(this);
  buildRenderingItemsCallback = this.buildRenderingItems.bind(this);

  // ** INPUTS / OUTPUTS **
  @Input() framework: Framework;

  @Input() displayedData: CalculatedControl[] = [];

  @Input() parentScroller: PerfectScrollbarComponent;

  @Input() displayedRequirementsAndEvidences: {
    [controlId: string]: { requirement_id: string; evidence_ids: string[] }[];
  };
  @Input() auditHistoryMode = false;

  @Output() rendered = new EventEmitter();

  // ** VIEW CHILD/REN **
  @ViewChildren('controlWrapper')
  private renderedControlsWrappers: QueryList<ElementRef<HTMLDivElement>>;

  @ViewChild('virtualScrollRenderer')
  private virtualScrollRenderer: VirtualScrollRendererComponent;

  constructor(
    private router: Router,
    public controlsMultiselectService: ControlsMultiSelectService,
    private categoriesFacade: CategoriesFacadeService,
    private controlFacade: ControlsFacadeService,
    private snapshotsFacadeService: SnapshotsFacadeService,
    private route: ActivatedRoute,
    private controlsFocusing: ControlsFocusingService
  ) {
    this.setControlIdsToBeExpanded();
  }


  multiselectPropertySelector = (control: CalculatedControl): any => {
    return control.control_id;
  };

  ngOnInit(): void {
    this.parentScrollElement = this.parentScroller?.directiveRef?.elementRef.nativeElement;
    this.multiselectData.actionButtons = this.controlsMultiselectService.multiselectButtons;
    this.multiselectData.threeDotsMenu = this.controlsMultiselectService.threeDotsButtons;

    const action = this.auditHistoryMode ?
      this.snapshotsFacadeService.getControlsSnapshot(this.framework.related_controls_snapshots) :
      this.controlFacade.getControlsByFrameworkId(this.framework.framework_id);
    
    this.allControlsStream$ = action.pipe(
      filter((controls) => !!controls),
      shareReplay()
    );
    this.filteredControlsStream$ = this.displayedDataSubject;
    this.controlAddingStream$ = this.controlFacade.getControlAddedByUserEvent().pipe(
      tap((control) => this.markAsAdded(control.control_id))
    );

    this.controlsFocusing.getControlsFocusingStream().pipe(delay(1000), this.detacher.takeUntilDetach()).subscribe(async focusedControlId => {
      await this.virtualScrollRenderer.scrollToId(focusedControlId);
      this.controlsFocusing.finishControlFocusing();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('displayedData' in changes) {
      this.displayedDataSubject.next(this.displayedData);
      this.controlsMultiselectService.setControlsForMultiselect(this.displayedData);
      this.multiselectData.items = this.controlsMultiselectService.MultiselectItems;
    }
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  ngAfterViewInit(): void {
    this.handleRendering();
    this.scrollToControlOnQueryParamsIsSet();
  }

  isCategory(item: ControlOrCategory): boolean {
    return typeof item === 'string';
  }

  // **** CONTROL EXPANSION ****
  // we save the expand state for virtual scroll,
  // to open the item when we scroll away and then back to it.
  controlExpanded(controlId: string, isExpanded: boolean): void {
    if (this.wasControlClosed(controlId, isExpanded)) {
      delete this.controlsIdsToExpand[controlId];
    } else if (this.wasControlOpened(controlId, isExpanded)) {
      this.controlsIdsToExpand[controlId] = true;
    }
  }

  // **** TRACK-BY ****

  controlsTrackByWithIndex(_: number, control: CalculatedControl): string {
    return control?.control_id;
  }

  controlsTrackBy(control: CalculatedControl): string {
    return this.controlsTrackByWithIndex(0, control);
  }

  markAsAdded(elementId: string): void {
    this.newlyAddedControls[elementId] = true;
  }

  handleClickedControl(control: CalculatedControl): void {
    // Sets the control to be marked as *not* new anymore
    delete this.newlyAddedControls[control.control_id];
  }

  private selectIdFromControlOrCategory(item: ControlOrCategory): string {
    if (this.isCategory(item)) {
      return item as string;
    }

    return (item as CalculatedControl).control_id;
  }

  private buildRenderingItems(items: CalculatedControl[]): any[] {
    if (!items) {
      return [];
    }
    return this.categoriesFacade.groupControlsByCategory(items, this.framework.framework_id).reduce((prev, curr) => [...prev, curr.control_category, ...curr.controls], []);
  }

  private setControlIdsToBeExpanded(): void {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.expandControlsIds) {
      navigation.extras.state.expandControlsIds.forEach((controlId) => {
        this.controlsIdsToExpand[controlId] = true;
      });
    }
  }

  private handleRendering(): void {
    this.renderedControlsWrappers.notifyOnChanges();

    this.renderedControlsWrappers.changes.pipe(take(1), this.detacher.takeUntilDetach()).subscribe(() => {
      this.rendered.emit();
    });
  }

  private wasControlClosed(controlId: string, isExpanded: boolean): boolean {
    return controlId in this.controlsIdsToExpand && !isExpanded;
  }

  private wasControlOpened(controlId: string, isExpanded: boolean): boolean {
    return !(controlId in this.controlsIdsToExpand) && isExpanded;
  }

  private expandAllControls(): void {
    this.displayedData.forEach((item, indx) => {
      if (!this.isCategory(item)) {
        setTimeout(() => {
          this.controlExpanded((item as CalculatedControl).control_id, true);
        }, indx * EXPAND_DELAY);
      }
    });
  }

  private closeAllControls(): void {
    this.displayedData.forEach((item, indx) => {
      if (!this.isCategory(item)) {
        setTimeout(() => {
          this.controlExpanded((item as CalculatedControl).control_id, false);
        }, indx * EXPAND_DELAY);
      }
    });
  }

  scrollToId(id: string): void {
    this.virtualScrollRenderer.scrollToId(id);
  }

  private scrollToControlOnQueryParamsIsSet(): void {
    let controlNameToScrollTo: string = this.route.snapshot?.queryParams?.control;
    let controlToScrollTo: CalculatedControl;
    this.allControlsStream$.pipe(take(1), this.detacher.takeUntilDetach()).subscribe(
      controls => {
        controlToScrollTo = controls.find(c => c.control_name === controlNameToScrollTo);
        if(controlToScrollTo) {
          // timeout is set to avoid exclusion in lifecycle when data is set but render is not finished
          // should be changed when more viable solution is found for scrolling to elements
          setTimeout(()=>{this.virtualScrollRenderer.scrollToId(controlToScrollTo.control_id);},750);
        }
      }
    );
  }
}
