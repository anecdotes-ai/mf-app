import { ThreadStateEnum } from '@anecdotes/commenting';
import { ChangeDetectionStrategy, Component, HostBinding, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RoleEnum } from 'core/modules/auth-core/models/domain';
import { FocusingService } from 'core/modules/focusing-mechanism';
import { VirtualScrollRendererComponent } from 'core/modules/rendering/components';
import { delayedPromise, SubscriptionDetacher } from 'core/utils';
import { Observable, Subject } from 'rxjs';
import { delay, filter, map } from 'rxjs/operators';
import { CommentEntityNameEnum, ThreadViewModel } from '../../models';
import { CommentPanelManagerService } from '../../services';

@Component({
  selector: 'app-commenting-panel',
  templateUrl: './commenting-panel.component.html',
  styleUrls: ['./commenting-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentingPanelComponent implements OnInit, OnDestroy {
  private detacher = new SubscriptionDetacher();
  private threads: ThreadViewModel[];
  @ViewChild('renderer', { static: true })
  private renderer: VirtualScrollRendererComponent;

  @HostBinding('class')
  private classes = 'flex flex-col h-full';

  threads$: Observable<ThreadViewModel[]>;
  filter$: Observable<ThreadViewModel[]>;
  resourceIdSelector = this.selectThreadId.bind(this);
  newThreadsStream$ = new Subject<ThreadViewModel>();
  overallCommentsCount$: Observable<number>;

  areActiveDisplayed$: Observable<boolean>;
  areResolvedDisplayed$: Observable<boolean>;
  adminRole = RoleEnum.Admin;

  constructor(
    private commentPanelManagerService: CommentPanelManagerService,
    private focusingService: FocusingService
  ) {}

  ngOnInit(): void {
    this.areActiveDisplayed$ = this.commentPanelManagerService
      .getStateThreadsDisplayedBy()
      .pipe(map((state) => state === ThreadStateEnum.Active));

    this.areResolvedDisplayed$ = this.commentPanelManagerService
      .getStateThreadsDisplayedBy()
      .pipe(map((state) => state === ThreadStateEnum.Resolved));

    this.threads$ = this.commentPanelManagerService.getCommentingResources();
    this.filter$ = this.commentPanelManagerService.getDisplayedCommentingResources();
    this.overallCommentsCount$ = this.commentPanelManagerService.getCommentsCount();
    this.commentPanelManagerService
      .getResourceToCreateThreadFor()
      .pipe(
        delay(500),
        this.detacher.takeUntilDetach(),
        filter((resourceToCreateThreadFor) => !!resourceToCreateThreadFor)
      )
      .subscribe((resourceToCreateThreadFor) => {
        this.renderer.scrollToId(
          this.createThreadCreationId(resourceToCreateThreadFor.resourceType, resourceToCreateThreadFor.resourceId)
        );
      });

    this.threads$.pipe(this.detacher.takeUntilDetach()).subscribe((threads) => {
      this.threads = threads;
    });

    this.focusingService
      .getFocusingStreamForResource(CommentEntityNameEnum.Thread)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((threadId) => {
        this.renderer.scrollToId(threadId);
        this.focusingService.finishFocusing(CommentEntityNameEnum.Thread);
      });
  }

  closePanel(): void {
    this.commentPanelManagerService.close();
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  async handleCreatedThread(createdThreadId: string): Promise<void> {
    await delayedPromise(500);
    this.renderer.scrollToId(createdThreadId);
  }

  buildTranslationKey(relativeKey: string): string {
    return `commenting.${relativeKey}`;
  }

  private selectThreadId(resource: ThreadViewModel): string {
    if (resource.isCreation) {
      return this.createThreadCreationId(resource.resourceType, resource.resourceId);
    }

    return resource.threadId;
  }

  private createThreadCreationId(resourceType: string, resourceId: string): string {
    return `creation_${this.createTrackingResourceId(resourceType, resourceId)}`;
  }

  private createTrackingResourceId(resourceType: string, resourceId: string): string {
    return `${resourceType}_${resourceId}`;
  }
}
