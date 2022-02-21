import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommentPanelManagerService } from 'core/modules/commenting';
import { DataFilterManagerService } from 'core/modules/data-manipulation/data-filter';
import { SubscriptionDetacher } from 'core/utils';
import { combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, map, shareReplay, skip } from 'rxjs/operators';

enum PanelState {
  Expanded = 'expanded',
  Collapsed = 'collapsed',
}

@Component({
  selector: 'app-sliding-panel-outlet',
  templateUrl: './sliding-panel-outlet.component.html',
  styleUrls: ['./sliding-panel-outlet.component.scss'],
  animations: [
    trigger('expandCollapse', [
      state(PanelState.Collapsed, style({ width: '0' })),
      state(PanelState.Expanded, style({ width: '*' })),
      transition(`${PanelState.Collapsed} => ${PanelState.Expanded}`, animate('0.5s')),
      transition(`${PanelState.Expanded} => ${PanelState.Collapsed}`, animate('0.5s'))
    ]),
  ]
})
export class SlidingPanelOutletComponent implements OnInit {
  private detacher = new SubscriptionDetacher();
  constructor(private dataFilterManagerService: DataFilterManagerService, private commentPanelManagerService: CommentPanelManagerService, private cd: ChangeDetectorRef) { }
  
  isCommentingPanelOpen$: Observable<boolean>;
  isFilterPanelOpen$: Observable<boolean>

  panelState: PanelState = PanelState.Collapsed;

  ngOnInit(): void {
    const combined = combineLatest([this.commentPanelManagerService.isOpen(), this.dataFilterManagerService.isOpen()]).pipe(map(([isCommentingPanelOpen, isFilterPanelOpen]) => ({ isCommentingPanelOpen, isFilterPanelOpen })), shareReplay());

    this.commentPanelManagerService.isOpen().pipe(this.detacher.takeUntilDetach()).subscribe((isOpen) => {
      if (isOpen) {
        this.dataFilterManagerService.close();
      }
    });

    this.dataFilterManagerService.isOpen().pipe(
      skip(1), // This helps to handle opened filter by default and at the same time case when there is focused thread/comment
      this.detacher.takeUntilDetach()
      ).subscribe((isOpen) => {
      if (isOpen) {
        this.commentPanelManagerService.close();
      }
    });

    this.isCommentingPanelOpen$ = combined.pipe(map((x) => x.isCommentingPanelOpen && !x.isFilterPanelOpen));
    this.isFilterPanelOpen$ = combined.pipe(map((x) => !x.isCommentingPanelOpen && x.isFilterPanelOpen));

    combined.pipe(map((x) => x.isCommentingPanelOpen || x.isFilterPanelOpen), distinctUntilChanged(), this.detacher.takeUntilDetach()).subscribe(isPanelOpen => {
      this.panelState = isPanelOpen ? PanelState.Expanded : PanelState.Collapsed;
      this.cd.detectChanges();
    });
  }
}
